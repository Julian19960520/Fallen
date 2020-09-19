import Button from "../CustomUI/Button";
import Panel from "./Panel";
import SceneManager from "./SceneManager";
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, menu, property} = cc._decorator;

@ccclass
@menu("面板/MessageBox")
export default class MessageBox extends Panel {
    @property(cc.Label)
    public label:cc.Label = null;
    @property(Button)
    public leftBtn:Button = null;
    @property(Button)
    public rightBtn:Button = null;

    public onLeft = null;
    public onRight = null;

    onLoad(){
        super.onLoad();
        this.leftBtn.node.on("click", this.onLeftBtnClick, this);
        this.rightBtn.node.on("click", this.onRightBtnClick, this);
    }
    onDestroy(){
        super.onDestroy();
        this.onLeft = null;
        this.onRight = null;
    }
    private onLeftBtnClick(){
        if(this.onLeft){
            this.onLeft();
        }
        this.onLeft = null;
        this.onRight = null;
        this.closePanel();
    }
    private onRightBtnClick(){
        if(this.onRight){
            this.onRight();
        }
        this.onLeft = null;
        this.onRight = null;
        this.closePanel();
    }
    setLeftStyle(data:{text?:string, color?:cc.Color, call?:Function}){
        this.leftBtn.label.string = data.text || "";
        this.leftBtn.background.node.color = data.color || cc.Color.WHITE;
        this.onLeft = data.call;
    }
    setRightStyle(data:{text?:string, color?:cc.Color, call?:Function}){
        this.rightBtn.label.string = data.text || "";
        this.rightBtn.background.node.color = data.color || cc.Color.WHITE;
        this.onRight = data.call;
    }
}
