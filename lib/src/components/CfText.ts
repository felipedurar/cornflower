import { CfColor, CfFont, CfNumericPosition, CfRadius, CfNumericSize } from "../core/CfUtils";
import { CfRecursivePartial } from "../types/CfRecursivePartial";
import CfContainer from "./CfContainer";

export default class CfText extends CfContainer {

    public text: string = "Button";
    public textColor: CfColor = new CfColor(0, 0, 0);
    public textFont: CfFont = new CfFont('16px', 'Arial');
    
    constructor(...properties: CfRecursivePartial<CfText>[]) {
        super();

        this.positioningProperties.size = new CfNumericSize(0, 0);
        this.enableBackgroundColor = false;
        this.enableBorder = false;

        this.snapshotList.push('text', 'textColor', 'textFont');

        this.applyArray(properties);
    }

    public override preRender() {
        super.preRender();

        this.positioningProperties.size = this.renderTarget.measureString(this.text, this.textFont);
    }
    
    public override render() {
        // This will render the background
        super.render();

        let absPosition = this.getInnerRectangle().position;
        //let txtSize: CfSize = this.renderTarget.measureString(this.text, this.textFont);
        
        // let posX = absPosition.x + ((this.size.w / 2) - (txtSize.w / 2));
        // let posY = absPosition.y + ((this.size.h / 2) + (txtSize.h / 2));

        this.renderTarget.fillString(this.text, absPosition, this.textColor, this.textFont);
    }


}