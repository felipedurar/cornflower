import { CfAlign, CfColor, CfSize, CfSpaces } from "../../core/CfUtils";
import { CfRecursivePartial } from "../../types/CfRecursivePartial";
import CfButton from "../CfButton";
import CfText from "../CfText";

export default class CfContextMenuButton extends CfButton {

    public containsSubItems: boolean = false;

    // TODO
    //public rightTextComponent: CfText = new CfText();

    constructor(...properties: CfRecursivePartial<CfContextMenuButton>[]) {
        super();

        this.types.push('CfContextMenuButton');

        this.enabled = false;
        this.enableBackgroundColor = true;
        this.backgroundColor = new CfColor(25, 25, 25);
        this.padding = new CfSpaces(2, 2, 2, 2);

        this.backgroundColor = new CfColor(40, 40, 40);
        this.size = new CfSize('150', '24');
        this.textComponent.align = CfAlign.Left;
        this.textComponent.margin.left = 10;
        this.textComponent.textFont.size = '12px';


        this.applyArray(properties);
    }


}