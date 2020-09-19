// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { FightSystem } from "../FightSystem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    onLoad () {
        this.node.on(FightSystem.Event.Beaten, this.onBeaten, this);
    }

    onBeaten (beatData:FightSystem.BeatData) {
        console.log(beatData);
        if(beatData.causeDeath){
            this.node.removeFromParent();
        }
    }
}
