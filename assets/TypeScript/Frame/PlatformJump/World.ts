import CameraCtrl from "../CameraCtrl";
import { LvlConf } from "../Config";
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
    @property(Pool)
    groundPool:Pool = null;
    @property(Pool)
    wallPool:Pool = null;
    @property(Hero)
    hero:Hero = null;
    @property(cc.Node)
    limit:cc.Node = null;
    @property(CameraCtrl)
    worldCamera:CameraCtrl = null;

    moveSpeed = 200;

    conf:LvlConf = null;

    openObjList:cc.Node[] = [];
    obj2NodeMap = new Map<any, cc.Node>();
    onLoad () {
        World.Ins = this;
        World.playing = false;
        cc.director.getCollisionManager().enabled = true;
        this.worldCamera.target = this.limit;
    }
    onDestroy(){
        World.Ins = null;
    }

    play(conf:LvlConf){
        this.conf = conf;
        World.playing = true;
        let maxY = conf.objList[conf.objList.length-1].y;
        this.hero.node.y = maxY;
        this.limit.y = maxY;
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
        this.limit.y -= dt*this.moveSpeed;
        if(this.limit.y < 400){
            this.limit.y = 400;
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
        for(let i=0; i<this.conf.objList.length; i++){
            let obj = this.conf.objList[i];
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
