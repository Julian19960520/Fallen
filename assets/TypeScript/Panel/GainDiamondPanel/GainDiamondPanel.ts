import BaseGainPanel from "../BaseGainPanel/BaseGainPanel";
import { OperationFlow } from "../../Game/OperationFlow";
import DiamondBar from "../../Game/DiamondBar";
import SceneManager from "../../Frame/SceneManager";
import HomeScene from "../../Scene/HomeScene/HomeScene";
import Player from "../../Game/Player";

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("面板/RewardPanel")
export default class GainDiamondPanel extends BaseGainPanel {
    cnt:number = 0;
    @property(cc.Label)
    cntLabel:cc.Label = null;
    onLoad () {
        super.onLoad();
        
    }

    setData(cnt, callback = null){
        this.cnt = cnt;
        this.gainCallback = callback;
        this.cntLabel.string = cnt;
    }
    onGainBtnTap(){
        let target:cc.Node = null;
        let homeScene = SceneManager.ins.findScene(HomeScene);
        if(DiamondBar.ins){
            target = DiamondBar.ins.icon;
        }else if(homeScene){
            target = homeScene.gashaBtn.node;
        }
        if(target){
            OperationFlow.flyDiamond({
                cnt:this.cnt,
                fromNode:this.node,
                toNode:target,
                onArrive:(arriveCnt)=>{
                    Player.ins.diamondArrive(arriveCnt);
                }
            })
        }else{
            Player.ins.diamondArrive(this.cnt);
        }
        super.onGainBtnTap();
    }
}
