// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Button from "../../CustomUI/Button";
import { AD, AdUnitId } from "../../Frame/AD";
import SceneManager from "../../Frame/SceneManager";
import Panel from "../../Frame/Panel";
import GainCoinPanel from "../GainCoinPanel/GainCoinPanel";
import Player from "../../Game/Player";
import { TGA } from "../../Game/TGA";


const {ccclass, property} = cc._decorator;

@ccclass
export default class LackCoinPanel extends Panel {

    @property(Button)
    okBtn: Button = null;
    @property(cc.Label)
    cntLabel: cc.Label = null;

    @property
    cnt:number = 200;

    from = "";
    onLoad () {
        super.onLoad();
        this.cntLabel.string = "x"+this.cnt;
        this.okBtn.node.on("click", this.onOkBtnTap, this);
        TGA.tag("LackCoinPanel", {
            sub:"show",
            from:this.from,
        });
    }

    onOkBtnTap(){
        TGA.tag("LackCoinPanel", {
            sub:"click",
            from:this.from,
        });
        AD.showVideoAd({
            id:AdUnitId.FreeCoin,
            succ:()=>{
                TGA.tag("LackCoinPanel", {
                    sub:"succ",
                    from:this.from,
                });
                this.closePanel();
                Player.ins.addCoin(this.cnt);
                Player.ins.save();
                SceneManager.ins.OpenPanelByName("GainCoinPanel",(panel:GainCoinPanel)=>{
                    panel.setData(this.cnt);
                });
            },
            fail:()=>{

            }
        })
    }
}
