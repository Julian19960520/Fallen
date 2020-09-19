import { Vibrate } from "../Frame/Vibrate";
import { Sound } from "../Frame/Sound";
import { Util } from "../Frame/Util";
const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("自定义UI/Button")
export default class Button extends cc.Button {
    @property
    soundName = "clickBtn";
    @property(cc.Sprite)
    background:cc.Sprite = null;
    @property(cc.Sprite)
    icon:cc.Sprite = null;
    @property(cc.Label)
    label:cc.Label = null;

    @property(cc.Node)
    dot:cc.Node = null;

    onLoad(){
        if(!this.target){
            this.target = this.node;
        }
        if(this.transition == cc.Button.Transition.NONE){
            this.transition = cc.Button.Transition.SCALE;
        }
        this.node.on("click", this.onClick, this);
    }
    onClick(){
        Sound.play(this.soundName);
        Vibrate.short();
    };
    tempDisable(time){
        this.interactable = false;
        setTimeout(() => {
            this.interactable = true;
        }, time);
    }
    showDot(b){
        if(this.dot){
            this.dot.active = b;
        }
    }
    setIconUrl(url){
        if(this.icon && url){
            Util.loadBundleRes(url,cc.SpriteFrame, (sf)=>{
                this.icon.spriteFrame = sf;
            });
        }
    }
}
