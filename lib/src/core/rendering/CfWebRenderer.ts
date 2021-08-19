import CfRenderable from "./CfRenderable";
import { CfColor, CfFont, CfNumericPosition, CfRadius, CfNumericSize } from "../CfUtils";

export default class CfWebRenderer implements CfRenderable {

    private context: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.context = ctx;
    }

    public getDrawingContext(): any {
        return this.context;
    }

    public getDrawingContextType(): string {
        return "2d";
    }

    private _createRectanglePath(position: CfNumericPosition, size: CfNumericSize, radius?: CfRadius) {
        if (!radius) radius = new CfRadius(0);

        // Based on: https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-using-html-canvas
        this.context.beginPath();
        this.context.moveTo(position.x + radius.tl, position.y);
        this.context.lineTo(position.x + size.w - radius.tr, position.y);
        this.context.quadraticCurveTo(position.x + size.w, position.y, position.x + size.w, position.y + radius.tr);
        this.context.lineTo(position.x + size.w, position.y + size.h - radius.br);
        this.context.quadraticCurveTo(position.x + size.w, position.y + size.h, position.x + size.w - radius.br, position.y + size.h);
        this.context.lineTo(position.x + radius.bl, position.y + size.h);
        this.context.quadraticCurveTo(position.x, position.y + size.h, position.x, position.y + size.h - radius.bl);
        this.context.lineTo(position.x, position.y + radius.tl);
        this.context.quadraticCurveTo(position.x, position.y, position.x + radius.tl, position.y);
        this.context.closePath();
    }

    public drawRectangle(position: CfNumericPosition, size: CfNumericSize, color: CfColor, width?: number, radius?: CfRadius) {
        if (!width) width = 1;

        this._createRectanglePath(position, size, radius);

        this.context.lineWidth = width;
        this.context.strokeStyle = color._getCssColor();
        this.context.stroke();
    }

    public fillRectangle(position: CfNumericPosition, size: CfNumericSize, color: CfColor, radius?: CfRadius) {
        this._createRectanglePath(position, size, radius);

        this.context.fillStyle = color._getCssColor();
        this.context.fill();
    }

    public drawString(text: string, position: CfNumericPosition, color: CfColor, font: CfFont) {
        this.context.font = font._getCssFont();
        this.context.strokeStyle = color._getCssColor();
        this.context.strokeText(text, position.x, position.y);
    }

    public fillString(text: string, position: CfNumericPosition, color: CfColor, font: CfFont) {
        this.context.font = font._getCssFont();
        this.context.fillStyle = color._getCssColor();
        this.context.fillText(text, position.x, position.y);
    }

    public measureString(text: string, font: CfFont): CfNumericSize {
        // Sample
        // let metrics = ctx.measureText(text);
        // let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        // let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        this.context.font = font._getCssFont();
        let metrics: TextMetrics = this.context.measureText(text);
        return new CfNumericSize(metrics.width, -(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent));
    }

    public beforeRender(): void {
        // Workaround for canvas blurry issue
        // https://stackoverflow.com/questions/8696631/canvas-drawings-like-lines-are-blurry
        this.context.translate(0.5, 0.5);
    }

    public afterRender(): void {
        this.context.translate(-0.5, -0.5);
    }

}