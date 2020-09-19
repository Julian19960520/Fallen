import { DB } from "../Frame/DataBind";

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("自定义UI/CircleProgress")
export default class CircleProgress extends DB.DataBindComponent {
    @property(cc.Sprite)
    progressIcon: cc.Sprite = null;
    @property(cc.Label)
    label: cc.Label = null;
    setProgress(progress:number){
        this.progressIcon.fillRange = progress;
        if(progress<0.2){
            this.progressIcon.node.color = cc.Color.RED;
        }else if(progress <0.5){
            this.progressIcon.node.color = cc.Color.YELLOW;
        }else{
            this.progressIcon.node.color = cc.Color.GREEN;
        }
        this.label.string = `${Math.floor(progress*100)}%`;
    }
    progressTo(to:number){
        
    }
}
