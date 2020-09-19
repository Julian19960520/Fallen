// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class CollisionEmiter extends cc.Component {
    public static onCollisionEnter = "EmiterCollisionEnter";
    @property(cc.Node)
    target: cc.Node = null;

    onCollisionEnter(other, self){
        if(this.target){
            this.target.emit(CollisionEmiter.onCollisionEnter,other, self);
        }
    }

}
