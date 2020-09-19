import CollisionEmiter from "../../Game/CollisionEmiter";
import { FightSystem } from "../FightSystem";
import { Util } from "../Util";
import World from "./World";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hero extends cc.Component {
    @property(cc.BoxCollider)
    foot:cc.BoxCollider = null;
    @property(cc.BoxCollider)
    body:cc.BoxCollider = null;
    heroBox:cc.BoxCollider = null;

    velocity:cc.Vec2 = cc.Vec2.ZERO;
    moveSpeedX = 500;   //最大水平移动速度
    beatenSpeedX = 300; //水平被击退速度
    g = -1500;   //重力加速度
    acc = 7000;  //水平加速度

    targetVelocityX = 0;        //目标水平速度
    forceVelocityX = 0;         //强制水平数独
    useForceVelocityX = false;  //是否使用强制水平速度
    onLoad(){
        this.node.on(CollisionEmiter.onCollisionEnter, this.onCollisionEnter, this);
        this.node.on(FightSystem.Event.BeatHper, this.onBeatHper, this);
        this.node.on(FightSystem.Event.Beaten, this.onBeaten, this);
        this.node.on(World.GAME_PAUSE, this.onPause, this);
        this.node.on(World.GAME_RESUME, this.onResume, this);
        this.heroBox = this.node.getComponent(cc.BoxCollider);
    }

    setDir(dir){
        this.targetVelocityX = dir*this.moveSpeedX;
    }

    update(dt){
        if(!World.playing){
            return;
        }
        //Y方向
        this.velocity.y += this.g*dt;
        let res = this.tryMove(this.foot, 0, this.velocity.y*dt);
        this.node.y += res.moveY;
        if(res.inter){
            this.velocity.y = 0;
        }
        //X方向
        if(this.useForceVelocityX){
            //强制x方向速度
            res = this.tryMove(this.body, this.forceVelocityX*dt, 0);
        }else{
            //用户控制
            if(this.velocity.x < this.targetVelocityX){
                this.velocity.x = Math.min(this.velocity.x + this.acc*dt, this.targetVelocityX);
            }else if(this.velocity.x > this.targetVelocityX){
                this.velocity.x = Math.max(this.velocity.x - this.acc*dt, this.targetVelocityX);
            }
            res = this.tryMove(this.body, this.velocity.x*dt, 0);
        }
        this.node.x += res.moveX;
        if(res.inter){
            this.velocity.x = 0;
        }
    }

    tryMove(collider:cc.Collider, moveX, moveY){
        let world = collider["world"];
        if(!world || world.rect){
            return {
                inter:false,
                moveX:moveX,
                moveY:moveY,
            };
        }
        let mng = cc.director.getCollisionManager();
        let shouldCollide = mng["shouldCollide"];
        let colliders:cc.Collider[] = mng["_colliders"];
        colliders = colliders.filter((other)=>{
            return other != collider && shouldCollide(other, collider);
        })
        let out = cc.rect();
        let testRect = cc.rect();
        testRect.x = world.aabb.x+moveX;
        testRect.y = world.aabb.y+moveY;
        testRect.width = world.aabb.width;
        testRect.height = world.aabb.height;
        let inter = false;
        for(let i=0; i<colliders.length; i++){
            let other = colliders[i];
            let otherRect:cc.Rect = other["world"]["aabb"];
            if(otherRect && otherRect.intersects(testRect)){
                otherRect.intersection(out, testRect);
                if(moveX>0){
                    moveX = Math.max(0, moveX - out.width);
                }else{
                    moveX = Math.min(0, moveX + out.width);
                }
                if(moveY>0){
                    moveY = Math.max(0, moveY - out.height);
                }else{
                    moveY = Math.min(0, moveY + out.height);
                }
                testRect.x = world.aabb.x+moveX;
                testRect.y = world.aabb.y+moveY;
                inter = true;
            }
        }
        return {
            inter:inter,
            moveX:moveX,
            moveY:moveY,
        }
    }

    onCollisionEnter(other:cc.Collider, self:cc.Collider){
        //自身碰撞盒接触旗帜过关
        if(self == this.heroBox){
            if(other.node.group == "flag"){
                this.node.dispatchEvent(Util.customEvent(World.GAME_WIN, true, true));
            }
        }
    }
    onBeatHper(beatData:FightSystem.BeatData){
        this.velocity.y = 500;
    }
    onBeaten(beatData:FightSystem.BeatData){
        if(beatData.causeDeath){
            this.node.dispatchEvent(Util.customEvent(World.GAME_OVER, true, true));
            World.Ins.pause();
            return;
        }
        this.useForceVelocityX = true;
        this.forceVelocityX = -Util.sign(this.velocity.x) * this.beatenSpeedX;
        this.velocity.x = this.forceVelocityX;
        this.velocity.y = 500;
        this.scheduleOnce(()=>{
            this.useForceVelocityX = false; 
        }, 0.4)
    }
    onPause(){

    }
    onResume(){

    }
}
