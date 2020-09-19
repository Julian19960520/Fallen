
import { DB } from "../Frame/DataBind";
import Top from "../Frame/Top";
import { Util } from "../Frame/Util";
import Button from "../CustomUI/Button";
import { Sound } from "../Frame/Sound";
import SceneManager from "../Frame/SceneManager";

import { Config } from "../Frame/Config";
import LackEnergyPanel from "../Panel/LackEnergyPanel/LackEnergyPanel";
import { EvtType, Player } from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnergyBar extends DB.DataBindComponent {
    public static ins:EnergyBar = null;
    @property(cc.Label)
    cntLabel: cc.Label = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;
    
    @property(cc.Label)
    fullLabel: cc.Label = null;

    @property(cc.Node)
    addBtn: cc.Node = null;

    @property(cc.Sprite)
    public icon: cc.Sprite = null;
    onLoad () {
        this.node.on("click", this.onAddBtnTap, this);
        this.schedule(this.updateEnergyBar, 1);    //每隔一秒，更新一次TimeLabel
        cc.game.on(EvtType.EnergyChange, this.updateEnergyBar, this);
        cc.game.on(EvtType.FlyingEnergyChange, this.updateEnergyBar, this);
    }
    onDestroy(){
        cc.game.off(EvtType.EnergyChange, this.updateEnergyBar, this);
        cc.game.off(EvtType.FlyingEnergyChange, this.updateEnergyBar, this);
    }
    onEnable(){
        this.updateEnergyBar();
        EnergyBar.ins = this;
    }
    onDisable(){
        EnergyBar.ins = null;
    }
    onAddBtnTap(){
        SceneManager.ins.OpenPanelByName("LackEnergyPanel",(panel:LackEnergyPanel)=>{
            panel.from = "EnergyBar";
        });
    }
    updateEnergyBar(){
        let energy = Player.energyMng.energy - Player.energyMng.flyingEnergy;
        this.cntLabel.string = energy.toString();
        if(energy >= Player.energyMng.energyMax){
            this.setInteractable(false);
            this.fullLabel.node.active = true;
            this.timeLabel.node.active = false;
        }else{
            this.fullLabel.node.active = false;
            this.timeLabel.node.active = true;
            this.setInteractable(true);
            let left = Util.getServerTime() - Player.energyMng.lastRecoverEnergyStamp;
            this.timeLabel.string = Util.parseTimeStr(left);
        }
    }

    setInteractable(b){
        this.getComponent(Button).interactable = b;
        this.addBtn.active = b;
    }

    playCostEnergyAnim(targetNode:cc.Node, parentNode:cc.Node ,callback){
        Top.blockInput(true);
        Top.bezierSprite({
            spriteFrame:this.icon.spriteFrame,
            from:Util.convertPosition(this.icon.node, parentNode),
            to:Util.convertPosition(targetNode, parentNode),
            time:0.8,
            fromScale:1,
            toScale:1.25,
            onEnd:()=>{
                Top.blockInput(false);
                Sound.play("gainEnergy");
                callback();
            },
        });
    }
}
