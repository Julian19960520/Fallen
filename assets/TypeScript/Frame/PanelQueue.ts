// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Panel from "./Panel";
import Scene from "./Scene";
import { Util } from "./Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PanelQueue extends cc.Component {
    public queue:any[] = [];                 //检查函数队列
    private curPanel:Panel = null;              //正在显示的面板
    public scene:Scene;
    constructor(){
        super();
    }

    public pushPanel(panelName, onPanelReady=null, isQueueHead = false){
        let makePanelFunc = (succ, fail)=>{
            Util.loadBundleRes(`Panel/${panelName}`, (prefab) => {
                var newNode:cc.Node = cc.instantiate(prefab);
                newNode.name = panelName;
                newNode.position = cc.Vec2.ZERO;
                let panel = newNode.getComponent(Panel);
                if(panel){
                    if(onPanelReady) onPanelReady(panel);
                    succ(panel);
                }else{
                    fail();
                }
            });
        };
        this.pushCheckFunc(makePanelFunc, isQueueHead);
    }
    public pushCall(callback, isQueueHead = false){
        let makePanelFunc = (succ, fail)=>{
            fail();
            callback();
        };
        this.pushCheckFunc(makePanelFunc, isQueueHead);
    }
    //插入一个检查函数，可选插入队头或队尾
    public pushCheckFunc(func:(succ:(panel:Panel)=>void, fail)=>void, isQueueHead = false){
        if(isQueueHead){
            this.queue.unshift(func);
        }else{
            this.queue.push(func);
        }
    }
    
    //关闭当前面板，并检查是否有下一个面板
    public checkNext(){
        //关闭当前面板
        if(this.curPanel){
            if(this.curPanel.closeCallback){
                this.curPanel.closeCallback();
            }
            this.curPanel.node.removeFromParent();
            this.curPanel.node.destroy();
            this.curPanel = null;
            this.printQueue();
        }

        //检查下一面板，
        let checkOne = ()=>{
            if(this.queue.length>0){
                this.node.active = true; 
                let makePanelFunc = this.queue.shift();
                makePanelFunc((panel)=>{
                    //succ
                    panel.panelQueue = this;
                    this.node.addChild(panel.node);
                    panel.openAnim();
                    this.curPanel = panel;
                    this.printQueue();
                },()=>{
                    //fail
                    checkOne();
                });
            }else{
                this.node.active = false;
            }
        }
        checkOne();
    }
    public printQueue(){
        let str = "PanelQueue:"
        for(let i=0; i<this.node.childrenCount; i++){
            str += this.node.children[i].name+" >> ";
        }
        console.log(str);
    }
}
