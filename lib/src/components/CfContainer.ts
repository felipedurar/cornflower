import CfComponent from "../core/CfComponent";
import CfEvent from "../core/CfEvent";
import { CfAlign, CfAnchor, CfClone, CfColor, CfContainerPositioningProperties, CfNumericPosition, CfRadius, CfRectangle, CfNumericSize, CfSpaces, CfMergeDeep, CfPosition, CfContainerPositioningModeToString, CfContainerPositioningMode, CfSize } from "../core/CfUtils";
import type { CfRecursivePartial }  from '../types/CfRecursivePartial'

export default class CfContainer extends CfComponent {

    public positioningProperties: CfContainerPositioningProperties = new CfContainerPositioningProperties();

    public backgroundColor: CfColor = new CfColor(255, 255, 255);
    public enableBackgroundColor: boolean = true;
    
    public borderColor: CfColor = new CfColor(0, 0, 0);
    public borderWidth: number = 1;
    public borderRadius: CfRadius = new CfRadius(0);
    public enableBorder: boolean = true;

    public onMouseOver: CfEvent = new CfEvent("cfMouseOver");
    public onMouseEnter: CfEvent = new CfEvent("cfMouseEnter");
    public onLongMouseEnter: CfEvent = new CfEvent("cfLongMouseEnter");
    public onMouseLeave: CfEvent = new CfEvent("cfMouseLeave");
    public onLongMouseLeave: CfEvent = new CfEvent("cfLongMouseLeave");
    public onMouseMove: CfEvent = new CfEvent("cfMouseMove");
    public onMouseDown: CfEvent = new CfEvent("cfMouseDown");
    public onMouseDownOut: CfEvent = new CfEvent("cfMouseDownOut");
    public onMouseUp: CfEvent = new CfEvent("cfMouseUp");
    public onMouseUpOut: CfEvent = new CfEvent("cfMouseUpOut");
    public onClick: CfEvent = new CfEvent("cfClick");

    private longMouseEnterTimeOut: any = null;
    private longMouseLeaveTimeOut: any = null;

    public lastMousePosition: CfNumericPosition = new CfNumericPosition(0, 0);
    public lastLocalMousePosition: CfNumericPosition = new CfNumericPosition(0, 0);
    public isMouseDown: boolean = false;

    // Once this property is set you can't set the "position" property
    // This property only takes effect if the parent component is based on a Container
    public align: CfAlign = CfAlign.None;

    public margin: CfSpaces = new CfSpaces();
    public padding: CfSpaces = new CfSpaces();

    public anchor: CfAnchor = new CfAnchor();

    public elasticSize: boolean = true;

    get position(): CfPosition {
        let cNewCfPos: CfPosition = new CfPosition(this.positioningProperties.x.value.toString() + CfContainerPositioningModeToString(this.positioningProperties.x.mode), 
            this.positioningProperties.y.value.toString() + CfContainerPositioningModeToString(this.positioningProperties.y.mode));
        cNewCfPos._xGetter = () => this.positioningProperties.x.value;
        cNewCfPos._xSetter = (value) => { this.positioningProperties.x.parseValue(value); }
        cNewCfPos._yGetter = () => this.positioningProperties.y.value;
        cNewCfPos._ySetter = (value) => { this.positioningProperties.y.parseValue(value); }
        return cNewCfPos;
    }
    set position(value: CfPosition) {
        this.positioningProperties.x.parseValue(value.x);
        this.positioningProperties.y.parseValue(value.y);
    }

    get size(): CfSize {
        let cNewCfSz: CfSize = new CfSize(this.positioningProperties.w.value.toString() + CfContainerPositioningModeToString(this.positioningProperties.w.mode), 
            this.positioningProperties.h.value.toString() + CfContainerPositioningModeToString(this.positioningProperties.h.mode));
        cNewCfSz._wGetter = () => this.positioningProperties.w.value;
        cNewCfSz._wSetter = (value) => { this.positioningProperties.w.parseValue(value); }
        cNewCfSz._hGetter = () => this.positioningProperties.h.value;
        cNewCfSz._hSetter = (value) => { this.positioningProperties.h.parseValue(value); }
        return cNewCfSz;
    }
    set size(value: CfSize) {
        this.positioningProperties.w.parseValue(value.w);
        this.positioningProperties.h.parseValue(value.h);
    }

