// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Scene from "../../Frame/Scene";
import Button from "../../CustomUI/Button";
import SceneManager from "../../Frame/SceneManager";
import CoinBar from "../../Game/CoinBar";
import DiamondBar from "../../Game/DiamondBar";
import Top from "../../Frame/Top";
import { OperationFlow } from "../../Game/OperationFlow";
import Player from "../../Game/Player";
import { Config } from "../../Frame/Config";
import LackDiamondPanel from "../../Panel/LackDiamondPanel/LackDiamondPanel";
import { Util } from "../../Frame/Util";
import LackCoinPanel from "../../Panel/LackCoinPanel/LackCoinPanel";
import { TGA } from "../../Game/TGA";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GachaScene extends Scene {

    @property(Button)
    backBtn: Button = null;
    @property(CoinBar)
    coinBar: CoinBar = null;
    @property(DiamondBar)
    diamondBar: DiamondBar = null;

    @property(cc.Animation)
    boxAnim1: cc.Animation = null;
    @property(cc.Animation)
    boxAnim2: cc.Animation = null;
    @property(cc.Animation)
    boxAnim3: cc.Animation = null;

    @property(Button)
    buy1: Button = null;
    @property(Button)
    buy2: Button = null;
    @property(Button)
    buy3: Button = null;

    @property(Button)
    aboutBtn: Button = null;

    @property(cc.Label)
    freeTipLabel: cc.Label = null;

    onLoad () {
        this.backBtn.node.on("click", this.onBackBtnTap, this);
        this.buy1.node.on("click", this.onBuyBtnTap1, this);
        this.buy2.node.on("click", this.onBuyBtnTap2, this);
        this.buy3.node.on("click", this.onBuyBtnTap3, this);
        Util.searchChild(this.boxAnim1.node, "boxBtn").on("click", this.onAboutBtnTap, this);
        Util.searchChild(this.boxAnim2.node, "boxBtn").on("click", this.onAboutBtnTap, this);
        Util.searchChild(this.boxAnim3.node, "boxBtn").on("click", this.onAboutBtnTap, this);
        this.aboutBtn.node.on("click", this.onAboutBtnTap, this);
        this.updateFreeTipLabel();
        this.schedule(this.updateFreeTipLabel, 1);
    }
    onEnterScene(){
        TGA.tag("GachaScene",{
            sub:"show",
        });
    }
    updateFreeTipLabel(){
        if(Player.ins.gachaMng.hasFree()){
            this.buy1.label.string = "免费";
            this.freeTipLabel.string = "免费打开！"; 
        }else{
            this.buy1.label.string = "打开";
            this.freeTipLabel.string = Player.ins.gachaMng.getLeftTimeStr()+"后免费";
        }
    }
    onBackBtnTap(){
        SceneManager.ins.Back();
    }
    onBuyBtnTap1(){
        let free = Player.ins.gachaMng.hasFree();
        TGA.tag("GachaScene", {
            sub: "clickGacah1",
            free: free,
        });
        if(Player.ins.coin >= Config.smallBoxCost || free){
            Top.blockInput(true, "Gacha");
            Player.ins.gachaMng.requestSmallBox((rewards)=>{
                this.boxAnim1.play();
                this.scheduleOnce(()=>{
                    Top.blockInput(false, "Gacha");
                    OperationFlow.openRewards(rewards,()=>{
                        this.boxAnim1.play("replaceNewBox");
                    });
                }, 0.5);
            })
        }else{
            SceneManager.ins.OpenPanelByName("LackCoinPanel",(panel:LackCoinPanel)=>{
                panel.from = "GachaScene";
            });     
        }
    }
    onBuyBtnTap2(){
        TGA.tag("GachaScene", {
            sub: "clickGacah2",
        });
        if(Player.ins.coin >= Config.normalBoxCost){
            Top.blockInput(true, "Gacha");
            Player.ins.gachaMng.requestNormalBox((rewards)=>{
                this.boxAnim2.play();
                this.scheduleOnce(()=>{
                    Top.blockInput(false, "Gacha");
                    OperationFlow.openRewards(rewards,()=>{
                        this.boxAnim2.play("replaceNewBox");
                    });
                }, 0.5);
            })
        }else{
            SceneManager.ins.OpenPanelByName("LackCoinPanel");     
        }
    }
    onBuyBtnTap3(){
        TGA.tag("GachaScene", {
            sub: "clickGacah3",
        });
        if(Player.ins.diamond >= Config.bigBoxCost){
            Top.blockInput(true, "Gacha");
            Player.ins.gachaMng.requestBigBox((rewards)=>{
                this.boxAnim3.play();
                this.scheduleOnce(()=>{
                    Top.blockInput(false, "Gacha");
                    OperationFlow.openRewards(rewards,()=>{
                        this.boxAnim3.play("replaceNewBox");
                    });
                }, 0.5);
            })
        }else{
            SceneManager.ins.OpenPanelByName("LackDiamondPanel",(panel:LackDiamondPanel)=>{
                panel.from = "GachaScene";
            });     
        }
    }
    onAboutBtnTap(){
        TGA.tag("GachaScene", {
            sub:"clickAbout",
        });
        SceneManager.ins.OpenPanelByName("GachaAboutPanel");
    }
}
