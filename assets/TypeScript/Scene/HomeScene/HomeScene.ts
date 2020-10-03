import Scene from "../../Frame/Scene";
import Button from "../../CustomUI/Button";
import SceneManager from "../../Frame/SceneManager";
import GameScene from "../GameScene/GameScene";
import HeroSelecter from "./HeroSelecter";
import EnergyBar from "../../Game/EnergyBar";
import Top from "../../Frame/Top";
import { AD, AdUnitId } from "../../Frame/AD";
import LackEnergyPanel from "../../Panel/LackEnergyPanel/LackEnergyPanel";
import { Config } from "../../Frame/Config";
import { Util } from "../../Frame/Util";
import { Player } from "../../Game/Player";
import { OperationFlow } from "../../Game/OperationFlow";
import StepComp from "./StepComp";

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("场景/HomeScene")
export default class HomeScene extends Scene {
    @property(HeroSelecter)
    heroSelecter:HeroSelecter = null;
    @property(EnergyBar)
    energyBar:EnergyBar = null;
    @property(StepComp)
    stepComp:StepComp = null;



    @property(Button)
    playBtn:Button = null;
    @property(Button)
    endlessBtn:Button = null;
    @property(Button)
    shopBtn:Button = null;
    @property(Button)
    unlockBtn:Button = null;

    onLoad(){
        this.playBtn.node.on("click", this.onPlayBtnTap, this);
        this.endlessBtn.node.on("click", this.onEndlessBtnTap, this);
        this.shopBtn.node.on("click", this.onShopBtnTap, this);
        this.unlockBtn.node.on("click", this.onUnlockBtnTap, this);
        this.heroSelecter.node.on(HeroSelecter.SELECT_CHANGE, this.onSelectChange, this);
       
    }
    onEnterScene(){
        let stepConf = Config.getStageConf(Player.lvlMng.stage);
        this.stepComp.setData(Player.lvlMng.lvl, stepConf.lvls);
        this.playBtn.label.string = `第${Player.lvlMng.lvl}关`;
    }

    async onSelectChange(){
        let heroId = Player.heroMng.curHeroId;
        let heroConf = Config.getHeroConf(heroId);
        let heroData = Player.heroMng.getHeroData(heroId);
        this.playBtn.node.active = heroData.unlock;
        this.unlockBtn.node.active = !heroData.unlock;
        if(heroConf.unlockType == "ad"){
            Util.loadBundleRes("Atlas/UI/ad", cc.SpriteFrame, (sf)=>{
                this.unlockBtn.icon.spriteFrame = sf;
            });
        }else if(heroConf.unlockType == "coin"){
            Util.loadBundleRes("Atlas/Home/gachaBtn", cc.SpriteFrame, (sf)=>{
                this.unlockBtn.icon.spriteFrame = sf;
            });
        }
    }

    onPlayBtnTap(){
        SceneManager.ins.Enter("GameScene",(gameScene:GameScene)=>{
            let lvlConf = Config.getLvlConf(Player.lvlMng.lvl);
            let layout = Config.getLvlLayout(lvlConf.distance, lvlConf.type);
            gameScene.play(layout);
        });
        return;
        if(Player.energyMng.energy>0){
            Player.energyMng.useEnergy(1);
            this.energyBar.playCostEnergyAnim(this.playBtn.node, this.node, ()=>{
                SceneManager.ins.Enter("GameScene",(scene:GameScene)=>{
                    
                });
            })
        }else{
            SceneManager.ins.OpenPanelByName("LackEnergyPanel",(panel:LackEnergyPanel)=>{
                panel.from = "HomeScene";
            });
            Top.showToast("能量不足");
        }
    }

    onEndlessBtnTap(){

    }

    onShopBtnTap(){

    }


    onUnlockBtnTap(){
        let heroId = Player.heroMng.curHeroId;
        let heroConf = Config.getHeroConf(heroId);
        let heroData = Player.heroMng.getHeroData(heroId);

        if(heroConf.unlockType == "ad"){
            AD.showVideoAd({
                id:AdUnitId.UnlockTape,
                succ:async ()=>{
                    let rewards = await Player.heroMng.unlockHero(heroId);
                    OperationFlow.openRewards(rewards);
                    this.playBtn.node.active = heroData.unlock;
                    this.unlockBtn.node.active = !heroData.unlock;
                },
                fail:()=>{
    
                }
            })
        }else if(heroConf.unlockType == "gacha"){

        }
    }
}