import BaseGainPanel from "../BaseGainPanel/BaseGainPanel";
import { OperationFlow } from "../../Game/OperationFlow";
import CoinBar from "../../Game/CoinBar";
import DiamondBar from "../../Game/DiamondBar";
import Player from "../../Game/Player";
import Button from "../../CustomUI/Button";
import { Util } from "../../Frame/Util";
import { AD, AdUnitId } from "../../Frame/AD";
import { TweenUtil } from "../../Frame/TweenUtil";
import Top from "../../Frame/Top";
import { TGA } from "../../TGA";

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("面板/RewardPanel")
export default class GainFinishRewardPanel extends BaseGainPanel {
    coin:number = 0;
    diamond:number = 0;
    @property(cc.Label)
    coinLabel:cc.Label = null;
    @property(cc.Label)
    diamondLabel:cc.Label = null;
    @property(Button)
    betBtn:Button = null;
    
    bet:number = 1;
    @property(cc.Node)
    miniGame:cc.Node = null;
    @property(cc.Node)
    red:cc.Node = null;
    @property(cc.Node)
    yellow:cc.Node = null;
    @property(cc.Node)
    green:cc.Node = null;
    @property(cc.Node)
    blue:cc.Node = null;
    @property(cc.Node)
    bomb:cc.Node = null;
    @property(cc.Label)
    betLabel:cc.Label = null;
    flag = false;
    run = true;
    speed = 300;

    onLoad () {
        super.onLoad();
        this.betBtn.node.on("click", this.onBetBtnTap, this);
    }
    openAnim(callback = null){
        TweenUtil.applyAppear({node:this.node, callback:callback, fromScale:0.8, toScale:1});
        TweenUtil.applyAppear({node:this.rewardPos, delay:0.25, duration:0.3});
        TweenUtil.fadeIn(this.gainBtn.node);
    }
    update(dt){
        if(!this.run){
            return;
        }
        if(this.flag){
            this.red.x += dt*this.speed;
            if(this.red.x > this.miniGame.width/2){
                this.flag = false;
                this.red.scaleX = -1;
            }
        }else{
            this.red.x -= dt*this.speed;
            if(this.red.x < -this.miniGame.width/2){
                this.flag = true;
                this.red.scaleX = 1;
            }
        }
        if(this.red.x > -this.yellow.width/2 && this.red.x < this.yellow.width/2){
            this.betLabel.string = "x4";
            this.bomb.color = this.yellow.color;
            this.bet = 4;
        }
        else if(this.red.x > -this.blue.width/2 && this.red.x < this.blue.width/2){
            this.betLabel.string = "x3";
            this.bomb.color = this.blue.color;
            this.bet = 3;
        }
        else{
            this.betLabel.string = "x2";
            this.bomb.color = this.green.color;
            this.bet = 2;
        }
    }
    setData(coin, diamond, callback = null){
        this.speed = Util.randomInt(400, 600);
        this.coin = coin;
        this.diamond = diamond;
        this.coinLabel.string = "x"+coin;
        this.diamondLabel.string = "x"+diamond;
        this.coinLabel.node.parent.active = coin>0;
        this.diamondLabel.node.parent.active = diamond>0;
        this.gainCallback = callback;
        TGA.tag("GainFinishRewardPanel",{
            bet:this.bet,
            sub:"show"
        });
    }
    onGainBtnTap(){
        Player.ins.addCoin(this.coin);
        Player.ins.addDiamond(this.diamond);
        Player.ins.save();
        this.playFlyReward();
        super.onGainBtnTap(); 
    }
    onBetBtnTap(){
        this.run = false;
        this.betBtn.label.string = Util.toChineseNum(this.bet)+"倍奖励";
        TGA.tag("GainFinishRewardPanel",{
            bet:this.bet,
            sub:"click"
        });
        AD.showVideoAd({
            id:AdUnitId.FinishBet,
            succ:()=>{
                TGA.tag("GainFinishRewardPanel",{
                    bet:this.bet,
                    sub:"succ"
                });
                Top.blockInput(true, "bet");

                this.coin *= this.bet;
                this.diamond *= this.bet;
                Player.ins.addCoin(this.coin);
                Player.ins.addDiamond(this.diamond);
                Player.ins.save();

                this.playBetAnim(()=>{
                    this.scheduleOnce(()=>{
                        Top.blockInput(false, "bet");
                        this.playFlyReward();
                        super.onGainBtnTap();
                    },0.5);
                });
            },
            fail:()=>{
                this.run = true;
                this.red.x = 0;
                this.betBtn.label.string = "奖励翻倍";
            }
        })
    }
    playBetAnim(call){
        let coinAmin = (callback)=>{
            if(this.coinLabel.node.parent.active){
                TweenUtil.applyScaleBounce2(this.coinLabel.node.parent,1, 1.5,()=>{
                    this.coinLabel.string = `x${this.coin}`;
                },()=>{
                    callback();
                })
            }else{
                callback();
            }
        }
        let diamondAmin = (callback)=>{
            if(this.diamondLabel.node.parent.active){
                TweenUtil.applyScaleBounce2(this.diamondLabel.node.parent,1, 1.5,()=>{
                    this.diamondLabel.string = `x${this.diamond}`;
                },()=>{
                    callback();
                })
            }else{
                callback();
            }
        }
        coinAmin(()=>{
            diamondAmin(call);
        })
    }
    playFlyReward(){
        if(CoinBar.ins && this.coin){
            OperationFlow.flyCoin({
                cnt:this.coin,
                fromNode:this.coinLabel.node.parent,
                toNode:CoinBar.ins.node,
                onArrive:(arriveCnt)=>{
                    Player.ins.coinArrive(arriveCnt);
                }
            })
        }else{
            Player.ins.coinArrive(this.coin);
        }

        if(DiamondBar.ins && this.diamond){ 
            OperationFlow.flyDiamond({
                cnt:this.diamond,
                fromNode:this.diamondLabel.node.parent,
                toNode:DiamondBar.ins.node,
                onArrive:(arriveCnt)=>{
                    Player.ins.diamondArrive(arriveCnt);
                }
            })
        }else{
            Player.ins.diamondArrive(this.diamond);
        }
    }
}
