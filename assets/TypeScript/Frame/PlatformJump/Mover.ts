// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import World from "./World";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Mover extends cc.Component {
    @property(cc.BoxCollider)
    foot:cc.BoxCollider = null;
    @property(cc.BoxCollider)
    body:cc.BoxCollider = null;
    @property(cc.Animation)
    anim:cc.Animation = null;

    velocity:cc.Vec2 = cc.Vec2.ZERO;
    g = -1500;   //重力加速度
    acc = 7000;  //水平加速度
    moveSpeedX = 500;           //最大水平移动速度
    targetVelocityX = 0;        //目标水平速度
    forceVelocityX = 0;         //强制水平数独
    useForceVelocityX = false;  //是否使用强制水平速度
    isGround = false;           //是否站在地面上
    setMoveDir(dir){
        this.targetVelocityX = dir*this.moveSpeedX;
    }
    setForceVelocityX(x, timeInSecond){
        this.useForceVelocityX = true;
        this.forceVelocityX = x;
        this.scheduleOnce(()=>{
            this.useForceVelocityX = false; 
        }, timeInSecond)
    }
    update(dt){
        if(!World.playing){
            return;
        }
        //Y方向
        this.velocity.y += this.g*dt;
        let res = this.tryMove(this.foot, 0, this.velocity.y*dt);
        this.node.y += res.moveY;
        this.isGround = res.inter;
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
        //左右循环
        if(this.node.x < -World.Ins.node.width/2){
            this.node.x += World.Ins.node.width;
        }else if(this.node.x > World.Ins.node.width/2){
            this.node.x -= World.Ins.node.width;
        }
        //动画
        this.updateAnim();
    }
    //尝试向指定偏移移动，返回最多能移动的距离，并不真的移动
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
    curAnimName = "";
    updateAnim(){
        if(this.targetVelocityX>0){
            this.anim.node.scaleX = 1;
        }else if(this.targetVelocityX<0){
            this.anim.node.scaleX = -1;
        }
        let animName = "";
        if(this.isGround){
            if(this.targetVelocityX == 0){
                animName = "heroIdle";
            }else{
                animName = "heroRun";
            }
        }else{
            animName = "heroJump";
        }
        if(this.curAnimName != animName){
            this.curAnimName = animName;
            this.anim.play(animName);
        }
    }
}
