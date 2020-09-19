import Button from "./Button";

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("自定义UI/IconStateBtn")
export default class IconStateBtn extends Button {
    @property(cc.SpriteFrame)
    spriteFrame0: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    spriteFrame1: cc.SpriteFrame = null;

    setIocnState(state) {
        if(state == 0){
            this.icon.spriteFrame = this.spriteFrame0;
        }else{
            this.icon.spriteFrame = this.spriteFrame1;
        }
    }
}
