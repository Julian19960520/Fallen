
import Panel from "../../Frame/Panel";
import Button from "../../CustomUI/Button";
import { TweenUtil } from "../../Frame/TweenUtil";
import { Sound } from "../../Frame/Sound";

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("面板/RewardPanel")
export default class BaseGainPanel extends Panel {

    @property(cc.Node)
    lightNode: cc.Node = null;

    @property(cc.Node)
    rewardPos: cc.Node = null;

    @property(Button)
    gainBtn: Button = null;

    gainCallback = null;
    onLoad () {
        super.onLoad();
        this.gainBtn.node.on("click", this.onGainBtnTap, this);
        this.initLight();
        Sound.play("openGainPanel");
    }

    openAnim(callback = null){
        TweenUtil.applyAppear({node:this.node, callback:callback});
        TweenUtil.applyAppear({node:this.rewardPos, delay:0.25, duration:0.3});
        TweenUtil.applyAppear({node:this.gainBtn.node, delay:0.25, duration:0.3});
    }

    initLight(){
        let cnt = 7;
        while(this.lightNode.childrenCount<cnt){
            let child = cc.instantiate(this.lightNode.children[0]);
            this.lightNode.addChild(child);
        }
        for(let i=0;i<cnt;i++){
            let child = this.lightNode.children[i];
            child.angle = i*360/cnt;
            child.runAction(cc.repeatForever(cc.rotateBy(10, 360)));
        }
    }

    onGainBtnTap(){
        if(this.gainCallback){
            this.gainCallback();
        }
        this.closePanel();
    }
}
