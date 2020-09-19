// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Star extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    sprite: cc.Node = null;

    onLoad(){

    }

    hide(){
        this.sprite.active = false;
    }
    show(){
        this.sprite.active = true;
    }
    isShowing(){
        return this.sprite.active;
    }
    playShow(){
        this.sprite.active = true;
        this.node.getComponent(cc.Animation).play("starAppear");
    }
}
