//
// CfUtils.ts
// Cornflower Project
// This file contains utility classes and enumerator used in the project
//
// Created by Felipe Durar
//

export class CfNumericPosition {
    public x: number = 0;
    public y: number = 0;

    constructor(x?: number, y?: number) {
        if (x) this.x = x as number;
        if (y) this.y = y as number;
    }

    public sum(position: CfNumericPosition): CfNumericPosition {
        this.x += position.x;
        this.y += position.y;
        return this;  //new CfPosition(this.x + position.x, this.y + position.y);
    }
}

export class CfNumericSize {
    public w: number = 0;
    public h: number = 0;

    constructor(w?: number, h?: number) {
        if (w) this.w = w as number;
        if (h) this.h = h as number;
    }

    public sum(size: CfNumericSize): CfNumericSize {
        this.w += size.w;
        this.h += size.h;
        return this;
    }
}

export class CfPosition {
    public _x: string = "0";
    public _y: string = "0";
    public _xGetter: Function;
    public _yGetter: Function;
    public _xSetter: Function;
    public _ySetter: Function;

    get x(): string {
        if (!!this._xGetter)
            this._x = this._xGetter();
        return this._x;
    }
    set x(value: string) {
        if (!!this._xSetter)
            this._xSetter();
        this._x = value;
    }

    get y(): string {
        if (!!this._yGetter)
            this._y = this._yGetter();
        return this._y;
    }
    set y(value: string) {
        if (!!this._ySetter)
            this._ySetter();
        this._y = value;
    }

    constructor(x?: string, y?: string) {
        if (x) this.x = x;
        if (y) this.y = y;
    }
}

export class CfSize {
    public _w: string = "0";
    public _h: string = "0";
    public _wGetter: Function;
    public _hGetter: Function;
    public _wSetter: Function;
    public _hSetter: Function;

    get w(): string {
        if (!!this._wGetter)
            this._w = this._wGetter();
        return this._w;
    }
    set w(value: string) {
        if (!!this._wSetter)
            this._wSetter();
        this._w = value;
    }

    get h(): string {
        if (!!this._hGetter)
            this._h = this._hGetter();
        return this._h;
    }
    set h(value: string) {
        if (!!this._hSetter)
            this._hSetter();
        this._h = value;
    }

    constructor(w?: string, h?: string) {
        if (w) this.w = w;
        if (h) this.h = h;
    }
}

export class CfColor {
    public r: number = 0;
    public g: number = 0;
    public b: number = 0;

    constructor(r?: number, g?: number, b?: number) {
        if (r) this.r = r as number;
        if (g) this.g = g as number;
        if (b) this.b = b as number;
    }

    public _getCssColor() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`
    }

    public darken(factor: number) {
        this.r -= (this.r * factor) / 100.0;
        this.g -= (this.g * factor) / 100.0;
        this.b -= (this.b * factor) / 100.0;
        return this;
    }
}

export class CfRadius {
    public tl: number = 0;
    public tr: number = 0;
    public br: number = 0;
    public bl: number = 0;

    constructor(radius?: number) {
        if (!!radius) {
            this.tl = this.tr = this.br = this.bl = radius;
        }
    }
}

export class CfFont {
    public size: string = "14px";
    public fontFamilly: string = "Arial";

    constructor(size?: string, fontFamilly?: string) {
        if (!!size) this.size = size;
        if (!!fontFamilly) this.fontFamilly = fontFamilly;
    }

    public _getCssFont() {
        return `${this.size} ${this.fontFamilly}`
    }
}

export class CfRectangle {
    public position: CfNumericPosition = new CfNumericPosition();
    public size: CfNumericSize = new CfNumericSize();

    constructor(position?: CfNumericPosition, size?: CfNumericSize) {
        if (!!position) this.position = position;
        if (!!size) this.size = size;
    }

    public intersectsWithPoint(position: CfNumericPosition): boolean {
        return (position.x > this.position.x && position.y > this.position.y &&
            position.x < this.position.x + this.size.w && position.y < this.position.y + this.size.h);
    }
}

export enum CfAlign {
    None,
    Left,
    Right,
    Top,
    TopLeft,
    TopRight,
    Bottom,
    BottomLeft,
    BottomRight,
    Center
}

export enum CfDirection {
    None,
    Up,
    Down,
    Left,
    Right
}

export class CfSpaces {
    public left: number = 0;
    public right: number = 0;
    public top: number = 0;
    public bottom: number = 0;

    constructor(left?: number, right?: number, top?: number, bottom?: number) {
        if (!!left) this.left = left;
        if (!!right) this.right = right;
        if (!!top) this.top = top;
        if (!!bottom) this.bottom = bottom;
    }
}

export class CfAnchor {
    public left: boolean = false;
    public right: boolean = false;
    public top: boolean = false;
    public bottom: boolean = false;

    constructor(left?: boolean, right?: boolean, top?: boolean, bottom?: boolean) {
        if (!!left) this.left = left;
        if (!!right) this.right = right;
        if (!!top) this.top = top;
        if (!!bottom) this.bottom = bottom;
    }
}

export enum CfContainerPositioningMode {
    Pixels,
    Percent
}

export function CfContainerPositioningModeToString(posMode: CfContainerPositioningMode) {
    switch (posMode) {
        case CfContainerPositioningMode.Pixels:
            return 'px';
        case CfContainerPositioningMode.Percent:
            return '%';
        default:
            return '';
    }
}

export class CfContainerPositioningModeValuePair {
    public mode: CfContainerPositioningMode = CfContainerPositioningMode.Pixels;
    public value: number = 0;
    public changed: boolean = false;

    // Receives for example: "15", "15%"", "15px" ...
    public parseValue(inValue: any): boolean {
        //debugger;
        let value = "";
        if (typeof inValue === 'string' || inValue instanceof String) value = inValue as string;
        else value = inValue.toString();

        if (value.length <= 0) throw `Invalid Positioning "${value}" (Can't be empty)`;
        if (isNaN(value[0] as any)) throw `Invalid Positioning "${value}" (Must begin with a number)`;

        // Small tool function
        let isValidUnitCharacter: Function = (str) => {
            return str.length === 1 && (str.match(/[a-z]/i) || str == '%');
        }

        let numericPart = "";
        let unitPart = "";

        // Get the numeric part
        let i = 0;
        for (; i < value.length; i++) {
            if (!isNaN(value[i] as any))
                numericPart += value[i];
            else
                break;
        }

        // Get the unit part
        for (; i < value.length; i++) {
            if (isValidUnitCharacter(value[i] as any))
                unitPart += value[i];
            else
                throw `Invalid Positioning Unit "${unitPart}" (Character Validation)`;
        }

        // Unit Check
        switch (unitPart.toLowerCase()) {
            case '': this.mode = CfContainerPositioningMode.Pixels;
                break;
            case 'px': this.mode = CfContainerPositioningMode.Pixels;
                break;
            case '%': this.mode = CfContainerPositioningMode.Percent;
                break;
            default:
                throw `Invalid Positioning Unit "${unitPart}" (Unit Checking)`;
        }

        // Numeric Conversion
        this.value = parseInt(numericPart);
        if (isNaN(this.value))
            throw `Unable to parse positioning value "${numericPart}"`;

        this.changed = true;
        return false;
    }
}

