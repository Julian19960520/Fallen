import Top from "../Frame/Top";
import { Util } from "../Frame/Util";
import { Sound } from "../Frame/Sound";
import SceneManager from "../Frame/SceneManager";
import GainCoinPanel from "../Panel/GainCoinPanel/GainCoinPanel";
import GainDiamondPanel from "../Panel/GainDiamondPanel/GainDiamondPanel";

export namespace OperationFlow{
    export function flyCoin(data:{cnt, fromNode:cc.Node, toNode:cc.Node, onArrive}){
        let cnt = data.cnt;
        if(cnt<=0){return;}
        let coinValue = 5;                       //每个硬币的价值
        //如果获得太多，则转换成大硬币
        if(cnt>=800){
            coinValue = 40;
        }
        else if(cnt>=400){
            coinValue = 20;
        }
        else if(cnt>=200){
            coinValue = 10;
        }
        else{
            coinValue = 5;
        }
        let coinNum = Math.ceil(cnt/coinValue); //硬币个数
        let deltaT = Math.min(1/coinNum, 50);
        Top.bezierSprite({
            url:"Atlas/UI/coin",
            from:Util.convertPosition(data.fromNode, Top.node),
            to:Util.convertPosition(data.toNode, Top.node),
            time:0.6,
            cnt:coinNum,
            deltaT:deltaT,
            onEnd:(finish)=>{
                Sound.play("gainCoin");
                if(finish){
                    let extraCnt = cnt-coinValue*(coinNum-1);
                    if(extraCnt>0){
                        data.onArrive(extraCnt);
                    }
                }else{
                    data.onArrive(coinValue);
                }
            }
        });
    }
    export function flyEnergy(data:{cnt, fromNode:cc.Node, toNode:cc.Node, onArrive}){
        Top.bezierSprite({
            url:"Atlas/UI/energy",
            from:Util.convertPosition(data.fromNode, Top.node),
            to:Util.convertPosition(data.toNode, Top.node),
            time:0.6,
            cnt:data.cnt,
            onEnd:(finish)=>{
                Sound.play("gainEnergy");
                data.onArrive(1, finish);
            }
        });
    }
    export function flyDiamond(data:{cnt, fromNode:cc.Node, toNode:cc.Node, onArrive}){
        Top.bezierSprite({
            url:"Atlas/UI/diamond",
            from:Util.convertPosition(data.fromNode, Top.node),
            to:Util.convertPosition(data.toNode, Top.node),
            time:0.6,
            cnt:data.cnt,
            onBegin:()=>{
                Sound.play("gainDiamond1");
            },
            onEnd:(finish)=>{
                Sound.play("gainDiamond2");
                data.onArrive(1, finish);
            }
        });
    }
    export function openRewards(rewards:any[], callback?){
        if(!rewards || rewards.length<=0){
            return;
        }
        for(let i=0;i<rewards.length;i++){
            let reward = rewards[i];
            switch(reward.type){
                case "coin":{
                    // Player.ins.addCoin(reward.cnt);
                    SceneManager.ins.pushPanel("GainCoinPanel",(panel:GainCoinPanel)=>{
                        panel.setData(reward.cnt);
                    });
                    break;
                }
                case "diamond":{
                    // Player.ins.addDiamond(reward.cnt);
                    SceneManager.ins.pushPanel("GainDiamondPanel",(panel:GainDiamondPanel)=>{
                        panel.setData(reward.cnt);
                    });
                    break;
                }
            }
        }
        SceneManager.ins.pushCall(()=>{
            callback && callback();
        })
        SceneManager.ins.checkNextPanel();
    }

}