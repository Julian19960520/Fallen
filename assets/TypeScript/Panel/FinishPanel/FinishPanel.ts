// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Panel from "../../Frame/Panel";
import Button from "../../CustomUI/Button";
import { GameRecorder } from "../../Frame/GameRecorder";
import Top from "../../Frame/Top";
import { Sound } from "../../Frame/Sound";
import { Config } from "../../Frame/Config";
import { TGA } from "../../TGA";
import { Util } from "../../Frame/Util";
import Player from "../../Game/Player";
import Star from "./Star";


const {ccclass, property} = cc._decorator;

export class FinishData{
    perfect:number;
    good:number;
    bad:number;
    maxCombo:number;
    score:number;
    starCnt:number;
    oldStarCnt:number;
    totalStarCnt:number;
    oldHighScore:number;
    tapeId:number;
}

@ccclass
export default class FinishPanel extends Panel {

    @property(cc.Sprite)
    videoPreview: cc.Sprite = null;
    @property(Button)
    shareBtn: Button = null;
    @property(cc.Label)
    scoreLabel: cc.Label = null;
    @property(cc.Label)
    highScoreLabel: cc.Label = null;
    @property(cc.Sprite)
    progress: cc.Sprite = null;
    @property(cc.Animation)
    anim:cc.Animation = null;

    @property(cc.Label)
    perfectLabel: cc.Label = null;
    @property(cc.Label)
    goodLabel: cc.Label = null;
    @property(cc.Label)
    badLabel: cc.Label = null;
    @property(cc.Label)
    comboLabel: cc.Label = null;
    @property(cc.Label)
    musicLabel: cc.Label = null;

    @property(cc.Sprite)
    lvlSprite: cc.Sprite = null;
    @property(cc.Node)
    starContent: cc.Node = null;

    @property({
        type:[cc.Node],
        displayName:"colorBgs",
    })
    colorsBgs:cc.Node[] = [];
    shareSuccCall = null;
    chatSuccCall = null;

    from = "";
    onLoad () {
        super.onLoad();
        this.shareBtn.node.on("click", this.onShareBtnTap, this);
        Sound.play("victory");
    }
    openAnim(callback){
        Top.blockInput(true, "finishAnim");
        this.anim.play();
        this.scheduleOnce(()=>{
            GameRecorder.stop();
            Top.blockInput(false, "finishAnim");
        }, 1.5)
    }
    setData(data:FinishData, textures:cc.Texture2D[]){
        TGA.tag("FinishPanel", {
            sub:"show",
            from:this.from
        }); 
        
        //分享按钮
        this.shareBtn.node.runAction(cc.repeatForever(
            cc.sequence(
                cc.scaleTo(0.5, 1.05, 1.05),
                cc.scaleTo(0.5, 1, 1),
            )
        ));
        if(textures && textures.length>0){
            let i = 0;
            this.videoPreview.node.runAction(cc.repeatForever(
                cc.sequence(
                    cc.callFunc(()=>{
                        i++;
                        this.videoPreview.spriteFrame = new cc.SpriteFrame(textures[i%textures.length]);
                    }),
                    cc.delayTime(0.5)
                )
            ));
        }
        //音乐名字
        let tapeConf = Config.findTapeConf(data.tapeId);
        this.musicLabel.string = `${tapeConf.name}(${Player.ins.tapeMng.getTapeFace(tapeConf.id)})`;
        //分数
        this.perfectLabel.string = data.perfect.toString();
        this.goodLabel.string = data.good.toString();
        this.badLabel.string = data.bad.toString();
        this.comboLabel.string = data.maxCombo.toString();
        //最高分
        let color = cc.color(101,203,239);
        if(data.score >= Config.maxScore){
            this.highScoreLabel.string = "大满贯！";
            color = cc.color(239,101,126);
        }
        else if(data.score >data.oldHighScore){
            this.highScoreLabel.string = "新纪录！";
            color = cc.color(239,198,101);
        }else{
            this.highScoreLabel.string = "";
        }
        for(let i=0;i<this.colorsBgs.length;i++){
            this.colorsBgs[i].color = color;
        }
        //星星
        let starNode = this.starContent.children[0];
        while(this.starContent.childrenCount < data.totalStarCnt){
            let node = cc.instantiate(starNode);
            this.starContent.addChild(node);
        }
        for(let i=0; i<this.starContent.childrenCount; i++){
            let starNode = this.starContent.children[i];
            if(i < data.totalStarCnt){
                starNode.active = true;
                let star = starNode.getComponent(Star);
                star.hide();
            }else{
                starNode.active = false;
            }
        }
        //进度条
        let arr = data.totalStarCnt == 3 ? Config.scoreLvl3 : Config.scoreLvl5;
        let target = data.score/Config.maxScore;
        this.progress.fillRange = 0;
        let tempStarCnt = 0;
        Top.blockInput(true,"FinishPanelProgress");
        cc.tween(this.progress).to(2, {fillRange: target}, {progress:(start, end, current, ratio) => {
            let ease = ratio * ( 2 - ratio );
            let cur = start + (end - start) * ease;
            this.scoreLabel.string = `${Math.round(cur*Config.maxScore)}/${Config.maxScore}`;
            if(cur > arr[tempStarCnt]){
                let star = this.starContent.children[tempStarCnt].getComponent(Star);
                Util.loadBundleRes("Atlas/Finish/lvl"+tempStarCnt,cc.SpriteFrame,(sf)=>{
                    if(this.lvlSprite){
                        this.lvlSprite.spriteFrame = sf;
                    }
                });
                star.playShow();
                tempStarCnt++;
            }
            return cur;
        }}).call(()=>{
            Top.blockInput(false, "FinishPanelProgress");
        }).start();
    }
    onShareBtnTap(){
        TGA.tag("FinishPanel", {
            sub:"clickShare",
            from:this.from
        });
        GameRecorder.share((res)=>{
            TGA.tag("FinishPanel", {
                sub:"shareSucc",
                from:this.from
            });
            this.shareSuccCall && this.shareSuccCall(res);
        },()=>{
            Top.showToast("分享失败");
        })
    }
    onChatBtnTap(){
        TGA.tag("FinishPanel", {
            sub:"clickChat",
            from:this.from
        });
        Util.showKeyBoard("", (res)=>{
            this.chatSuccCall && this.chatSuccCall(res);
        })
    }
}
