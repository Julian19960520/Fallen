// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import ScrollList from "../../CustomUI/ScrollList";
import { Config, ColorData } from "../../Frame/Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ColorBtn extends cc.Component {

    @property(cc.Sprite)
    alphaSprite: cc.Sprite = null;
    @property(cc.Sprite)
    selectBox: cc.Sprite = null;

    onLoad() {
        this.node.on(ScrollList.SET_DATA, this.setData, this);
        this.node.on(ScrollList.SELECT_STATE_CHANGE, this.stateChange, this);
    }
    setData(colorData:ColorData){
        let color = colorData.color;
        if(color.getA() === 0){
            this.node.color = cc.Color.WHITE;
            this.alphaSprite.node.active = true;
        }else{
            this.node.color = color;
            this.alphaSprite.node.active = false;
        }
    }
    stateChange(select){
        this.selectBox.node.active = select;
    }
}
