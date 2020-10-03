// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Button from "../../CustomUI/Button";
import { GameRecorder } from "../../Frame/GameRecorder";
import Panel from "../../Frame/Panel";
import SceneManager from "../../Frame/SceneManager";
import Top from "../../Frame/Top";
import GameScene from "../../Scene/GameScene/GameScene";

const {ccclass, property} = cc._decorator;
type WinPanelData = {
    tryCnt:number;
    lvl:number;
    spriteFrames:cc.SpriteFrame[]
}
@ccclass
export default class WinPanel extends Panel {

    @property(cc.Label)
    titleLabel: cc.Label = null;

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    @property(Button)
    homeBtn:Button = null;

    @property(Button)
    shareBtn:Button = null;

    @property(Button)
    nextBtn:Button = null;
    
    data:WinPanelData = null;
    onLoad () {
        super.onLoad();
        this.homeBtn.node.on("click", this.onHomeBtnTap, this);
        this.shareBtn.node.on("click", this.onShareBtnTap, this);
        this.nextBtn.node.on("click", this.onNextBtnTap, this);
    }
    setData(data:WinPanelData){
        this.data = data;
        if(data.tryCnt == 0){
            this.titleLabel.string = `竟然一次就通过了\n好强好强！!！`;
        }else{
            this.titleLabel.string = `在重试了${data.tryCnt}次之后\n我们的勇士终于到达终点`;
        }
        this.nextBtn.label.string = `第${data.lvl}关`;
        this.playSpriteAnim(data.spriteFrames);
    }
    playSpriteAnim(frames:cc.SpriteFrame[]){
        if(!frames || frames.length==0){
            return;
        }
        let idx = 0;
        this.sprite.spriteFrame = frames[0];
        this.schedule(()=>{
            idx++;
            this.sprite.spriteFrame = frames[idx%frames.length];
        }, 0.2);
    }
    onHomeBtnTap(){
        this.closePanel();
        SceneManager.ins.goHome();
    }
    onShareBtnTap(){
        GameRecorder.share(()=>{
            Top.showToast("分享录屏成功！");
        },()=>{
            Top.showToast("分享录屏失败");
        });
    }
    onNextBtnTap(){
        this.closePanel();
        let gameScene = SceneManager.ins.findScene(GameScene);
        // gameScene.play();
    }
}
