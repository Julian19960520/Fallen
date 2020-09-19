import Scene from "../../Frame/Scene";
import Button from "../../CustomUI/Button";
import Hero from "../../Frame/PlatformJump/Hero";
import World from "../../Frame/PlatformJump/World";
import { Util } from "../../Frame/Util";
import { LvlConf } from "../../Frame/Config";
import SceneManager from "../../Frame/SceneManager";
import MessageBox from "../../Frame/MessageBox";
import EngineManager from "../../Frame/EngineManager";
import GameOverPanel from "../../Panel/GameOverPanel/GameOverPanel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameScene extends Scene {
    @property(Button)
    backBtn:Button = null;

    @property(Button)
    leftBtn:Button = null;

    @property(Button)
    rightBtn:Button = null;


    @property(Hero)
    hero:Hero = null;

    onEnterScene(){
        EngineManager.Ins.mainCamera.node.active = false;
    }
    onExitScene(){
        EngineManager.Ins.mainCamera.node.active = true;
    }

    onLoad(){
        this.leftBtn.node.on(cc.Node.EventType.TOUCH_START, this.onLeftTouchStart, this);
        this.leftBtn.node.on(cc.Node.EventType.TOUCH_END, this.onLeftTouchEnd, this);
        this.leftBtn.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onLeftTouchEnd, this);
        this.rightBtn.node.on(cc.Node.EventType.TOUCH_START, this.onRightTouchStart, this);
        this.rightBtn.node.on(cc.Node.EventType.TOUCH_END, this.onRightTouchEnd, this);
        this.rightBtn.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onRightTouchEnd, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.backBtn.node.on("click", this.onBackBtnTap, this);
        this.node.on(World.GAME_WIN, this.onGameWin, this);
        this.node.on(World.GAME_OVER, this.onGameOver, this);
    }
    onDestroy(){
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    
    start(){
        let conf = new LvlConf();
        for(let i=0; i<10; i++){
            let x = Util.randomInt(-200, 200);
            let y = Util.randomInt(-30,30) + i*200 +200;
            conf.objList.push({x:x, y:y});
        }
        this.play(conf);
    }
    play(conf){
        World.Ins.play(conf);
    }
    pause(){

    }
    resume(){

    }
    onGameWin(){
        console.log("win");
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
    onKeyDown (event) {
        switch(event) {
            case cc.macro.KEY.left:
                this.onLeftTouchStart();
                break;
            case cc.macro.KEY.right:
                this.onRightTouchStart();
                break;
        }
    }

    onKeyUp (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this.onLeftTouchEnd();
                break;
            case cc.macro.KEY.right:
                this.onRightTouchEnd();
                break;
        }
    }

    dir = 0;
    leftStarted = false;
    rightStarted = false;
    onLeftTouchStart(){
        if(this.leftStarted){
            return;
        }
        this.leftStarted = true;
        this.dir--;
        this.hero.setDir(this.dir);
    }
    onLeftTouchEnd(){
        if(!this.leftStarted){
            return;
        }
        this.leftStarted = false;
        this.dir++;
        this.hero.setDir(this.dir);
    }
    onRightTouchStart(){
        if(this.rightStarted){
            return;
        }
        this.rightStarted = true;
        this.dir++;
        this.hero.setDir(this.dir);
    }
    onRightTouchEnd(){
        if(!this.rightStarted){
            return;
        }
        this.rightStarted = false;
        this.dir--;
        this.hero.setDir(this.dir);
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
