import CollisionEmiter from "../../Game/CollisionEmiter";
import { FightSystem } from "../FightSystem";
import { Util } from "../Util";
import Mover from "./Mover";
import World from "./World";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hero extends cc.Component {
    @property(cc.BoxCollider)
    heroBox:cc.BoxCollider = null;
    @property(Mover)
    mover:Mover = null;

    beatenSpeedX = 300; //水平被击退速度
    onLoad(){
        this.node.on(CollisionEmiter.onCollisionEnter, this.onCollisionEnter, this);
        this.node.on(FightSystem.Event.BeatHper, this.onBeatHper, this);
        this.node.on(FightSystem.Event.Beaten, this.onBeaten, this);
        this.node.on(World.GAME_PAUSE, this.onPause, this);
        this.node.on(World.GAME_RESUME, this.onResume, this);
    }    

    onCollisionEnter(other:cc.Collider, self:cc.Collider){
        //自身碰撞盒接触旗帜过关
        if(self == this.heroBox){
            if(other.node.group == "flag"){
                World.Ins.pause();
                this.node.dispatchEvent(Util.customEvent(World.GAME_WIN, true, true));
            }
        }
    }
    onBeatHper(beatData:FightSystem.BeatData){
        //当脚踩怪物时，被反弹跳起
        this.mover.velocity.y = 500;
    }
    onBeaten(beatData:FightSystem.BeatData){
        //当被怪物杀死时，发送游戏结束事件
        if(beatData.causeDeath){
            World.Ins.pause();
            this.mover.anim.play("heroDie");
            this.scheduleOnce(()=>{
                this.node.dispatchEvent(Util.customEvent(World.GAME_OVER, true, true));
            },1)
            return;
        }
        //没被杀死，则被怪物击退， 
        this.mover.velocity.y = 400;
        let velX = -Util.sign(this.mover.velocity.x) * this.beatenSpeedX;
        this.mover.setForceVelocityX(velX, 0.4);
    }
    onPause(){

    }
    onResume(){

    }
}
