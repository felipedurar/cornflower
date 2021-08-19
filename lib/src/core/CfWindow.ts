
import CfContainer from '../components/CfContainer';
import CfComponent from './CfComponent';
import CfRenderable from './rendering/CfRenderable';
import { CfColor } from './CfUtils';
import CfWebRenderer from './rendering/CfWebRenderer';

export default class CfWindow extends CfContainer {

    constructor() {
        super();

        this.backgroundColor = new CfColor(245, 246, 247);
        this.borderWidth = 0;
    }



}