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
import {DB} from "./DataBind";
import PanelStack from "./PanelStack";
import { Util } from "./Util";
import SceneManager from "./SceneManager";
import Top from "./Top";
import PanelQueue from "./PanelQueue";
@ccclass
export default class Scene extends DB.DataBindComponent {
    @property
    public autoDestroy = true;
    @property
    public showBack:boolean = true;
    @property
    public showCoinBar:boolean = false;
    @property
    public showDiamondBar:boolean = false;
    @property
    public showStarBar:boolean = false;
    @property
    public showEnergyBar:boolean = false;
    @property
    public sceneTitle:string = "";
    @property
    public bgColor:cc.Color = cc.Color.WHITE;
    
    public panelStack:PanelStack = null;
    public panelQueue:PanelQueue = null;

    onLoad(){
        
    }
    public onExitScene(){}
    public onEnterScene(){}
    public onShow(data){
        if(Top.isBlocking()){
            return; //正在锁定点击，则不理会链接参数
        }
        let open = false;
        let query = data.query;
        if(query){

        }
        return open;
    }
    
    public onHide(data){

    }
    public onNavigationBack(){
        SceneManager.ins.Back();
    }
    public onNavigationCoinBar(){

    }
    onNavigationDiamondBar(){

    }
    public onNavigationEnergyBar(){

    }


    //初始化PanelStack
    private initPanelStack(){
        SceneManager.ins.blockInput.node.active = true;
        return new Promise((resolve, reject)=>{
            if(this.panelStack){
                SceneManager.ins.blockInput.node.active = false;
                resolve(this.panelStack)
            }else{
                Util.loadBundleRes("Prefab/PanelStack", (asset:cc.Prefab)=>{
                    SceneManager.ins.blockInput.node.active = false;
                    let node:cc.Node = cc.instantiate(asset);
                    this.node.addChild(node);
                    this.panelStack = node.getComponent(PanelStack);
                    this.panelStack.scene = this;
                    resolve(this.panelStack);
                })
            }
        })
    }
    //打开一个面板，以resource/Panel文件夹作为根查找prefab
    public OpenPanelByName(name:string, callback = (panel)=>{}){
        if(this.panelStack){
            this.panelStack.node.setSiblingIndex(this.node.childrenCount - 1);
            this.panelStack.OpenByName(name, callback);
        }else{
            this.initPanelStack().then((panelStack:PanelStack)=>{
                panelStack.node.setSiblingIndex(this.node.childrenCount - 1);
                panelStack.OpenByName(name, callback);
            })
        }
    }
    //弹出栈顶面板
    public PopPanel(){
        if(this.panelStack){
            SceneManager.ins.popPanel();
        }
    }


    //初始化PanelQueue
    panelQueuePromise:Promise<PanelQueue> = null;
    private initPanelQueue(){
        if(!this.panelQueuePromise){
            SceneManager.ins.blockInput.node.active = true;
            this.panelQueuePromise = new Promise((resolve, reject)=>{
                if(this.panelQueue){
                    SceneManager.ins.blockInput.node.active = false;
                    resolve(this.panelQueue)
                }else{
                    Util.loadBundleRes("Prefab/PanelQueue", ( asset:cc.Prefab)=>{
                        SceneManager.ins.blockInput.node.active = false;
                        let node = cc.instantiate(asset);
                        this.node.addChild(node);
                        this.panelQueue = node.getComponent(PanelQueue);
                        this.panelQueue.scene = this;
                        resolve(this.panelQueue);
                    })
                }
            })
        }
        return this.panelQueuePromise;
    }

    //队列中增加一个面板
    public pushPanel(panelName, callback=null, isQueueHead = false){
        if(this.panelQueue){
            this.panelQueue.node.setSiblingIndex(this.node.childrenCount - 1);
            this.panelQueue.pushPanel(panelName, callback, isQueueHead);
        }else{
            this.initPanelQueue().then((panelQueue:PanelQueue)=>{
                panelQueue.node.setSiblingIndex(this.node.childrenCount - 1);
                panelQueue.pushPanel(panelName, callback, isQueueHead);
            })
        }
    }
    //队列中增加一个
    public pushCall(callback=null, isQueueHead = false){
        if(this.panelQueue){
            this.panelQueue.node.setSiblingIndex(this.node.childrenCount - 1);
            this.panelQueue.pushCall(callback, isQueueHead);
        }else{
            this.initPanelQueue().then((panelQueue:PanelQueue)=>{
                panelQueue.node.setSiblingIndex(this.node.childrenCount - 1);
                panelQueue.pushCall(callback, isQueueHead);
            })
        }
    }
    //开始依次弹队列中的面板
    public checkNextPanel(){
        if(this.panelQueue){
            this.panelQueue.node.setSiblingIndex(this.node.childrenCount - 1);
            this.panelQueue.checkNext();
        }else{
            this.initPanelQueue().then((panelQueue:PanelQueue)=>{
                panelQueue.node.setSiblingIndex(this.node.childrenCount - 1);
                panelQueue.checkNext();
            })
        }
    }
}
