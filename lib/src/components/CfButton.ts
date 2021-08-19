import CfComponent from "../core/CfComponent";
import { CfAlign, CfColor, CfFont, CfNumericPosition, CfRadius, CfNumericSize } from "../core/CfUtils";
import CfContainer from "./CfContainer";
import CfText from "./CfText";
import type { CfRecursivePartial }  from '../types/CfRecursivePartial'

export default class CfButton extends CfContainer {

    public textComponent: CfText = new CfText();

    constructor(...properties: CfRecursivePartial<CfButton>[]) {
        super();

        this.textComponent.text = "Button";
        this.textComponent.textColor = new CfColor(255, 255, 255);
        this.textComponent.textFont = new CfFont('16px', 'Arial');
        this.textComponent.align = CfAlign.Center;
        this.addComponent(this.textComponent);

        this.positioningProperties.size = new CfNumericSize(150, 30);
        this.borderWidth = 0;
        this.borderRadius = new CfRadius(3);
        this.backgroundColor = new CfColor(40, 167, 69);

        this.snapshotList.push('text', 'textColor', 'textFont');

        this.applyArray(properties);

        this.attachListeners();
    }

    private attachListeners() {
        let nColor: CfColor = new CfColor(255, 255, 255);

        this.onMouseEnter.addListener(() => {
            if (!!this.snapshot.backgroundColor) 
                Object.assign(nColor, this.snapshot.backgroundColor);

            this.backgroundColor = nColor.darken(10);
            this.getRootComponent().renderAll();
        });
        this.onMouseLeave.addListener(() => {
            if (!!this.snapshot.backgroundColor) 
                Object.assign(nColor, this.snapshot.backgroundColor);

            this.backgroundColor = nColor;
            this.getRootComponent().renderAll();
        });
        this.onMouseDown.addListener(() => {
            if (!!this.snapshot.backgroundColor) 
                Object.assign(nColor, this.snapshot.backgroundColor);

            this.backgroundColor = nColor.darken(30);
            this.getRootComponent().renderAll();
        });
        this.onMouseUp.addListener(() => {
            if (!!this.snapshot.backgroundColor) 
                Object.assign(nColor, this.snapshot.backgroundColor);

            this.backgroundColor = nColor;
            this.getRootComponent().renderAll();
        });
    }

}