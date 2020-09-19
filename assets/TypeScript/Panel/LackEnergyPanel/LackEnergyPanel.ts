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
import GainEnergyPanel from "../GainEnergyPanel/GainEnergyPanel";
import Player from "../../Game/Player";
import { TGA } from "../../TGA";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LackEnergyPanel extends Panel {

    @property(Button)
    okBtn: Button = null;
    @property(cc.Label)
    cntLabel: cc.Label = null;

    @property
    cnt:number = 2;

    from = "";
    onLoad () {
        super.onLoad();
        this.cntLabel.string = "x"+this.cnt;
        this.okBtn.node.on("click", this.onOkBtnTap, this);
        TGA.tag("LackEnergyPanel", {
            sub:"show",
            from:this.from,
        });
    }

    onOkBtnTap(){
        TGA.tag("LackEnergyPanel", {
            sub:"click",
            from:this.from,
        });
        AD.showVideoAd({
            id:AdUnitId.FreeEnergy,
            succ:()=>{
                TGA.tag("LackEnergyPanel", {
                    sub:"succ",
                    from:this.from,
                });
                this.closePanel();
                Player.ins.addEnergy(this.cnt);
                Player.ins.save();
                SceneManager.ins.OpenPanelByName("GainEnergyPanel",(panel:GainEnergyPanel)=>{
                    panel.setData(this.cnt);
                });
            },
            fail:()=>{

            }
        })
    }
}
