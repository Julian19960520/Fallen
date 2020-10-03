import { Easing } from "../../Frame/TweenUtil";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Util } from "../../Frame/Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BrickPlatform extends cc.Component {

    @property(cc.Node)
    brick: cc.Node = null;

    @property
    cnt: number = 1;

    onLoad(){
        this.setCnt(this.cnt);
    }

    setCnt(cnt){
        this.cnt = cnt;
        this.node.width = this.brick.width*cnt;
        this.node.height = this.brick.height;
        Util.makeBro(this.brick, cnt, (node, idx)=>{
            node.y = 0;
            node.x = node.width*(idx-cnt/2-0.5);
        })
    }
    shakeAndFall(call){
        for(let i=0;i<this.node.childrenCount;i++){
            let child = this.node.children[i];
            let shackT = 0.08*Util.randomFloat(0.8,1.2);
            let tw = cc.tween(child);
             //水平震动
            for(let i=0;i<15;i++){
                tw.to(shackT,{x : child.x + (i%2==0?1:-1)*5});
            }
            //等待
            tw.delay(0.5);
            //坠落
            tw.to(0.5, {y:child.y-200, opacity:0}, {easing:Easing.quadIn}).call(()=>{
                child.active = false;
                child.opacity = 255;
            });
            tw.start();
        }
        this.scheduleOnce(call, 2.5)
    }
}
