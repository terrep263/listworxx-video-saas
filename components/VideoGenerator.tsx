'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { VideoEngine } from './VideoEngine';
import { TextBlock } from './TextBlock';
import {
  storeAccessKey,
  hasValidAccess,
  incrementUsage,
} from '../lib/accessKey';
import AccessStatus from './AccessStatus';
import EmailGate from './EmailGate';
import TemplateSelector from './TemplateSelector';
import { Template } from '../lib/templates';

interface TextBlockConfig {
  id: string;
  y: number;
  isTitle: boolean;
}

export default function VideoGenerator() {
  const searchParams = useSearchParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const engineRef = useRef<VideoEngine | null>(null);

  const [hasAccess, setHasAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  
  const [title, setTitle] = useState('10 Reasons I Love Giving the SNAPWORXX Gallery as a Gift');
  const [titleFontSize, setTitleFontSize] = useState(100);
  const [titlePaddingX, setTitlePaddingX] = useState(40);
  const [titleColor, setTitleColor] = useState('#FFFFFF');
  const [titleBgColor, setTitleBgColor] = useState('#000000');
  const [content, setContent] = useState(`1. It's the gift of memories — not things
2. No shopping, no stress
3. Everyone can upload their photos in one place
4. It brings every angle of the event together
5. Perfect for any occasion
6. Families get to relive the moment forever
7. It's simple, modern, and thoughtful
8. No tech skills required
9. It keeps distant family connected
10. It shows you care enough to capture their joy`);
  
  const [bgFile, setBgFile] = useState<File | undefined>();
  const [audioFile, setAudioFile] = useState<File | undefined>();
  const [statusMessage, setStatusMessage] = useState('Ready');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  
  const textBlockConfigsRef = useRef<TextBlockConfig[]>([]);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  // Check for access key on mount
  useEffect(() => {
    // Check URL for key parameter
    const urlKey = searchParams.get('key');

    if (urlKey) {
      // Try to store the key from URL
      const stored = storeAccessKey(urlKey);
      if (stored) {
        setHasAccess(true);
        setIsCheckingAccess(false);
        // Remove key from URL for security
        window.history.replaceState({}, '', window.location.pathname);
        return;
      }
    }

    // Check if user already has valid access stored
    const access = hasValidAccess();
    setHasAccess(access.valid);
    setIsCheckingAccess(false);
  }, [searchParams]);

  useEffect(() => {
    if (canvasRef.current && !engineRef.current) {
      engineRef.current = new VideoEngine(canvasRef.current, bgVideoRef.current || undefined);
      engineRef.current.onLog = setStatusMessage;
    }
  }, []);

  useEffect(() => {
    if (hasAccess && engineRef.current && !isCheckingAccess) {
      init();
    }
  }, [hasAccess, isCheckingAccess]);

  const getConfig = () => ({
    title,
    titleFontSize,
    titlePaddingX,
    titleColor,
    titleBgColor,
    contentRaw: content,
    bgFile,
    audioFile,
  });

  const updateTextBlocks = () => {
    if (!engineRef.current) return;

    const engine = engineRef.current;
    const config = getConfig();
    const contentLines = config.contentRaw.split('\n').filter((x) => x.trim());

    const fixedListFontSize = 60;
    const MAX_PAGE_HEIGHT = 1850;
    const defaultTitleY = 150;

    // Title Block
    const existingTitleConfig = textBlockConfigsRef.current.find((c) => c.id === 'title');
    const currentTitleY = existingTitleConfig ? existingTitleConfig.y : defaultTitleY;

    engine.titleBlock = new TextBlock(
      'title',
      config.title,
      currentTitleY,
      config.titleFontSize,
      config.titlePaddingX,
      true,
      1000,
      config.titleColor,
      config.titleBgColor
    );

    if (!existingTitleConfig) {
      textBlockConfigsRef.current.push({ id: 'title', y: currentTitleY, isTitle: true });
    } else {
      existingTitleConfig.y = currentTitleY;
    }

    // Paging Logic
    engine.pages = [];
    let currentPageBlocks: TextBlock[] = [];
    let currentY = engine.titleBlock.y + engine.titleBlock.currentHeight;
    let pageStartTime = 0;

    const ITEM_DURATION = engine.ITEM_DURATION;
    const START_BUFFER = engine.START_BUFFER;
    const FADE_DURATION = engine.PAGE_FADE_DURATION;

    const finalizePage = () => {
      if (currentPageBlocks.length === 0) return;

      const itemRevealTime = (currentPageBlocks.length - 1) * ITEM_DURATION;
      const pageDuration = START_BUFFER + itemRevealTime + 1.5 + FADE_DURATION;

      engine.pages.push({
        startTime: pageStartTime,
        duration: pageDuration,
        listBlocks: [...currentPageBlocks],
      });

      pageStartTime += pageDuration;
      currentPageBlocks = [];
      currentY = engine.titleBlock!.y + engine.titleBlock!.currentHeight;
    };

    contentLines.forEach((line, index) => {
      const id = `item-${index}`;
      const existingConfig = textBlockConfigsRef.current.find((c) => c.id === id);

      const tempBlock = new TextBlock(id, line, 0, fixedListFontSize, 40, false, 900);
      const requiredHeight = tempBlock.currentHeight + 40;

      if (currentY + requiredHeight > MAX_PAGE_HEIGHT && currentPageBlocks.length > 0) {
        finalizePage();
      }

      const defaultY = currentY + 40;
      let finalY = defaultY;

      if (
        engine.pages.length === 0 &&
        existingConfig &&
        typeof existingConfig.y === 'number'
      ) {
        const isManuallyDragged = Math.abs(existingConfig.y - defaultY) > 5;
        finalY = isManuallyDragged ? existingConfig.y : defaultY;
      }

      const finalBlock = new TextBlock(id, line, finalY, fixedListFontSize, 40, false, 900);

      currentY = finalY + finalBlock.currentHeight;

      if (!existingConfig) {
        textBlockConfigsRef.current.push({ id: id, y: finalY, isTitle: false });
      } else {
        existingConfig.y = finalY;
      }

      currentPageBlocks.push(finalBlock);

      if (index === contentLines.length - 1) {
        finalizePage();
      }
    });

    engine.totalDuration = pageStartTime;

    if (engine.pages.length > 0) {
      engine.textBlocks = [...engine.pages[0].listBlocks];
    } else {
      engine.textBlocks = [];
    }

    engine.previewLoop();
    const pageCount = engine.pages.length || 1;
    engine.log(
      `✅ Ready. Total Video Duration: ${engine.totalDuration.toFixed(1)}s. Content Pages: ${pageCount}. Showing Page 1.`
    );
  };

  const init = async () => {
    if (!engineRef.current) return;

    const config = getConfig();
    engineRef.current.log('🔄 Loading resources and starting preview...');

    await engineRef.current.loadResources(config);

    updateTextBlocks();

    engineRef.current.enableDrag(textBlockConfigsRef.current, updateTextBlocks);

    engineRef.current.previewLoop();

    const pageCount = engineRef.current.pages.length || 1;
    engineRef.current.log(
      `✅ Ready. Total Video Duration: ${engineRef.current.totalDuration.toFixed(1)}s. Content Pages: ${pageCount}. Showing Page 1.`
    );
  };

  const handleGenerate = async () => {
    if (!engineRef.current) return;
    if (engineRef.current.pages.length === 0) {
      engineRef.current.log('❌ Cannot record: No list items found.');
    }

    // Check access before generating
    const access = hasValidAccess();
    if (!access.valid) {
      alert('Your access has expired. Please purchase more videos.');
      setHasAccess(false);
    }

    setIsGenerating(true);
    setProgress(0);

    const config = getConfig();
    await engineRef.current.loadResources(config);

    // Load audio if provided
    if (config.audioFile && engineRef.current.audioCtx) {
      const arrayBuffer = await config.audioFile.arrayBuffer();
      audioBufferRef.current = await engineRef.current.audioCtx.decodeAudioData(arrayBuffer);
    }

    const blob = await engineRef.current.startRecording(setProgress, audioBufferRef.current || undefined);

    // Increment usage counter AFTER successful generation
    incrementUsage();

    // Check if access is now expired
    const newAccess = hasValidAccess();
    if (!newAccess.valid) {
      alert('You have used all your videos! Purchase more to continue.');
      setHasAccess(false);
    }

    // Download the video
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ListWorxx_Video_${Date.now()}.webm`;
    a.click();

    setIsGenerating(false);
    setProgress(0);
  };

  const handleTemplateSelect = (template: Template) => {
    setTitleColor(template.colors.titleText);
    setTitleBgColor(template.colors.titleBg);
    setTitleFontSize(template.fonts.titleSize);
    setTitlePaddingX(template.style.titlePadding);
    setShowTemplateSelector(false);
    setTimeout(updateTextBlocks, 100);
  };

  // Show loading while checking access
  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ListWorxx...</p>
        </div>
      </div>
    );
  }

  // Show email gate or purchase gate if no access
  if (!hasAccess) {
    const skipEmailGate = searchParams.get('skip') === 'true';
    
    if (skipEmailGate) {
      const PurchaseGate = require('./PurchaseGate').default;
      return <PurchaseGate />;
    }
    
    return <EmailGate onVerified={() => {
      setHasAccess(true);
      setIsCheckingAccess(false);
    }} />;
  }

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      <AccessStatus />
      
      <h1 className="text-3xl md:text-4xl font-bold text-primary text-center mb-8">
        ListWorxx Video Generator
      </h1>

      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
        {/* Template Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowTemplateSelector(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-lg hover:shadow-xl transition-all duration-300 text-lg"
          >
            ✨ Choose from Template Library
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-bold text-primary mb-4 border-b-2 border-gray-300 pb-2">
                1. Title Content & Style
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">
                    Title Text
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setTimeout(updateTextBlocks, 100);
                    }}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">
                      Font Size (px)
                    </label>
                    <input
                      type="number"
                      value={titleFontSize}
                      onChange={(e) => {
                        setTitleFontSize(parseInt(e.target.value));
                        setTimeout(updateTextBlocks, 100);
                      }}
                      min="50"
                      max="200"
                      step="10"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">
                      Horizontal Padding
                    </label>
                    <input
                      type="number"
                      value={titlePaddingX}
                      onChange={(e) => {
                        setTitlePaddingX(parseInt(e.target.value));
                        setTimeout(updateTextBlocks, 100);
                      }}
                      min="10"
                      max="100"
                      step="5"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">
                      Text Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={titleColor}
                        onChange={(e) => {
                          setTitleColor(e.target.value);
                          setTimeout(updateTextBlocks, 100);
                        }}
                        className="w-16 h-10 border-2 border-gray-200 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={titleColor}
                        onChange={(e) => {
                          setTitleColor(e.target.value);
                          setTimeout(updateTextBlocks, 100);
                        }}
                        className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none text-sm"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">
                      Background Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={titleBgColor}
                        onChange={(e) => {
                          setTitleBgColor(e.target.value);
                          setTimeout(updateTextBlocks, 100);
                        }}
                        className="w-16 h-10 border-2 border-gray-200 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={titleBgColor}
                        onChange={(e) => {
                          setTitleBgColor(e.target.value);
                          setTimeout(updateTextBlocks, 100);
                        }}
                        className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none text-sm"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-accent font-bold">
                  Tip: Drag the title and list items in the preview to adjust position.
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-bold text-primary mb-4 border-b-2 border-gray-300 pb-2">
                2. List Content
              </h3>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">
                  List Content (One item per line)
                </label>
                <textarea
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setTimeout(updateTextBlocks, 100);
                  }}
                  rows={10}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none resize-y"
                />
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-bold text-primary mb-4 border-b-2 border-gray-300 pb-2">
                3. Background & Audio
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">
                    Background Media
                  </label>
                  <input
                    id="bg-upload"
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      setBgFile(e.target.files?.[0]);
                      setTimeout(init, 100);
                    }}
                    className="hidden"
                  />
                  <button
                    onClick={() => document.getElementById('bg-upload')?.click()}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                  >
                    📁 Upload Background
                  </button>
                  {bgFile && (
                    <p className="mt-2 text-sm text-green-600">✓ {bgFile.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">
                    Background Music
                  </label>
                  <input
                    id="audio-upload"
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setAudioFile(e.target.files?.[0])}
                    className="hidden"
                  />
                  <button
                    onClick={() => document.getElementById('audio-upload')?.click()}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                  >
                    🎵 Upload Audio
                  </button>
                  {audioFile && (
                    <p className="mt-2 text-sm text-green-600">✓ {audioFile.name}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-green-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isGenerating
                ? `🎬 Generating... ${progress.toFixed(0)}%`
                : '🚀 Generate Video'}
            </button>
            
            {isGenerating && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="flex flex-col items-center">
            <div className="relative bg-black rounded-xl overflow-hidden w-full max-w-sm aspect-[9/16]">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-center py-2 text-sm">
                {statusMessage}
              </div>
            </div>
          </div>
        </div>
      </div>

      <video ref={bgVideoRef} loop muted playsInline className="hidden" />
      
      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <TemplateSelector
          onSelectTemplate={handleTemplateSelect}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}
    </div>
  );
}
