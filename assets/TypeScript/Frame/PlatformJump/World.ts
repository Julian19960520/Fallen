import BrickPlatform from "../../Scene/GameScene/BrickPlatform";
import Teeth from "../../Scene/GameScene/Teeth";
import CameraCtrl from "../CameraCtrl";
import { LvlLayout } from "../Config";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Pool from "../Pool";
import ScreenRect from "../ScreenRect";
import { Util } from "../Util";
import Hero from "./Hero";

const {ccclass, property} = cc._decorator;

@ccclass
export default class World extends cc.Component {
    public static GAME_WIN = "GAME_WIN";
    public static GAME_OVER = "GAME_OVER";
    public static GAME_PAUSE = "GAME_PAUSE";
    public static GAME_RESUME = "GAME_RESUME";
    static playing = false;
    static Ins:World = null;

    @property(BrickPlatform)
    topPlatform:BrickPlatform = null;
    @property(Pool)
    groundPool:Pool = null;
    @property(Pool)
    wallPool:Pool = null;
    @property(Hero)
    hero:Hero = null;
    @property(Teeth)
    teeth:Teeth = null;
    @property(CameraCtrl)
    worldCamera:CameraCtrl = null;

    lvlLayout:LvlLayout = null;
    openObjList:cc.Node[] = [];
    obj2NodeMap = new Map<any, cc.Node>();
    onLoad () {
        World.Ins = this;
        World.playing = false;
        cc.director.getCollisionManager().enabled = true;
        this.worldCamera.target = this.teeth.node;
    }
    onDestroy(){
        World.Ins = null;
    }

    play(lvlLayout:LvlLayout){
        this.lvlLayout = lvlLayout;
        World.playing = true;
        let top = lvlLayout.objList[lvlLayout.objList.length-1];
        this.topPlatform.node.y = top.y+200;
        this.hero.node.y = this.topPlatform.node.y+50;
        this.teeth.node.y = this.hero.node.y;
        this.topPlatform.setCnt(9);
        this.teeth.moving = false;
        this.topPlatform.shakeAndFall(()=>{
            this.teeth.moving = true;
        });
    }
    pause(){
        if(World.playing){
            World.playing = false;
            Util.emitAllChild(this.node, World.GAME_PAUSE);
        }
    }
    resume(){
        if(!World.playing){
            World.playing = true;
            Util.emitAllChild(this.node, World.GAME_RESUME);
        }
    }

    emitAll
    update(dt){
        if(!World.playing){
            return;
        }

        let pos = Util.convertPosition(this.worldCamera.node, this.node);
        let topY = pos.y + ScreenRect.height/2;
        let bottomY = pos.y - ScreenRect.height/2;
        
        //回收屏幕外的物体
        for(let i=0; i<this.openObjList.length; i++){
            let obj = this.openObjList[i];
            if(obj.y<bottomY || obj.y>topY){
                let idx = this.openObjList.indexOf(obj);
                if(idx>=0){
                    this.openObjList.splice(idx, 1);
                }
                let node = this.obj2NodeMap.get(obj);
                if(node){
                    node.emit(Pool.PUT);
                }
            }
        }
        //增加移入屏幕的物体
        for(let i=0; i<this.lvlLayout.objList.length; i++){
            let obj = this.lvlLayout.objList[i];
            if(obj.y>bottomY && obj.y<topY){
                let idx = this.openObjList.indexOf(obj);
                if(idx<0){
                    this.openObjList.push(obj);
                    let node = this.groundPool.get();
                    this.node.addChild(node);
                    node.x = obj.x;
                    node.y = obj.y;
                    this.obj2NodeMap.set(obj, node);
                }
            }
        }
    }
}
