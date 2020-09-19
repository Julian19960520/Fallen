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
import GainDiamondPanel from "../GainDiamondPanel/GainDiamondPanel";
import Player from "../../Game/Player";
import { TGA } from "../../TGA";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LackDiamondPanel extends Panel {

    @property(Button)
    okBtn: Button = null;
    @property(cc.Label)
    cntLabel: cc.Label = null;

    @property
    cnt:number = 5;

    from = "";
    onLoad () {
        super.onLoad();
        this.cntLabel.string = "x"+this.cnt;
        this.okBtn.node.on("click", this.onOkBtnTap, this);
        TGA.tag("LackDiamondPanel", {
            sub:"show",
            from:this.from,
        });
    }

    onOkBtnTap(){
        TGA.tag("LackDiamondPanel", {
            sub:"click",
            from:this.from,
        });
        AD.showVideoAd({
            id:AdUnitId.FreeDiamond,
            succ:()=>{
                TGA.tag("LackDiamondPanel", {
                    sub:"succ",
                    from:this.from,
                });
                this.closePanel();
                Player.ins.addDiamond(this.cnt);
                Player.ins.save();
                SceneManager.ins.OpenPanelByName("GainDiamondPanel",(panel:GainDiamondPanel)=>{
                    panel.setData(this.cnt);
                });
            },
            fail:()=>{

            }
        })
    }
}
