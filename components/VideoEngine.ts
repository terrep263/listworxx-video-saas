import { TextBlock } from './TextBlock';

export interface Page {
  startTime: number;
  duration: number;
  listBlocks: TextBlock[];
}

export interface ResourceConfig {
  bgType: 'none' | 'image' | 'video' | 'color';
  bgObj: HTMLImageElement | null;
  audioBuffer: AudioBuffer | null;
}

export interface EngineConfig {
  title: string;
  titleFontSize: number;
  titlePaddingX: number;
  titleColor: string;
  titleBgColor: string;
  contentRaw: string;
  bgFile?: File;
  audioFile?: File;
}

export class VideoEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  bgVideoEl: HTMLVideoElement | null;
  
  width: number;
  height: number;
  isRecording: boolean;
  resources: ResourceConfig;
  config: EngineConfig | null;
  
  textBlocks: TextBlock[];
  titleBlock: TextBlock | null;
  
  pages: Page[];
  totalDuration: number;
  ITEM_DURATION: number;
  PAGE_FADE_DURATION: number;
  START_BUFFER: number;
  
  isDragging: boolean;
  draggedBlock: TextBlock | null;
  dragYOffset: number;
  
  scaleFactor: number;
  contentOffsetY: number;
  
  audioCtx: AudioContext | null;
  
  onLog: (msg: string) => void;

  constructor(canvas: HTMLCanvasElement, bgVideoEl?: HTMLVideoElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.bgVideoEl = bgVideoEl || null;

    this.width = 1080;
    this.height = 1920;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.isRecording = false;
    this.resources = { bgType: 'none', bgObj: null, audioBuffer: null };
    this.config = null;

    this.textBlocks = [];
    this.titleBlock = null;

    this.pages = [];
    this.totalDuration = 0;
    this.ITEM_DURATION = 1.5;
    this.PAGE_FADE_DURATION = 0.5;
    this.START_BUFFER = 2.0;

    this.isDragging = false;
    this.draggedBlock = null;
    this.dragYOffset = 0;

    this.scaleFactor = 1.0;
    this.contentOffsetY = 0;
    
    this.audioCtx = null;
    
    this.onLog = () => {};
  }

  log(msg: string) {
    this.onLog(msg);
  }

  updateScaleFactor() {
    const rect = this.canvas.getBoundingClientRect();
    const rectWidth = rect.width;
    const rectHeight = rect.height;

    const canvasAspectRatio = this.height / this.width;
    const containerAspectRatio = rectHeight / rectWidth;

    let renderedHeight;

    if (containerAspectRatio > canvasAspectRatio) {
      renderedHeight = rectWidth * canvasAspectRatio;
      this.contentOffsetY = (rectHeight - renderedHeight) / 2;
    } else {
      renderedHeight = rectHeight;
      this.contentOffsetY = 0;
    }

    this.scaleFactor = this.height / renderedHeight;
  }

  async loadResources(config: EngineConfig) {
    this.config = config;
    
    if (config.bgFile) {
      const url = URL.createObjectURL(config.bgFile);
      if (config.bgFile.type.startsWith('video')) {
        this.resources.bgType = 'video';
        if (this.bgVideoEl) {
          this.bgVideoEl.src = url;
          await new Promise((r) => (this.bgVideoEl!.onloadeddata = r));
          this.bgVideoEl.loop = true;
          this.bgVideoEl.muted = true;
          this.bgVideoEl.currentTime = 0;
          this.bgVideoEl.play().catch(() => {});
        }
      } else {
        this.resources.bgType = 'image';
        this.resources.bgObj = await this.loadImage(url);
      }
    } else {
      this.resources.bgType = 'color';
    }

    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve(img);
      };
      img.src = url;
    });
  }

  drawCover(media: HTMLImageElement | HTMLVideoElement, cw: number, ch: number) {
    const mw = 'videoWidth' in media ? media.videoWidth : media.width;
    const mh = 'videoHeight' in media ? media.videoHeight : media.height;
    const ratio = Math.max(cw / mw, ch / mh);
    const centerShift_x = (cw - mw * ratio) / 2;
    const centerShift_y = (ch - mh * ratio) / 2;
    this.ctx.drawImage(
      media,
      0,
      0,
      mw,
      mh,
      centerShift_x,
      centerShift_y,
      mw * ratio,
      mh * ratio
    );
  }

  toCanvasCoords(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();

    return {
      x: (e.clientX - rect.left) * this.scaleFactor,
      y: (e.clientY - rect.top - this.contentOffsetY) * this.scaleFactor,
    };
  }

  enableDrag(textBlockConfigs: any[], updateCallback: () => void) {
    this.canvas.onmousedown = (e: MouseEvent) => {
      if (this.isRecording) return;
      this.updateScaleFactor();
      const { x, y } = this.toCanvasCoords(e);

      const dragBlocks = [this.titleBlock, ...(this.pages[0]?.listBlocks || [])];
      for (let i = dragBlocks.length - 1; i >= 0; i--) {
        const block = dragBlocks[i];
        if (block && block.hitTest(x, y, this.width)) {
          this.isDragging = true;
          this.draggedBlock = block;
          this.dragYOffset = y - block.y;
          this.canvas.style.cursor = 'grabbing';
          break;
        }
      }
    };

    this.canvas.onmousemove = (e: MouseEvent) => {
      if (this.isRecording || !this.isDragging) return;
      this.updateScaleFactor();
      const { x, y } = this.toCanvasCoords(e);

      if (this.draggedBlock) {
        let newY = y - this.dragYOffset;
        const minAllowableY = 50;
        const maxAllowableY = this.height - this.draggedBlock.currentHeight - 50;
        this.draggedBlock.y = Math.max(minAllowableY, Math.min(newY, maxAllowableY));

        if (this.draggedBlock.isTitle) {
          updateCallback();
        }
        this.previewLoop();
      }
    };

    this.canvas.onmouseup = () => {
      this.isDragging = false;
      if (this.draggedBlock) {
        textBlockConfigs.forEach((cfg) => {
          if (cfg.id === this.draggedBlock!.id) {
            cfg.y = this.draggedBlock!.y;
          }
        });
      }
      this.draggedBlock = null;
      this.canvas.style.cursor = 'default';
      this.previewLoop();
    };
    
    this.canvas.onmouseleave = this.canvas.onmouseup;
  }

  previewLoop() {
    if (this.isRecording || !this.pages.length) return;
    this.drawFrame(0);
    if (this.resources.bgType === 'video') {
      requestAnimationFrame(() => this.previewLoop());
    }
  }

  drawFrame(time: number) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw Background
    if (this.resources.bgType === 'video' && this.bgVideoEl) {
      this.drawCover(this.bgVideoEl, w, h);
    } else if (this.resources.bgType === 'image' && this.resources.bgObj) {
      this.drawCover(this.resources.bgObj, w, h);
    } else {
      ctx.fillStyle = '#333';
      ctx.fillRect(0, 0, w, h);
    }

    // 2. Draw Title
    if (this.titleBlock) {
      this.titleBlock.draw(ctx);
    } else {
      return;
    }

    if (!this.pages.length) return;

    // 3. Find Active Page
    let activePageIndex = this.pages.findIndex((p) => time < p.startTime + p.duration);

    if (activePageIndex === -1) {
      if (time >= this.totalDuration) return;
      activePageIndex = this.pages.length - 1;
    }

    const activePage = this.pages[activePageIndex];
    const timeOnPage = time - activePage.startTime;

    let listAlpha = 1;

    // 4. Handle Page Transition Fade
    if (timeOnPage > activePage.duration - this.PAGE_FADE_DURATION) {
      listAlpha =
        1 -
        (timeOnPage - (activePage.duration - this.PAGE_FADE_DURATION)) /
          this.PAGE_FADE_DURATION;
    } else if (activePageIndex > 0 && timeOnPage < this.PAGE_FADE_DURATION) {
      listAlpha = timeOnPage / this.PAGE_FADE_DURATION;
    }

    // 5. Draw List Items
    activePage.listBlocks.forEach((block, index) => {
      const itemAppearTime = this.START_BUFFER + index * this.ITEM_DURATION;

      let itemAlpha = 1;
      let offsetY = 0;

      if (timeOnPage < itemAppearTime) return;

      const animProgress = timeOnPage - itemAppearTime;
      if (animProgress < 0.3) {
        itemAlpha = animProgress / 0.3;
        offsetY = (1 - itemAlpha) * 50;
      }

      const originalY = block.y;
      block.y += offsetY;
      block.draw(ctx, itemAlpha * listAlpha);
      block.y = originalY;
    });
  }

  async startRecording(onProgress?: (progress: number) => void, audioBuffer?: AudioBuffer) {
    this.isRecording = true;

    if (this.resources.bgType === 'video' && this.bgVideoEl) {
      this.bgVideoEl.currentTime = 0;
      this.bgVideoEl.play();
    }

    const finalDuration = this.totalDuration + this.PAGE_FADE_DURATION;
    this.log(`🎬 Recording continuous video (Duration: ${finalDuration.toFixed(1)}s)...`);

    const dest = this.audioCtx!.createMediaStreamDestination();
    let audioSource: AudioBufferSourceNode | null = null;
    if (audioBuffer) {
      audioSource = this.audioCtx!.createBufferSource();
      audioSource.buffer = audioBuffer;
      audioSource.loop = true;
      audioSource.connect(dest);
      audioSource.start(0);
    }

    const canvasStream = this.canvas.captureStream(30);
    const tracks = [...canvasStream.getVideoTracks()];
    if (audioSource) {
      tracks.push(...dest.stream.getAudioTracks());
    }
    const combinedStream = new MediaStream(tracks);

    const chunks: Blob[] = [];
    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';

    const recorder = new MediaRecorder(combinedStream, {
      mimeType: mime,
      videoBitsPerSecond: 5000000,
    });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    return new Promise<Blob>((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });

        if (audioSource) audioSource.stop();
        if (this.resources.bgType === 'video' && this.bgVideoEl) this.bgVideoEl.pause();

        this.isRecording = false;
        this.log('🎉 Video Generated!');
        this.previewLoop();
        resolve(blob);
      };

      recorder.start();
      let startTime = performance.now();

      const loop = () => {
        if (!this.isRecording) return;
        const now = performance.now();
        const elapsed = (now - startTime) / 1000;

        this.drawFrame(elapsed);

        if (elapsed < finalDuration) {
          const progress = (elapsed / finalDuration) * 100;
          this.log(`⏳ Rendering... ${progress.toFixed(0)}%`);
          if (onProgress) onProgress(progress);
          requestAnimationFrame(loop);
        } else {
          recorder.stop();
        }
      };
      loop();
    });
  }
}
