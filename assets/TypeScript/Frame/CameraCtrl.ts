// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Util } from "./Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraCtrl extends cc.Component {
    @property(cc.Node)
    target:cc.Node = null;
    @property
    useX = false;
    @property
    useY = false;

    update(){
        if(!this.target || !this.target.isValid){
            return;
        }
        let pos = Util.convertPosition(this.target, this.node.parent);
        if(this.useX){
            this.node.x = Util.lerp(this.node.x, pos.x, 0.1);
        }
        if(this.useY){
            this.node.y = Util.lerp(this.node.y, pos.y, 0.1);
        }
    }
}
