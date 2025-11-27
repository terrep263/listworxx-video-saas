export class TextBlock {
  id: string;
  text: string;
  y: number;
  fontSize: number;
  paddingX: number;
  isTitle: boolean;
  boxWidth: number;
  lineHeight: number;
  paddingY: number;
  lineCount: number;
  currentHeight: number;
  currentTextTotalHeight: number;
  TEXT_MAX_WIDTH: number;
  textColor: string;
  bgColor: string;

  constructor(
    id: string,
    text: string,
    y: number,
    fontSize: number,
    paddingX: number,
    isTitle = false,
    boxWidth = 900,
    textColor = '#000000',
    bgColor = '#FFFFFF'
  ) {
    this.id = id;
    this.text = text;
    this.y = y;
    this.fontSize = fontSize;
    this.paddingX = paddingX;
    this.isTitle = isTitle;
    this.boxWidth = boxWidth;
    this.textColor = textColor;
    this.bgColor = bgColor;

    this.lineHeight = isTitle ? fontSize * 1.2 : fontSize * 1.25;
    this.paddingY = isTitle ? paddingX : 30;

    this.lineCount = 1;
    this.currentHeight = 0;
    this.currentTextTotalHeight = 0;

    this.TEXT_MAX_WIDTH = this.boxWidth - this.paddingX * 2;

    this.calculateMetrics();
  }

  calculateMetrics(ctx?: CanvasRenderingContext2D | null) {
    if (!ctx) {
      const canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d');
    }
    if (!ctx) return;

    ctx.font = `bold ${this.fontSize}px 'Microsoft YaHei'`;

    const words = this.text.split('');
    let line = '';
    let count = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n];
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth > this.TEXT_MAX_WIDTH && n > 0) {
        count++;
        line = words[n];
      } else {
        line = testLine;
      }
    }
    this.lineCount = count + 1;
    this.currentTextTotalHeight = this.lineCount * this.lineHeight;
    this.currentHeight = this.currentTextTotalHeight + this.paddingY;
    if (this.isTitle) {
      this.currentHeight = this.currentTextTotalHeight + this.paddingY * 2;
    }
  }

  draw(ctx: CanvasRenderingContext2D, globalAlpha = 1) {
    if (!this.text.trim()) return;

    ctx.globalAlpha = globalAlpha;

    const boxX = (ctx.canvas.width - this.boxWidth) / 2;

    if (this.isTitle) {
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
    }

    ctx.beginPath();
    if ((ctx as any).roundRect) {
      (ctx as any).roundRect(boxX, this.y, this.boxWidth, this.currentHeight, 20);
    } else {
      ctx.rect(boxX, this.y, this.boxWidth, this.currentHeight);
    }
    ctx.fillStyle = this.bgColor;
    ctx.fill();

    if (this.isTitle) {
      ctx.shadowColor = 'transparent';
    }

    ctx.fillStyle = this.textColor;
    ctx.font = `bold ${this.fontSize}px 'Microsoft YaHei'`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const textStartX = boxX + this.paddingX;
    const emptyVerticalSpace = this.currentHeight - this.currentTextTotalHeight;
    const textStartY = this.y + emptyVerticalSpace / 2;

    this._wrapTextInternal(
      ctx,
      this.text,
      textStartX,
      textStartY,
      this.TEXT_MAX_WIDTH,
      this.lineHeight
    );
    ctx.globalAlpha = 1;
  }

  _wrapTextInternal(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    const words = text.split('');
    let line = '';
    let currentLineY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n];
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentLineY);
        line = words[n];
        currentLineY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentLineY);
  }

  hitTest(px: number, py: number, canvasWidth: number) {
    const boxX = (canvasWidth - this.boxWidth) / 2;
    return (
      px >= boxX &&
      px <= boxX + this.boxWidth &&
      py >= this.y &&
      py <= this.y + this.currentHeight
    );
  }
}
