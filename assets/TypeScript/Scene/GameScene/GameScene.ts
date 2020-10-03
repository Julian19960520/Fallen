import Scene from "../../Frame/Scene";
import Button from "../../CustomUI/Button";
import Hero from "../../Frame/PlatformJump/Hero";
import World from "../../Frame/PlatformJump/World";
import { Util } from "../../Frame/Util";
import { LvlLayout } from "../../Frame/Config";
import SceneManager from "../../Frame/SceneManager";
import MessageBox from "../../Frame/MessageBox";
import EngineManager from "../../Frame/EngineManager";
import GameOverPanel from "../../Panel/GameOverPanel/GameOverPanel";
import WinPanel from "../../Panel/WinPanel/WinPanel";
import { Player } from "../../Game/Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameScene extends Scene {
    @property(Button)
    backBtn:Button = null;

    onEnterScene(){
        EngineManager.Ins.mainCamera.node.active = false;
    }
    onExitScene(){
        EngineManager.Ins.mainCamera.node.active = true;
    }

    onLoad(){
        this.backBtn.node.on("click", this.onBackBtnTap, this);
        this.node.on(World.GAME_WIN, this.onGameWin, this);
        this.node.on(World.GAME_OVER, this.onGameOver, this);
    }

    play(lvlLayout){
        World.Ins.play(lvlLayout);
    }
    pause(){

    }
    resume(){

    }
    onGameWin(){
        SceneManager.ins.OpenPanelByName("WinPanel",(panel:WinPanel)=>{
            panel.setData({
                tryCnt:1,
                lvl:Player.lvlMng.lvl,
                spriteFrames:[],
            });
        });
    }
    onGameOver(){
        console.log("over");
        SceneManager.ins.OpenPanelByName("GameOverPanel",(panel:GameOverPanel)=>{
            panel.giveupCall = ()=>{
                SceneManager.ins.Enter("FinishScene");
            }
            panel.rebornCall = ()=>{
                
            }
        });
    }
    
    onBackBtnTap(){
        if(World.playing){
            World.Ins.pause();
            SceneManager.ins.OpenPanelByName("MessageBox", (panel:MessageBox)=>{
                panel.label.string = "是否离开？";
                panel.closeBtn.node.active = false;
                panel.setLeftStyle({text:"离开", color:cc.color(241,138,165), call:()=>{
                    SceneManager.ins.Back();
                }});
                panel.setRightStyle({text:"恢复游戏", color:cc.color(101,203,239), call:()=>{
                    World.Ins.resume();
                }});
            });  
        }
    }
}
