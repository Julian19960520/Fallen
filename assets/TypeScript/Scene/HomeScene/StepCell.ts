// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ScrollList from "../../CustomUI/ScrollList";
import { Config } from "../../Frame/Config";
import { Util } from "../../Frame/Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StepCell extends cc.Component {
    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    setData(lvlId){
        let lvlConf = Config.getLvlConf(lvlId);
        Util.loadBundleRes("Scene/HomeScene/Atlas/StepPoint"+lvlConf.type,cc.SpriteFrame, (sf)=>{
            this.sprite.spriteFrame = sf;
        });
    }
}
