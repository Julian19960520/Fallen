import BaseGainPanel from "../BaseGainPanel/BaseGainPanel";
import { OperationFlow } from "../../Game/OperationFlow";
import EnergyBar from "../../Game/EnergyBar";
import Player from "../../Game/Player";

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("面板/RewardPanel")
export default class GainEnergyPanel extends BaseGainPanel {
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
        if(EnergyBar.ins){
            OperationFlow.flyEnergy({
                cnt:this.cnt,
                fromNode:this.node,
                toNode:EnergyBar.ins.icon.node,
                onArrive:(arriveCnt)=>{
                    Player.ins.energyArrive(arriveCnt);
                }
            })
        }
        super.onGainBtnTap();
    }
}
