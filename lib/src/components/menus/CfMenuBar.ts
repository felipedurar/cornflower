import { CfAlign, CfColor, CfDirection, CfNumericPosition, CfPosition, CfRectangle, CfSize, CfSpaces } from "../../core/CfUtils";
import CfMenuItem from "../../models/CfMenuItem";
import CfButton from "../CfButton";
import CfContainer from "../CfContainer";
import CfContextMenu from "./CfContextMenu";
import type { CfRecursivePartial }  from '../../types/CfRecursivePartial'

export default class CfMenuBar extends CfContextMenu {
    
    constructor(...properties: CfRecursivePartial<CfMenuBar>[]) {
        super();

        this.enabled = true;
        this.position = new CfPosition('0', '0');
        this.size = new CfSize('100%', '1');
        this.stackDirection = CfDirection.Right;
        this.enableBackgroundColor = true;
        this.padding = new CfSpaces(0, 0, 0, 0);
        this.closeOnClickOut = false;

        this._baseMenuItemProperties = {
            backgroundColor: new CfColor(40, 40, 40),
            size: new CfSize('50', '24'),
            textComponent: {
                align: CfAlign.Left,
                margin: { left: 10 },
                textFont: { size: '12px' }
            }
        };

        this.menuItemFactory = this.defaultMenuBarItemFactory;

        this.applyArray(properties);
    }

    protected defaultMenuBarItemFactory(menuItem: CfMenuItem) {
        let ctxMenuBtn = new CfButton({ 
                textComponent: { text: menuItem.text } 
            },
            this._baseMenuItemProperties,
            this.menuItemProperties,
            { menuItem: menuItem } as any // Add also the menu item
        );
        ctxMenuBtn.onMouseDown.addListener(() => {
            if (!!this.currentSubMenu) {
                this.currentSubMenu.hide();
                this.parent.removeByInstanceId(this.currentSubMenu.instanceId);
                this.currentSubMenu = undefined;
            }

            if (menuItem.subitems.length > 0) {
                this.showContextMenuForSubItem(menuItem, ctxMenuBtn);
            }
        });
        ctxMenuBtn.onMouseEnter.addListener(() => {
            if (!!this.currentSubMenu) {
                this.currentSubMenu.hide();
                this.parent.removeByInstanceId(this.currentSubMenu.instanceId);
                this.currentSubMenu = undefined;

                if (menuItem.subitems.length > 0) {
                    this.showContextMenuForSubItem(menuItem, ctxMenuBtn);
                }
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

    protected override showContextMenuForSubItem(menuItem, ctxMenuBtn) {
        this.currentSubMenu = new CfContextMenu(this._baseMenuItemProperties, 
            { menuItemProperties: this.menuItemProperties, isRootContextMenu: true });
        this.currentSubMenu.addItems(menuItem.subitems);
        this.currentSubMenu.parentMenu = this;
        this.parent.addComponent(this.currentSubMenu);

        let cOuterBtnRect: CfRectangle = ctxMenuBtn.getOuterRectangle(false);

        this.currentSubMenu.positioningProperties.position = 
            new CfNumericPosition(cOuterBtnRect.position.x, cOuterBtnRect.position.y + cOuterBtnRect.size.h);
        this.currentSubMenu.show();
    }

}