    constructor(...properties: CfRecursivePartial<CfContainer>[]) {
        super();

        this.types.push('CfContainer');

        this.eventTriggers.push(this.onMouseOver, this.onMouseEnter, this.onMouseLeave, 
            this.onMouseMove, this.onMouseDown, this.onMouseUp, this.onClick, 
            this.onLongMouseEnter, this.onLongMouseLeave, this.onMouseDownOut, this.onMouseUpOut);

        this.snapshotList.push('positioningProperties', 'size', 'backgroundColor', 'borderColor', 'borderWidth', 'borderRadius');

        this.applyArray(properties);
    }

    public override preRender() {
        // Compute sizes and position
        if (this.positioningProperties.AnyUsingPercent() && !this.parent)
            throw "Unable to use percent relative position in orphan components";
        
        if (this.positioningProperties.w.mode == CfContainerPositioningMode.Percent)
            this.positioningProperties.size.w = ((this.parent as CfContainer).getInnerRectangle().size.w * this.positioningProperties.w.value) / 100.0;
        else if (this.positioningProperties.w.mode == CfContainerPositioningMode.Pixels && this.positioningProperties.w.changed) {
            this.positioningProperties.size.w = this.positioningProperties.w.value;
            this.positioningProperties.w.changed = false;
        }

        if (this.positioningProperties.h.mode == CfContainerPositioningMode.Percent)
            this.positioningProperties.size.h = ((this.parent as CfContainer).getInnerRectangle().size.h * this.positioningProperties.h.value) / 100.0;
        else if (this.positioningProperties.h.mode == CfContainerPositioningMode.Pixels && this.positioningProperties.h.changed) {
            this.positioningProperties.size.h = this.positioningProperties.h.value;
            this.positioningProperties.h.changed = false;
        }
            

        // Compute alignments
        for (let cComponent of this.components) {
            if (!cComponent.containsType('CfContainer'))
                continue;

            let cContainer: CfContainer = cComponent as CfContainer;
            if (cContainer.align != CfAlign.None)
                this.computeAlignment(cContainer);
        }

        // Values used
        let cInnerRect: CfRectangle = this.getInnerRectangle(true);

        // Elastic Size
        if (this.elasticSize) {
            let cUsedArea: CfRectangle = this.getUsedArea();

            if (!!cUsedArea) {
                if (cUsedArea.position.x + cUsedArea.size.w > cInnerRect.size.w)
                    this.positioningProperties.size.w = this.padding.left + this.padding.right + cUsedArea.position.x + cUsedArea.size.w;
                if (cUsedArea.position.y + cUsedArea.size.h > cInnerRect.size.h)
                    this.positioningProperties.size.h = this.padding.top + this.padding.bottom + cUsedArea.position.y + cUsedArea.size.h;
            }

        }

    }

    private computeAlignment(targetContainer: CfContainer) {
        let cCompRect: CfRectangle = this.getInnerRectangle(true);
        let targetCompRect: CfRectangle = targetContainer.getOuterRectangle(true);
        switch (targetContainer.align) {
            case CfAlign.Center:
                targetContainer.positioningProperties.position = new CfNumericPosition((cCompRect.size.w / 2) - (targetCompRect.size.w / 2), (cCompRect.size.h / 2) - (targetCompRect.size.h / 2));
                break;
            case CfAlign.Top:
                targetContainer.positioningProperties.position = new CfNumericPosition((cCompRect.size.w / 2) - (targetCompRect.size.w / 2), 0);
                break;
            case CfAlign.TopLeft:
                targetContainer.positioningProperties.position = new CfNumericPosition(0, 0);
                break;
            case CfAlign.TopRight:
                targetContainer.positioningProperties.position = new CfNumericPosition(cCompRect.size.w - targetCompRect.size.w, 0);
                break;
            case CfAlign.Bottom:
                targetContainer.positioningProperties.position = new CfNumericPosition((cCompRect.size.w / 2) - (targetCompRect.size.w / 2), cCompRect.size.h - targetCompRect.size.h);
                break;
            case CfAlign.BottomLeft:
                targetContainer.positioningProperties.position = new CfNumericPosition(0, cCompRect.size.h - targetCompRect.size.h);
                break;
            case CfAlign.BottomRight:
                targetContainer.positioningProperties.position = new CfNumericPosition(cCompRect.size.w - targetCompRect.size.w, cCompRect.size.h - targetCompRect.size.h);
                break;
            case CfAlign.Left:
                targetContainer.positioningProperties.position = new CfNumericPosition(0, (cCompRect.size.h / 2) - (targetCompRect.size.h / 2));
                break;
            case CfAlign.Right:
                targetContainer.positioningProperties.position = new CfNumericPosition((cCompRect.size.w - targetCompRect.size.w), (cCompRect.size.h / 2) - (targetCompRect.size.h / 2));
                break;
        }
    }

