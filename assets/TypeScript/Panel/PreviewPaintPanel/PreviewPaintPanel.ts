import BaseGainPanel from "../BaseGainPanel/BaseGainPanel";

import Panel from "../../Frame/Panel";
import Button from "../../CustomUI/Button";
import { GameRecorder } from "../../Frame/GameRecorder";
import Top from "../../Frame/Top";
import { Util } from "../../Frame/Util";
import { TGA } from "../../Game/TGA";

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("面板/RewardPanel")
export default class PreviewPaintPanel extends Panel {
    @property(Button)
    saveBtn:Button = null;
    @property(Button)
    shareVideoBtn:Button = null;
    saveCall = null;
    pixels:Uint8Array = null;
    onLoad () {
        super.onLoad();
        this.saveBtn.node.on("click", this.onSaveBtnTap, this);
        this.shareVideoBtn.node.on("click", this.onShareBtnTap, this);
        this.shareVideoBtn.node.active = GameRecorder.hasVideo();
        TGA.tag("PreviewPaintPanel", {
            sub:"show",
        });
    }

    setData(pixels:Uint8Array, shareTexture:cc.RenderTexture){
        this.pixels = pixels;
        this.shareVideoBtn.background.spriteFrame = new cc.SpriteFrame(shareTexture);
        this.scheduleOnce(()=>{

        });
    }
    async onSaveBtnTap(){
        this.saveCall && this.saveCall();
        this.closePanel();
    }
    onShareBtnTap(){
        TGA.tag("PreviewPaintPanel", {
            sub:"clickShare",
        });
        GameRecorder.share((res)=>{
            TGA.tag("PreviewPaintPanel", {
                sub:"shareSucc",
            });
        },()=>{
            Top.showToast("分享失败");
        })
    }
}
