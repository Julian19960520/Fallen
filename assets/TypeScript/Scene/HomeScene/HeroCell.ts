// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ScrollList from "../../CustomUI/ScrollList";
import { Config, HeroConf } from "../../Frame/Config";
import { Util } from "../../Frame/Util";
import { Player } from "../../Game/Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Tape extends cc.Component {

    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    heroConf:HeroConf = null;
    onLoad () {
        this.node.on(ScrollList.SET_DATA, this.setData, this);
        this.node.on(ScrollList.CONTENT_MOVE, this.onContentMove, this);
    }

    setData(heroConf:HeroConf){
        this.heroConf = heroConf;
        if(heroConf){
            this.sprite.node.active = true;
            this.nameLabel.string = heroConf.name;
            // Util.loadBundleRes("Atlas/Home/TapeSkin"+heroConf.skin, cc.SpriteFrame, (sf)=>{
            //     this.sprite.spriteFrame = sf;
            // });   
        }else{
            this.sprite.node.active = false;
        }
    }

    onContentMove(centerPos:cc.Vec2){
        let distance = Math.abs(centerPos.x + this.node.x);
        let normal = distance/this.node.width;      
        this.sprite.node.scale = Util.lerp01(1, 0.5, normal);
        this.sprite.node.opacity = Util.lerp01(255, 100, normal);
    }
}
