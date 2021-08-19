import CfEvent from "./CfEvent";
import CfRenderable from "./rendering/CfRenderable";
import { CfClone, CfGenerateUuidV4, CfMergeDeep, CfNumericPosition, CfNumericSize } from "./CfUtils";
import CfWebRenderer from './rendering/CfWebRenderer';
import { CfRecursivePartial } from "../types/CfRecursivePartial";

export default abstract class CfComponent {
    public instanceId: string = '';
    public name: string = 'Untitled';
    public enabled: boolean = true;
    public isTopElement: boolean = false;
    public parent?: CfComponent;
    public renderTarget?: CfRenderable;

    public components: Array<CfComponent> = []
    public eventTriggers: Array<CfEvent> = [];

    public snapshot: any = {};
    public snapshotList: Array<string> = [];

    public types: Array<string> = ['CfComponent'];

    constructor(...properties: CfRecursivePartial<CfComponent>[]) {
        this.applyArray(properties);
        //
        this.instanceId = CfGenerateUuidV4();
    }

    /**
     * render: 
     * Renders the component into the screen
     * You can use the renderTarget instance from the component to render into the screen
     */
    public abstract render(): void;

    /**
     * renderAll: 
     * Renders this component and then all their children BUT NOT THEIR PARENT
     * First this function calls the preRenderAll to prepare all the layouts before rendering
     */
    public renderAll(subsequent: boolean = false) {
        if (!this.renderTarget || !this.enabled) return;

        if (!subsequent) {
            this.preRenderAll();

            this.renderTarget.beforeRender();
        }
        
        this.render();
        
        for (let cComponent of this.components) {
            if (!cComponent.enabled)
                continue;

            cComponent.renderAll(true);
        }

        if (!subsequent) {
            this.renderTarget.afterRender();
        }
    }

    /**
     * preRender: 
     * Prerender is called recursivelly in the component tree before rendering the object
     * The prerender of a component is always called before the parent's prerender
     * This is very usefull for some layout positioning and constraints computations
     */
    public abstract preRender(): void;

    /**
     * preRenderAll: 
     * Calls the preRenderAll of all their children (causing recursion) and then the preRender from itself
     * Notice that this order is very important to correctly calculate the layout positioning and constraints from further components
     */
    public preRenderAll(childrenOnly: boolean = false) {
        if (!this.renderTarget) return;

        for (let cComponent of this.components) {
            cComponent.preRenderAll();
        }

        if (!childrenOnly)
            this.preRender();
    }

    /**
     * addComponent:
     * Add a component into this component
     * This function also sets the parent and render target of the component and also takes a snapshot of the component being added
     */
    public addComponent(component: CfComponent) {
        component.parent = this;
        //component.renderTarget = this.renderTarget;
        component.setRenderTarget(this.renderTarget, true);

        component.takeSnapshot();

        this.components.push(component);
    }

    /**
     * takeSnapshot:
     * Copy the values of the properties of the component listed in the "snapshotList" array to the "snapshot" object
     * At runtime some properties changes and the original state is sometimes necessary
     */
    public takeSnapshot(propagate: boolean = false) {
        // Stores the original state of this component
        // Copy every attribute from this object where the name is in snapshotList to the snapshot object
        for (var attr in this) {
            if (this.hasOwnProperty(attr)) {
                if (this.snapshotList.some(cAttrName => cAttrName == attr)) {
                    this.snapshot[attr] = this[attr];
                }
            }
        }

        // Propagate it
        if (propagate) {
            for (let cComponent of this.components) {
                cComponent.takeSnapshot(propagate);
            }
        }
    }

    public abstract getRelativePosition(): CfNumericPosition;

    public abstract getAbsolutePosition(): CfNumericPosition;

    public eventHandler(eventName: string, eventArgs: any, propagate: boolean = true) {
        // Check if there is any trigger
        for (let cTrigger of this.eventTriggers) {
            if (cTrigger.trigger == eventName) {
                cTrigger.emit(eventArgs);
            }
        }

        // Propagate the events
        if (propagate) {
            for (let cComponent of this.components) {
                if (!cComponent.enabled)
                    continue;

                cComponent.eventHandler(eventName, eventArgs);
            }
        }
    }

    public setRenderTarget(renderTarget: CfRenderable, recursive: boolean = false) {
        this.renderTarget = renderTarget;

        if (recursive) {
            for (let cComponent of this.components) {
                cComponent.setRenderTarget(renderTarget, recursive);
            }
        }
    }

    public containsType(type: string): boolean {
        return this.types.some(x => x == type);
    }

    public getNamePath(): string {
        if (!!this.parent) return `${this.parent.getNamePath()}/${this.name}`;
        else return this.name;
    }

    public apply(...args: CfRecursivePartial<CfComponent>[]): void {
        this.applyArray(args);
    }

    public applyArray(args: CfRecursivePartial<CfComponent>[]): void {
        for (let cPartial of args) {
            if (!!cPartial)
                CfMergeDeep(this, cPartial);
        }
        //this.takeSnapshot(true);
    }

    public getRootComponent(): CfComponent {
        if (!this.parent) return this;
        return this.parent.getRootComponent();
    }

    public getByInstanceId(instId: string) {
        let cCompsFound = this.components.filter(cComp => cComp.instanceId = instId);
        if (cCompsFound.length !== 1) return null;
        return cCompsFound[0];
    }

    public removeByInstanceId(instId: string) {
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i].instanceId == instId) {
                this.components.splice(i, 1);
                return;
            }
        }
    }

}