    public override render() {
        if (!this.renderTarget) throw "Undefined Render Target";

        let cRect: CfRectangle = this.getRectangle();

        if (cRect.size.w === 0 && cRect.size.h === 0) 
            return;

        if (this.enableBackgroundColor)
            this.renderTarget.fillRectangle(cRect.position, cRect.size, this.backgroundColor, this.borderRadius);

        if (this.borderWidth != 0 && this.enableBorder)
            this.renderTarget.drawRectangle(cRect.position, cRect.size, this.borderColor, this.borderWidth, this.borderRadius);
    }

    public getRelativePosition(): CfNumericPosition {
        return new CfNumericPosition(this.positioningProperties.position.x, this.positioningProperties.position.y);
    }

    /**
     * getAbsolutePosition: 
     * This function iterates with parent elements to calculate the position where the child should be rendered
     * Since this component is a container, the position of child elements should consider also the margin and padding
     * So this overload calculates these spacings
     */
    public override getAbsolutePosition(): CfNumericPosition {
        let cPosition = null;
        if (!this.parent) cPosition = new CfNumericPosition(0, 0);
        else cPosition = this.parent.getAbsolutePosition();

        // Since this is a container, the subcontent should be drawn in the innerside (considering both the margin and padding)
        // BE VERY CAREFULL HERE! If you try to get the non relative position it will cause stack overflow
        let cRect: CfRectangle = this.getInnerRectangle(true);

        return cPosition.sum(cRect.position);
    }

    /**
     * getOuterRectangle: 
     * Get the container rectangle without considering the margin
     */
    public getOuterRectangle(relative: boolean = false): CfRectangle {
        let cPos: CfNumericPosition = new CfNumericPosition();
        if (this.parent && !relative) cPos = this.parent.getAbsolutePosition();
        cPos.sum(this.getRelativePosition());

        let cRect: CfRectangle = new CfRectangle(cPos, new CfNumericSize(this.positioningProperties.size.w, this.positioningProperties.size.h));
        cRect.size.sum(new CfNumericSize(this.margin.left + this.margin.right, this.margin.top + this.margin.bottom));
        return cRect;
    }

    /**
     * getRectangle
     * Get the container rectangle considering the margin
     */
    public getRectangle(relative: boolean = false): CfRectangle {
        let cRect: CfRectangle = this.getOuterRectangle(relative);
        cRect.position.sum(new CfNumericPosition(this.margin.left, this.margin.top));
        cRect.size.sum(new CfNumericSize(-(this.margin.left + this.margin.right), -(this.margin.top + this.margin.bottom)));
        return cRect;
    }

    /**
     * getInnerRectangle
     * Get the container rectangle considering the margin and the padding
     */
    public getInnerRectangle(relative: boolean = false): CfRectangle {
        let cRect: CfRectangle = this.getRectangle(relative);
        cRect.position.sum(new CfNumericPosition(this.padding.left, this.padding.top));
        cRect.size.sum(new CfNumericSize(-(this.padding.left + this.padding.right), -(this.padding.top + this.padding.bottom)));
        return cRect;
    }

    public getChildrenContainerComponents(): Array<CfContainer> {
        return this.components
            .filter(cComponent => cComponent.containsType('CfContainer'))
            .map(cContainer => cContainer as CfContainer)
    }

