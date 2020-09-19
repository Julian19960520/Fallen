import PanelStack from "./PanelStack";
import { DB } from "./DataBind";
import SceneManager from "./SceneManager";
import Button from "../CustomUI/Button";
import PanelQueue from "./PanelQueue";
import { Easing } from "./TweenUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Panel extends DB.DataBindComponent {

    @property
    public autoHidePrePanel = true;        //当打开此面板时，是否自动隐藏前一个面板（隐藏不会引起关闭）
    @property(Button)
    public closeBtn:Button = null;
    
    public panelStack:PanelStack = null;
    public panelQueue:PanelQueue = null;
    public closeCallback = null;

    onLoad(){
        if(this.closeBtn){
            this.closeBtn.node.on("click", this.onCloseBtnTap, this);
        }
    }
    onDestroy(){
        super.onDestroy();
        this.closeCallback = null;
    }
    public closeAnim(callback = null){
        cc.tween(this.node).to(0.1,{opacity:0}).start();
        cc.tween(this.node).to(0.15,{scale:0.8},{easing:Easing.backOut}).call(callback).start();
    }
    public openAnim(callback = null){
        this.node.scale = 0.8;
        this.node.opacity = 0;
        cc.tween(this.node).to(0.1,{opacity:255}).start();
        cc.tween(this.node).to(0.15,{scale:1},{easing:Easing.backOut}).call(callback).start();
    }

    protected closePanel(){
        if(this.panelStack){
            SceneManager.ins.popPanel();
        }
        if(this.panelQueue){
            this.panelQueue.checkNext();
        }
    }

    onCloseBtnTap(){
        this.closePanel();
    }
}
