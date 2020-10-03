// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import World from "../../Frame/PlatformJump/World";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Teeth extends cc.Component {
    moving = false;
    moveSpeed = 200;
    update(dt){
        if(!World.playing){
            return;
        }
        if(!this.moving){
            return;
        }
        this.node.y;
        this.node.y -= dt*this.moveSpeed;
        if(this.node.y < 400){
            this.node.y = 400;
        }
    }
}
