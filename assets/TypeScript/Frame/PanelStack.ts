// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import Panel from "./Panel";
import Scene from "./Scene";
import { Util } from "./Util";
@ccclass
export default class PanelStack extends cc.Component {
    @property(cc.BlockInputEvents)
    private blockInput:cc.BlockInputEvents = null;
    private stack:Panel[] = [];
    public scene:Scene;
    tw:cc.Tween = null;
    blocking = false;
    onLoad(){
        this.blocking = this.blockInput.node.active = false;
    }
    showBlockInput(b){
        if(this.blocking != b){
            this.blocking = b;
            if(this.tw){
                this.tw.stop();
            }
            if(b){
                this.blockInput.node.active = true;
                this.blockInput.node.opacity = 0;
                this.tw = cc.tween(this.blockInput.node).to(0.15, {opacity:180}).start();
            }else{
                this.blockInput.node.opacity = 180;
                this.tw = cc.tween(this.blockInput.node).to(0.15, {opacity:0}).call(()=>{
                    this.blockInput.node.active = false;
                }).start();
            }
        }
    }
    public OpenByName(name:string, callback = (panel)=>{}){
        this.OpenByPath(`Panel/${name}`, callback);
    }
    public OpenByPath(path:string, callback = (panel)=>{}){
        this.showBlockInput(true);
        Util.loadBundleRes(path, (prefab) => {
            var newNode:cc.Node = cc.instantiate(prefab);
            newNode.name = path.substr(path.lastIndexOf("/")+1);
            newNode.position = cc.Vec2.ZERO;
            let panel = newNode.getComponent(Panel);
            if(panel){
                //隐藏上个面板,
                if(this.stack.length > 0){
                    let lastPanel = this.stack[this.stack.length-1];
                    if(panel.autoHidePrePanel){
                        lastPanel.closeAnim();
                    }
                }
                //打开新面板
                panel.panelStack = this;
                this.blockInput.node.setSiblingIndex(this.node.childrenCount-1);
                this.node.addChild(panel.node, this.node.childrenCount-1);
                panel.openAnim();
                this.stack.push(panel);
                callback(panel);
                this.printStack();
            }else{
                this.showBlockInput(false);
                console.error("PanelManager: cannot find panel component on node : " + path);
            }
        });
    }
    
    public PopCurrent(){
        let autoHidePrePanel = true;
        if(this.stack.length>0){
            let panel = this.stack.pop();
            autoHidePrePanel = panel.autoHidePrePanel;
            panel.closeAnim(()=>{
                if(panel.closeCallback){
                    panel.closeCallback();
                }
                panel.panelStack = null;
                panel.node.removeFromParent();
                panel.node.destroy(); 
                // this.node.removeChild(panel.node); 
                this.printStack();
            })
        }
        if(this.stack.length>0){
            let lastPanel = this.stack[this.stack.length-1];
            this.blockInput.node.setSiblingIndex(this.node.childrenCount-1);
            lastPanel.node.setSiblingIndex(this.node.childrenCount-1);
            if(autoHidePrePanel){
                lastPanel.openAnim();
            }
        }else{
            this.showBlockInput(false);
        }
    }

    public printStack(){
        let str = "PanelStack:"
        for(let i=0; i<this.node.childrenCount; i++){
            str += this.node.children[i].name+" >> ";
        }
        console.log(str);
    }
}
