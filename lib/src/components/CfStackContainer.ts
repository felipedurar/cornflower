import { CfDirection, CfNumericSize } from "../core/CfUtils";
import CfContainer from "./CfContainer";
import type { CfRecursivePartial }  from '../types/CfRecursivePartial'

export default class CfStackContainer extends CfContainer {

    public stackDirection: CfDirection = CfDirection.Down;

    constructor(...properties: CfRecursivePartial<CfStackContainer>[]) {
        super();

        this.enableBackgroundColor = false;
        this.enableBorder = false;
        this.positioningProperties.size = new CfNumericSize(1, 1);

        this.applyArray(properties);
    }

    public override preRender() {
        let positionAcc: number = 0;

        let cContainers: Array<CfContainer> = this.getChildrenContainerComponents();
        for (let cContainer of cContainers) {
            switch (this.stackDirection) {
                case CfDirection.Right:
                    cContainer.positioningProperties.position.x = positionAcc;
                    cContainer.positioningProperties.position.y = 0;
                    positionAcc += cContainer.getOuterRectangle().size.w;
                break;
                case CfDirection.Down:
                    cContainer.positioningProperties.position.x = 0;
                    cContainer.positioningProperties.position.y = positionAcc;
                    positionAcc += cContainer.getOuterRectangle().size.h;
                break;
            }
        }

        super.preRender();
    }

}