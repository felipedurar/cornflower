import { CfColor, CfFont, CfNumericPosition, CfRadius, CfNumericSize } from "../CfUtils";

export default interface CfRenderable {

    getDrawingContext(): any;

    getDrawingContextType(): string;

    drawRectangle(position: CfNumericPosition, size: CfNumericSize, color: CfColor, width?: number, radius?: CfRadius): any;

    fillRectangle(position: CfNumericPosition, size: CfNumericSize, color: CfColor, radius?: CfRadius): any;

    drawString(text: string, position: CfNumericPosition, color: CfColor, font: CfFont): any;

    fillString(text: string, position: CfNumericPosition, color: CfColor, font: CfFont): any;

    measureString(text: string, font: CfFont): CfNumericSize;

    beforeRender(): void;

    afterRender(): void;

}