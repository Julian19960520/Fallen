import Panel from "../../Frame/Panel";
import Graphics from "../../CustomUI/Graphics";
import ScrollList from "../../CustomUI/ScrollList";
import Slider from "../../CustomUI/Slider";
import SceneManager from "../../Frame/SceneManager";
import MessageBox from "../../Frame/MessageBox";
import { Config, ColorData } from "../../Frame/Config";
import { Sound } from "../../Frame/Sound";
import Button from "../../CustomUI/Button";
import { Util } from "../../Frame/Util";
import { GameRecorder } from "../../Frame/GameRecorder";
import Scene from "../../Frame/Scene";


const {ccclass, menu, property} = cc._decorator;

enum State{
    Pencil,
    Eraser,
    Bucket,
}
@ccclass
@menu("面板/PaintPanel")
export default class PaintScene extends Scene {
    @property(Button)
    backBtn:Button = null;

    @property(ScrollList)
    colorList:ScrollList = null;

    //绘画
    @property(Button)
    pencilBtn:Button = null;
    @property(Button)
    eraserBtn:Button = null;
    @property(Button)
    revertBtn:Button = null;
    @property(Button)
    clearBtn:Button = null;
    @property(Button)
    bucketBtn:Button = null;
    @property(Button)
    saveBtn:Button = null;
    @property(Graphics)
    graphics:Graphics = null;
    @property(Slider)
    sizeSlider:Slider = null;

    @property(cc.Node)
    paintGroup:cc.Node = null;

    @property(cc.Node)
    bucketPointer:cc.Node = null;

    @property(cc.Node)
    eraserPointer:cc.Node = null;

    state:State = State.Pencil;

    private pencilColor:cc.Color = null;
    completeCall:(pixels:Uint8Array)=>void = null;
    onLoad () {
        super.onLoad();
        this.backBtn.node.on("click",this.onBackBtnTap, this);
        this.graphics.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.graphics.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.graphics.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.graphics.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.pencilBtn.node.on("click", this.onPencilTap, this);
        this.eraserBtn.node.on("click", this.onEraserTap, this);
        this.revertBtn.node.on("click", this.onRevertTap, this);
        this.clearBtn.node.on("click", this.onClearTap, this);
        this.bucketBtn.node.on("click", this.onBucketTap, this);
        this.saveBtn.node.on("click", this.onSaveBtnTap, this);
        this.sizeSlider.node.on(Slider.MOVE, this.onSizeChange, this);
    }

    start(){
        this.initColorBtns();
        this.highLightBtn(this.pencilBtn);
        this.bucketPointer.active = false;
        this.eraserPointer.active = false;
        this.state = State.Pencil;
        this.graphics.lineWidth = this.sizeSlider.value = 5;
    }

    initColorBtns(){
        this.colorList.node.on(ScrollList.SELECT_ITEM, this.selectColorChild, this);
        // this.colorList.node.width = Math.ceil(colorIds.length/2)*50;
        this.colorList.setDataArr(Config.colors);
        this.colorList.selectByIdx(0);
    }

    selectColorChild(idx, data:ColorData){
        this.pencilColor = data.color;
    }
    onBackBtnTap(){
        SceneManager.ins.Back();
    }
    onPencilTap(){
        this.highLightBtn(this.pencilBtn);
        this.state = State.Pencil;
    }
    onEraserTap(){
        this.highLightBtn(this.eraserBtn);
        this.state = State.Eraser;
    }
    onBucketTap(){
        this.highLightBtn(this.bucketBtn);
        this.state = State.Bucket;
    }
    onRevertTap(){
        this.graphics.revert();
    }
    onClearTap(){
        SceneManager.ins.OpenPanelByName("MessageBox",(messageBox:MessageBox)=>{
            messageBox.label.string = "是否清空画布？";
            messageBox.leftBtn.node.active = false;
            messageBox.setRightStyle({
                text:"确定",
                call:()=>{
                    this.graphics.clear();
                }
            })
        });
    }
    
    onExitBegin(){
        if(GameRecorder.recordering){
            GameRecorder.stop();
        }
    }

    onSaveBtnTap(){
        if(this.graphics.opStack.length<1){
            SceneManager.ins.OpenPanelByName("MessageBox",(messageBox:MessageBox)=>{
                messageBox.label.string = "多画几笔吧（最少1笔）";
                messageBox.leftBtn.node.active = false;
                messageBox.setRightStyle({
                    text:"确定"

                })
            });
        }else{
            if(GameRecorder.recordering){
                GameRecorder.stop();
            }
            if(this.completeCall)
                this.completeCall(this.graphics.pixels);
        }
    }
    
    highLightBtn(targetBtn:Button){
        let btns = [this.pencilBtn, this.eraserBtn, this.bucketBtn];
        for(let i=0; i<btns.length; i++){
            let btn = btns[i];
            let select = Util.searchChild(btn.node, "select");
            if(select){
                select.active = (btn == targetBtn);
            }
        }
    }
    onSizeChange(size){
        Sound.play("clickBtn");
        this.graphics.lineWidth = size;
    }

    private onTouchStart(event:cc.Event.EventTouch){
        if(!GameRecorder.recordering){
            GameRecorder.start();
        }
        let pos = event.getLocation();
        this.graphics.node.convertToNodeSpaceAR(pos, pos);
        switch(this.state){
            case State.Bucket:{
                this.bucketPointer.active = true;
                this.bucketPointer.position = pos.add(cc.v2(0, 30));
                this.bucketPointer.children[0].color = this.pencilColor;
                break;
            }
            case State.Pencil: {
                this.graphics.color = this.pencilColor;
                this.graphics.beginLine(pos); 
                this.graphics.lineTo(pos);
                break;
            }
            
            case State.Eraser:{
                let tool:cc.Node = this.eraserPointer;
                let gra = this.eraserPointer.getComponentInChildren(cc.Graphics);
                gra.clear();
                gra.fillColor = gra.strokeColor = cc.Color.WHITE;
                gra.circle(0,0, this.graphics.lineWidth/this.eraserPointer.scale);
                gra.stroke();

                tool.position = pos;
                let posNode = Util.searchChild(tool, "posNode");
                pos = Util.convertPosition(posNode, this.graphics.node);
                tool.active = true;
                this.graphics.color = cc.Color.TRANSPARENT;
                this.graphics.beginLine(pos);  
                this.graphics.lineTo(pos);   
                break;
            } 
        }
    }
    private onTouchMove(event:cc.Event.EventTouch){
        let pos = event.getLocation();
        this.graphics.node.convertToNodeSpaceAR(pos, pos);
        switch(this.state){
            case State.Bucket:{
                this.bucketPointer.position = pos.add(cc.v2(0, 30));
                break;
            }
            case State.Pencil: {
                this.graphics.lineTo(pos);     
                break;
            }
            case State.Eraser:{
                let tool:cc.Node = this.eraserPointer;
                tool.position = pos;
                let posNode = Util.searchChild(tool, "posNode");
                pos = Util.convertPosition(posNode, this.graphics.node);
                this.graphics.lineTo(pos);     
                break;
            } 
        }
    }
    private onTouchEnd(event:cc.Event.EventTouch){
        switch(this.state){
            case State.Bucket:{
                this.bucketPointer.active = false;
                let posNode = Util.searchChild(this.bucketPointer, "posNode");
                let pos = Util.convertPosition(posNode, this.graphics.node);
                this.graphics.bucketFill(pos, this.pencilColor);
                break;
            }
            case State.Pencil: case State.Eraser:{
                this.eraserPointer.active = false;
                this.graphics.endLine();   
                break;
            } 
        }
    }
}