
import { CfAlign, CfColor, CfNumericPosition, CfSize } from '../../../../lib/src/core/CfUtils';
import CfWindow from '../../../../lib/src/core/CfWindow'
import CfButton from '../../../../lib/src/components/CfButton'
import CfMenuItem from '../../../../lib/src/models/CfMenuItem'
import CfText from '../../../../lib/src/components/CfText';
import CfMenuBar from '../../../../lib/src/components/menus/CfMenuBar';
import CfContextMenu from '../../../../lib/src/components/menus/CfContextMenu';

export class Window1 extends CfWindow {

    public counter: number = 0;

    constructor() {
        super();
        this.counter = 0;
        this.createComponents();
    }

    createComponents() {
        let cMenuBar = new CfMenuBar();
        cMenuBar.addItem(new CfMenuItem('File', [
            new CfMenuItem('New', [
                new CfMenuItem('Project'),
                new CfMenuItem('File'),
                new CfMenuItem('Resource')
            ]),
            new CfMenuItem('Open File'),
            new CfMenuItem('Save File'),
            new CfMenuItem('Preferences', [
                new CfMenuItem('Settings'),
                new CfMenuItem('Themes', [
                    new CfMenuItem('Choose Local Theme'),
                    new CfMenuItem('Explorer Themes')
                ])
            ])
        ]));
        cMenuBar.addItem(new CfMenuItem('Edit', [
            new CfMenuItem('Undo'),
            new CfMenuItem('Redo'),
            new CfMenuItem('Cut'),
            new CfMenuItem('Copy'),
            new CfMenuItem('Paste')
        ]));
        cMenuBar.addItem(new CfMenuItem('Help', [
            new CfMenuItem('About')
        ]));
        this.addComponent(cMenuBar);

        // ===========================================
        
        let btnTest = new CfButton({textComponent: {text: 'File'}, size: new CfSize('400', '35')});
        btnTest.positioningProperties.position = new CfNumericPosition(100, 100);
        //btnTest.size = new CfSize('300', '35');
        this.addComponent(btnTest);

        //this.addComponent(new CfText({align: (CfAlign as any).Center, text: 'Teste' }))

        // let theme = {
        //     backgroundColor: new CfColor(40, 40, 40),
        //     size: new CfSize(150, 24),
        //     textComponent: {
        //         align: CfAlign.Left,
        //         margin: { left: 10 },
        //         textFont: { size: '12px' }
        //     }
        // };

        let cCtxMenu = new CfContextMenu();
        cCtxMenu.addItem(new CfMenuItem('New File'));
        cCtxMenu.addItem(new CfMenuItem('Open', [
            new CfMenuItem('Open File'),
            new CfMenuItem('Open Project') 
        ]));
        cCtxMenu.addItem(new CfMenuItem('Save', [
            new CfMenuItem('Save File'),
            new CfMenuItem('Save Project') 
        ]));
        cCtxMenu.addItem(new CfMenuItem('Preferences', [
            new CfMenuItem('Settings'),
            new CfMenuItem('Themes', [
                new CfMenuItem('Choose Local Theme'),
                new CfMenuItem('Explore Themes Online') 
            ]) 
        ]));
        cCtxMenu.addItem(new CfMenuItem('Exit'));
        this.addComponent(cCtxMenu);

        // let cStackContainer = new CfStackContainer();
        // cStackContainer.name = "ContextMenu";
        // cStackContainer.enabled = false;
        // cStackContainer.position = new CfPosition(10, 300);
        // cStackContainer.enableBackgroundColor = true;
        // cStackContainer.backgroundColor = new CfColor(25, 25, 25);
        // cStackContainer.padding = new CfSpaces(2, 2, 2, 2);

        let textTest: CfButton = new CfButton({ textComponent: { text: "Batata" }, align: CfAlign.Center, backgroundColor: new CfColor(255, 0, 0) });
        textTest.onClick.addListener(() => {
            console.log("CLICADO");
        });
        this.addComponent(textTest);

        // cStackContainer.addComponent(new CfButton({textComponent: {text: 'New'}}, theme));
        // cStackContainer.addComponent(new CfButton({textComponent: {text: 'Open File'}}, theme));
        // cStackContainer.addComponent(new CfButton({textComponent: {text: 'Save File'}}, theme));
        // cStackContainer.addComponent(new CfButton({textComponent: {text: 'Exit'}}, theme));
        // this.addComponent(cStackContainer);

        this.onMouseDown.addListener((eventArgs: any) => {
            if (eventArgs.button == 0) { // Left Click
                cCtxMenu.hide();
            }
            if (eventArgs.button == 2) { // Right Click
                let menuPosition = this.projectPositionToLocalPosition(this.lastMousePosition);
                cCtxMenu.positioningProperties.position = menuPosition;
                cCtxMenu.show();
            }
        });

    }

}