    public getUsedArea(): CfRectangle {
        // Check if there are children containers
        let cContainers: Array<CfContainer> = this.getChildrenContainerComponents();

        if (cContainers.length == 0)
            return null; //new CfRectangle(new CfPosition(0, 0), new CfSize(0, 0));

        // Ensure all the chilren positioning are correct
        this.preRenderAll(true);

        // Create the base rectangle cloning the first found container
        let cRectangle: CfRectangle = CfClone(cContainers[0].getOuterRectangle(true));

        // Check each container
        for (let cContainer of cContainers) {
            let cTargetRect: CfRectangle = cContainer.getOuterRectangle(true);

            if (cTargetRect.position.x < cRectangle.position.x)
                cRectangle.position.x = cTargetRect.position.x;
            if (cTargetRect.position.y < cRectangle.position.y)
                cRectangle.position.y = cTargetRect.position.y;
            if (cTargetRect.position.x + cTargetRect.size.w > cRectangle.size.w)
                cRectangle.size.w = cTargetRect.position.x + cTargetRect.size.w;
            if (cTargetRect.position.y + cTargetRect.size.h > cRectangle.size.h)
                cRectangle.size.h = cTargetRect.position.y + cTargetRect.size.h;
        }
        cRectangle.size.w -= cRectangle.position.x;
        cRectangle.size.h -= cRectangle.position.y;
        
        return cRectangle;
    }

    public projectPositionToLocalPosition(position: CfNumericPosition) {
        let innerRect: CfRectangle = this.getInnerRectangle();
        return new CfNumericPosition(position.x - innerRect.position.x, position.y - innerRect.position.y);
    }

    public override eventHandler(eventName: string, eventArgs: any, propagate: boolean = true) {
        super.eventHandler(eventName, eventArgs, propagate);

        if (eventName.toLowerCase() == "onresize" && this.isTopElement) {
            this.positioningProperties.size.w = window.innerWidth;
            this.positioningProperties.size.h = window.innerHeight;

            // This will iterate on all sub components
            this.renderAll();
        }

        let cRect = this.getRectangle();

        switch (eventName) {
            case "onmousedown":
                if (cRect.intersectsWithPoint(eventArgs)) {
                    this.isMouseDown = true;
                    this.eventHandler("cfMouseDown", eventArgs, false);
                } else {
                    this.eventHandler("cfMouseDownOut", eventArgs, false);
                }
            break;
            case "onmouseup":
                if (this.isMouseDown) {
                    this.isMouseDown = false;
                    this.eventHandler("cfMouseUp", eventArgs, false);
                    this.eventHandler("cfClick", eventArgs, false);
                } else {
                    this.eventHandler("cfMouseUpOut", eventArgs, false);
                }
            break;
            case "onmousemove":
            break;
            case "cfGlobalMouseMove":
                if (!cRect.intersectsWithPoint(this.lastMousePosition) && cRect.intersectsWithPoint(eventArgs)) {
                    this.eventHandler("cfMouseEnter", eventArgs, false);
                } else if (cRect.intersectsWithPoint(this.lastMousePosition) && !cRect.intersectsWithPoint(eventArgs)) {
                    this.eventHandler("cfMouseLeave", eventArgs, false);
                }

                if (cRect.intersectsWithPoint(eventArgs)) {
                    this.eventHandler("cfMouseOver", eventArgs, false);
                    this.eventHandler("cfMouseMove", eventArgs, false);
                }

                this.lastMousePosition = eventArgs;
            break;
            case "cfMouseEnter":
                clearTimeout(this.longMouseLeaveTimeOut);
                this.longMouseEnterTimeOut = setTimeout(() => {
                    if (cRect.intersectsWithPoint(this.lastMousePosition)) {
                        this.eventHandler("cfLongMouseEnter", eventArgs, false);
                        clearTimeout(this.longMouseEnterTimeOut);
                    }
                }, 500);
            break;
            case "cfMouseLeave":
                clearTimeout(this.longMouseEnterTimeOut);
                this.longMouseLeaveTimeOut = setTimeout(() => {
                    if (cRect.intersectsWithPoint(this.lastMousePosition)) {
                        this.eventHandler("cfLongMouseLeave", eventArgs, false);
                        clearTimeout(this.longMouseLeaveTimeOut);
                    }
                }, 500);
            break;
        }
    }

}
