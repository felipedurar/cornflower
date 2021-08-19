import CfComponent from "./CfComponent";
import CfRenderable from "./rendering/CfRenderable";
import { CfNumericPosition, CfNumericSize } from "./CfUtils";
import CfWebRenderer from './rendering/CfWebRenderer';
import CfContainer from "../components/CfContainer";

const defaultCanvasName: string = "cornflower_viewport_canvas";

export function ApplyDefaultStyle() {
    var html = (document.getElementsByTagName("HTML") as HTMLCollectionOf<HTMLElement>)[0];
    var body = (document.getElementsByTagName("BODY") as HTMLCollectionOf<HTMLElement>)[0];
    removeElementSpaces(html);
    removeElementSpaces(body);

    let canvasElement: HTMLElement = document.getElementById(defaultCanvasName);
    if (!!canvasElement) {
        removeElementSpaces(canvasElement);
    }
}

function removeElementSpaces(el: HTMLElement) {
    el.style.width = "100%";
    el.style.height = "100%";
    el.style.padding = "0";
    el.style.margin = "0";
}

export function CreateWebViewport(component: CfContainer) {
    // Set as the top element
    component.isTopElement = true;

    // Create the canvas element
    const newCanvas = document.createElement('canvas');
    newCanvas.id = defaultCanvasName;
    document.body.appendChild(newCanvas);

    // Get the 2d context
    var ctx = newCanvas.getContext("2d");
    let webRenderer: CfWebRenderer = new CfWebRenderer(ctx as CanvasRenderingContext2D);
    component.setRenderTarget(webRenderer, true);

    component.takeSnapshot();
    (document as any).cornflower = {};
    (document as any).cornflower.rootComponent = component;

    // Initial Positioning
    component.positioningProperties.position = new CfNumericPosition(0, 0);
    component.positioningProperties.size = new CfNumericSize(window.innerWidth, window.innerHeight);

    // Misc
    component.name = 'Viewport';

    // Resize Handler
    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        newCanvas.width = window.innerWidth;
        newCanvas.height = window.innerHeight;
    }
    resizeCanvas();

    // Absolute mouse position on canvas
    function handleMouseMove(canvas, event) {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        component.eventHandler("cfGlobalMouseMove", new CfNumericPosition(x, y), true);
    }
    newCanvas.addEventListener('mousemove', function (e) {
        handleMouseMove(newCanvas, e)
    });

    // All events handler
    // From: https://stackoverflow.com/questions/27321672/listen-for-all-events-in-javascript/48388878
    Object.keys(window).forEach(key => {
        if (/^on/.test(key)) {
            window.addEventListener(key.slice(2), event => {
                component.eventHandler(key, event, true);
            });
        }
    });

    // Remove the Context Menu on Right Click
    DetachContextMenu(component);

    // Apply the CSS to remove any margin/padding
    ApplyDefaultStyle();

    component.renderAll();

    return newCanvas;
}

export function DetachContextMenu(component: CfComponent) {
    // Based On Radek Benkel's and dota2pro's answear:
    // https://stackoverflow.com/questions/4909167/how-to-add-a-custom-right-click-menu-to-a-webpage
    if (document.addEventListener) {
        document.addEventListener('contextmenu', function (e) {
            component.eventHandler("cfContextMenu", e, true);
            e.preventDefault();
        }, false);
    } else {
        if ((document as any).attachEvent) {
            (document as any).attachEvent('oncontextmenu', function (e) {
                component.eventHandler("cfContextMenu", e, true);
                window.event.returnValue = false;
            });
        }
    }
}