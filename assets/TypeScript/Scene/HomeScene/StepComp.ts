import { Util } from "../../Frame/Util";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import StepCell from "./StepCell";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StepComp extends cc.Component {

    @property(StepCell)
    stepCell: StepCell = null;
    @property(cc.Node)
    pointer: cc.Node = null;

    setData(curLvlId, lvlIds:any[]){
        let parent = this.stepCell.node.parent;
        Util.makeBro(this.stepCell.node, lvlIds.length, (node, idx)=>{
            let id = lvlIds[idx]; 
            node.x = idx * parent.width/(lvlIds.length-1);
            node.getComponent(StepCell).setData(id);
            if(curLvlId == id){
                this.pointer.position = Util.convertPosition(node, this.pointer.parent);
                this.pointer.y = 60;
            }
        })
    }
}
