// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Button from "../../CustomUI/Button";
import Hero from "../../Frame/PlatformJump/Hero";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerCtrl extends cc.Component {
    @property(Button)
    leftBtn:Button = null;

    @property(Button)
    rightBtn:Button = null;
    
    @property(Hero)
    hero:Hero = null;

    onLoad(){
        this.leftBtn.node.on(cc.Node.EventType.TOUCH_START, this.onLeftTouchStart, this);
        this.leftBtn.node.on(cc.Node.EventType.TOUCH_END, this.onLeftTouchEnd, this);
        this.leftBtn.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onLeftTouchEnd, this);
        this.rightBtn.node.on(cc.Node.EventType.TOUCH_START, this.onRightTouchStart, this);
        this.rightBtn.node.on(cc.Node.EventType.TOUCH_END, this.onRightTouchEnd, this);
        this.rightBtn.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onRightTouchEnd, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy(){
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown (event) {
        switch(event.keyCode) {
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
        this.hero.mover.setMoveDir(this.dir);
    }
    onLeftTouchEnd(){
        if(!this.leftStarted){
            return;
        }
        this.leftStarted = false;
        this.dir++;
        this.hero.mover.setMoveDir(this.dir);
    }
    onRightTouchStart(){
        if(this.rightStarted){
            return;
        }
        this.rightStarted = true;
        this.dir++;
        this.hero.mover.setMoveDir(this.dir);
    }
    onRightTouchEnd(){
        if(!this.rightStarted){
            return;
        }
        this.rightStarted = false;
        this.dir--;
        this.hero.mover.setMoveDir(this.dir);
    }
}
