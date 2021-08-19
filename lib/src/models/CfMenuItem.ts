
export default class CfMenuItem {
    public text: string = "Placeholder";
    public subitems: CfMenuItem[] = [];

    constructor(text?: string, subitems?: CfMenuItem[]) {
        if (!!text) this.text = text;
        if (!!subitems) this.subitems = subitems;
    }
}