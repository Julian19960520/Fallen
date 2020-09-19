import Button from "../../CustomUI/Button";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Panel from "../../Frame/Panel";
import SceneManager from "../../Frame/SceneManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOverPanel extends Panel {

    giveupCall = null;
    rebornCall = null;
    @property(cc.Label)
    titleLabel: cc.Label = null;

    @property(Button)
    adBtn: Button = null;

    onLoad(){
        this.adBtn.node.on("click", this.onAdBtnTap ,this);
    }
    onCloseBtnTap(){
        super.onCloseBtnTap();
        this.giveupCall && this.giveupCall();
    }
    setData(data){

    }
    onAdBtnTap(){
        this.closePanel();
        this.rebornCall && this.rebornCall();
    }
} 
