const { ccclass, property } = cc._decorator;

@ccclass
export default class ScreenRect extends cc.Component {

    @property(cc.Canvas)
    public canvas: cc.Canvas = null;

    public static Ins:ScreenRect = null;
    public static width:number = 1334;
    public static height:number = 750;
    onLoad() {

        this.node.width = this.canvas.designResolution.width;
        this.node.height = this.canvas.designResolution.height;
        let winSize = cc.winSize;
        let ratio = this.node.height/this.node.width;       //设计比例
        let ratio2 = winSize.height/winSize.width;          //屏幕比例
        
        if(ratio2 < ratio){
            //长屏适配
            this.node.scale = ratio2/ratio;
        }else{
            //宽屏适配
            // this.node.height = winSize.height;
            // this.node.width = winSize.width;
        }

        ScreenRect.width = this.node.width;
        ScreenRect.height = this.node.height;  
        ScreenRect.Ins = this; 
    }
}
