import CfComponent from "../../core/CfComponent";
import { CfAlign, CfColor, CfNumericPosition, CfPosition, CfRectangle, CfSize, CfSpaces } from "../../core/CfUtils";
import CfMenuItem from "../../models/CfMenuItem";
import CfButton from "../CfButton";
import CfContainer from "../CfContainer";
import CfStackContainer from "../CfStackContainer";
import type { CfRecursivePartial }  from '../../types/CfRecursivePartial'

export default class CfContextMenu extends CfStackContainer {
    
    protected menuItems: CfMenuItem[] = [];
    public menuItemFactory: Function;

    // This only works when using the default menuItemFactory
    public menuItemProperties: CfRecursivePartial<CfButton> = {};
    protected _baseMenuItemProperties: CfRecursivePartial<CfButton> = {};

    public currentSubMenu: CfContextMenu;
    public isRootContextMenu: boolean = true;
    public closeOnClickOut: boolean = true;
    public parentMenu: CfContextMenu;

    constructor(...properties: CfRecursivePartial<CfContextMenu>[]) {
        super();

        this.types.push('CfContextMenu');

        this.enabled = false;
        this.enableBackgroundColor = true;
        this.backgroundColor = new CfColor(25, 25, 25);
        this.padding = new CfSpaces(2, 2, 2, 2);

        this._baseMenuItemProperties = {
            backgroundColor: new CfColor(40, 40, 40),
            size: new CfSize('150', '24'),
            textComponent: {
                align: CfAlign.Left,
                margin: { left: 10 },
                textFont: { size: '12px' }
            }
        };

        this.menuItemFactory = this.defaultMenuItemFactory;

        this.applyArray(properties);
    }

    public addItem(item: CfMenuItem) {
        this.menuItems.push(item);

        let cComponent: CfComponent = this.menuItemFactory(item);
        this.addComponent(cComponent);
    }

    public addItems(items: CfMenuItem[]) {
        for (let cMenuItem of items)
            this.addItem(cMenuItem);
    }

    public clearItems() {
        this.components = [];
        this.menuItems = [];
    }

    public show(position?: CfPosition) {
        if (!!position)
            this.position = position;

        if (!!this.currentSubMenu)
            this.currentSubMenu.hide();
        
        this.enabled = true;
        this.getRootComponent().renderAll();
    }

    public hide() {
        if (!!this.currentSubMenu)
            this.currentSubMenu.hide();
        
        this.enabled = false;
        this.getRootComponent().renderAll();
    }

    protected defaultMenuItemFactory(menuItem: CfMenuItem) {
        let ctxMenuBtn = new CfButton({ 
                textComponent: { text: menuItem.text } 
            },
            this._baseMenuItemProperties,
            this.menuItemProperties,
            { menuItem: menuItem } as any // Add also the menu item
        );
        ctxMenuBtn.onLongMouseEnter.addListener(() => {
            if (!!this.currentSubMenu) {
                this.currentSubMenu.hide();
                this.parent.removeByInstanceId(this.currentSubMenu.instanceId);
                this.currentSubMenu = undefined;
            }

            if (menuItem.subitems.length > 0) {
                this.showContextMenuForSubItem(menuItem, ctxMenuBtn);
            }
        });
        ctxMenuBtn.onLongMouseLeave.addListener(() => {
            if (!!this.currentSubMenu) {
                this.currentSubMenu.hide();
                this.parent.removeByInstanceId(this.currentSubMenu.instanceId);
                this.currentSubMenu = undefined;
            }
        });
        return ctxMenuBtn;
    }

    protected showContextMenuForSubItem(menuItem, ctxMenuBtn) {
        this.currentSubMenu = new CfContextMenu(this._baseMenuItemProperties, 
            { menuItemProperties: this.menuItemProperties, isRootContextMenu: false });
        this.currentSubMenu.addItems(menuItem.subitems);
        this.currentSubMenu.parentMenu = this;
        this.parent.addComponent(this.currentSubMenu);

        let cOuterBtnRect: CfRectangle = ctxMenuBtn.getOuterRectangle(false);

        this.currentSubMenu.positioningProperties.position = 
            new CfNumericPosition(cOuterBtnRect.position.x + cOuterBtnRect.size.w, cOuterBtnRect.position.y);
        this.currentSubMenu.show();
    }

    public override eventHandler(eventName: string, eventArgs: any, propagate: boolean = true) {
        super.eventHandler(eventName, eventArgs, propagate);

        let cChildrenRects: CfRectangle[] = this.getChildrenSubmenuRectanglesAndSelfRectangle();
        if (!!this.parentMenu) {
            cChildrenRects.push(this.parentMenu.getRectangle());
        }

        if (!this.enabled || !this.isRootContextMenu || !this.closeOnClickOut) {
            return;
        }

        switch (eventName) {
            case "onmousedown":
                if (!cChildrenRects.some(cRect => {
                    if (cRect.intersectsWithPoint(eventArgs)) {
                        return true;
                    }
                    return false;
                })) {
                    this.hide();
                    if (!!this.parent) {
                        this.parent.removeByInstanceId(this.instanceId);
                        if (!!this.parentMenu) {
                            if (this.parentMenu.containsType('CfContextMenu')) {
                                (this.parentMenu as CfContextMenu).currentSubMenu = undefined;
                            }
                        }
                    }
                }
            break;
        }
    }

    public getChildrenSubmenuRectanglesAndSelfRectangle(): CfRectangle[] {
        if (!!this.currentSubMenu) {
            if (this.currentSubMenu.enabled) {
                let childrenRects: CfRectangle[] = this.currentSubMenu.getChildrenSubmenuRectanglesAndSelfRectangle();
                return [this.getRectangle(), ...childrenRects];
            }
        }
        return [this.getRectangle()];
    }

}
