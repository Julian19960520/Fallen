
const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("自定义UI/ProgressBar")
export default class ProgressBar extends cc.Component {
    @property(cc.Widget)
    maskWidget:cc.Widget = null;
    @property(cc.Widget)
    barWidget:cc.Widget = null;
    @property(cc.Node)
    slot:cc.Node = null;

    @property
    isHor:boolean = true;

    min:number = 0;
    max:number = 1;
    cur:number = 1;
    tw:cc.Tween = null;

    onProgressChange:(min,max,cur,progress)=>void = null;

    onLoad(){
        this.maskWidget.enabled = false;
        this.barWidget.enabled = false;
    }
    setRange(min, max){
        this.min = min;
        this.max = max;
    }
    setValue(value){
        this.cur = value;
        let progress = (this.cur-this.min) / (this.max - this.min);
        if(this.isHor){
            this.maskWidget.node.width = this.barWidget.node.width * progress;
            if(this.slot){
                this.slot.x = this.maskWidget.node.x + this.maskWidget.node.width;
            }
        }else{
            this.maskWidget.node.height = this.barWidget.node.height * progress;
            if(this.slot){
                this.slot.y = this.maskWidget.node.y + this.maskWidget.node.height;
            }
        }
        if(this.onProgressChange){
            this.onProgressChange(this.min, this.max, this.cur, progress);
        }
    }
    animaTo(value, duration, callback){
        if(this.tw){
            this.tw.stop();
        }
        this.tw = cc.tween(this)
            .to(duration, {cur:value}, {progress:(start, end, current, ratio) => {
                let ease = ratio * ( 2 - ratio );
                let cur = start + (end - start) * ease;
                this.setValue(cur);
                return value;
            }}).call(callback).start();
    }
}