export class CfContainerPositioningProperties {
    // This is the base position and size of the object and is ALWAYS represented in pixels
    public position: CfNumericPosition = new CfNumericPosition();
    public size: CfNumericSize = new CfNumericSize();

    public x: CfContainerPositioningModeValuePair = new CfContainerPositioningModeValuePair();
    public y: CfContainerPositioningModeValuePair = new CfContainerPositioningModeValuePair();
    public w: CfContainerPositioningModeValuePair = new CfContainerPositioningModeValuePair();
    public h: CfContainerPositioningModeValuePair = new CfContainerPositioningModeValuePair();

    public AnyUsingPercent() {
        return this.x.mode == CfContainerPositioningMode.Percent || this.y.mode == CfContainerPositioningMode.Percent
            || this.w.mode == CfContainerPositioningMode.Percent || this.h.mode == CfContainerPositioningMode.Percent;
    }
}

export function CfGenerateUuidV4() {
    // Based on broofa's answear from this:
    // https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function CfClone(obj) {
    // Based on A. Levy's answear from this:
    // https://stackoverflow.com/questions/728360/how-do-i-correctly-clone-a-javascript-object
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = CfClone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = CfClone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

export function CfIsObject(item) {
    // Based on Salakar and Rubens Mariuzzo answear from this:
    // https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
    return (item && typeof item === 'object' && !Array.isArray(item));
}

// Returns all prototypes from the object class and all their extended classes
export function CfGetPrototypeFamily(obj) {
    let prototypes: Array<any> = [];
    //
    let cObj = obj;

    // This is just to limit the maximum amount of iterations in case something goes wrong
    for (let c = 0; c < 10; c++) {
        if (!cObj) return prototypes;
        cObj = Object.getPrototypeOf(cObj);
        if (!!cObj) prototypes.push(cObj);
    }
}

// Returns the setter function
export function CfGetSetter(obj, prop) {
    // This is necessary because the getOwnPropertyDescriptor only gets the descriptor from a single class
    // So to check if a setter exists in extended classes it's necessary to get all the prototypes and check agains each one
    let protoFamily: Array<any> = CfGetPrototypeFamily(obj);

    for (let cPrototype of protoFamily) {
        if (!cPrototype) continue;

        let descriptor = Object.getOwnPropertyDescriptor(cPrototype, prop);
        if (!descriptor) continue;
        return descriptor['set'];
    }
    return undefined;
}

export function CfMergeDeep(target, ...sources) {
    // Based on Salakar and Rubens Mariuzzo answear from this but with some modification to accept setters:
    // https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
    if (!sources.length) return target;
    const source = sources.shift();

    if (CfIsObject(target) && CfIsObject(source)) {
        for (const key in source) {

            // Check if the objects's property is a setter (if CfGetSetter returns null it's not a setter)
            let propSetter = CfGetSetter(target, key);
            if (!!propSetter) {
                // Setter (Object, but let the setter decide what to do)
                propSetter.bind(target)(source[key]);
            } else if (CfIsObject(source[key])) {
                // Object
                if (!target[key]) Object.assign(target, { [key]: {} });
                CfMergeDeep(target[key], source[key]);
            } else {
                // Value
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return CfMergeDeep(target, ...sources);
}
