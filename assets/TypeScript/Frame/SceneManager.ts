const {ccclass, property} = cc._decorator;
import Scene from "./Scene";
import ScreenRect from "./ScreenRect";
import { Util } from "./Util";
import { crossPlatform } from "./CrossPlatform";

@ccclass
export default class SceneManager extends cc.Component {
    stack:string[] = [];
    curScene:Scene = null;
    static ins:SceneManager = null;
    @property
    firstScene:string = "";
    @property
    homeScene:string = "";
    @property(cc.Node)
    content:cc.Node = null;
    @property(cc.BlockInputEvents)
    blockInput:cc.BlockInputEvents = null;
    onLoad(){
        SceneManager.ins = this;
        for(let i=0;i<this.content.childrenCount;i++){
            this.content.children[i].active = false;
        }
        crossPlatform.onShow(this.onShow.bind(this));
        crossPlatform.onHide(this.onHide.bind(this));
        this.Enter(this.firstScene);
        this.blockInput.node.active = false;
    }
    //进入新场景
    public Enter(sceneName:string, callback = null, shiftAnima = ShiftAnima.simpleShift){
        this.blockInput.node.active = true;
        this.stack.push(sceneName);
        this.shiftScene(sceneName, shiftAnima).then(callback);
    }
    //回到上个场景
    public Back(callback = null, shiftAnima = ShiftAnima.simpleShift){
        this.blockInput.node.active = true;
        if(this.stack.length >= 2){
            this.stack.pop();
            this.shiftScene(this.stack[this.stack.length-1], shiftAnima).then(callback);
        }else{
            console.log("前面没有场景了");
            this.blockInput.node.active = false;
        }
    }
    //回到上个场景
    public BackTo(sceneName:string, callback = null, shiftAnima = ShiftAnima.simpleShift){
        this.blockInput.node.active = true;
        if(sceneName == this.curScene.node.name){
            if(callback) callback(this.curScene)
            this.blockInput.node.active = false;
            return;
        }
        //先弹出当前场景，但不销毁
        this.stack.pop();
        //检查并销毁路径上的场景
        while(this.stack.length > 0 
                && (sceneName != this.stack[this.stack.length-1])){
            this.stack.pop();
            let sceneNode = this.content.getChildByName(sceneName);
            if(sceneNode){
                let scene = sceneNode.getComponent(Scene);
                if(scene && scene.autoDestroy){
                    sceneNode.destroy();
                    // this.content.removeChild(sceneNode);
                }
            }
        }
        //从当前场景转换到Home场景
        this.shiftScene(sceneName, shiftAnima).then(callback);
    }
    //回到Home场景，并检查返回路径上的场景是否需要销毁
    public goHome(callback = null, shiftAnima = ShiftAnima.simpleShift){
        this.blockInput.node.active = true;
        if(this.homeScene == this.curScene.node.name){
            if(callback) callback(this.curScene)
            this.blockInput.node.active = false;
            return;
        }
        //先弹出当前场景，但不销毁
        this.stack.pop();
        //检查并销毁路径上的场景
        let sceneName;
        while(this.stack.length > 0 
                && (sceneName = this.stack[this.stack.length-1]) != this.homeScene){
            this.stack.pop();
            let sceneNode = this.content.getChildByName(sceneName);
            if(sceneNode){
                let scene = sceneNode.getComponent(Scene);
                if(scene && scene.autoDestroy){
                    sceneNode.destroy();
                    // this.content.removeChild(sceneNode);
                }
            }
        }
        //从当前场景转换到Home场景
        this.shiftScene(this.homeScene, shiftAnima).then(callback);
    }
    public EnterFromHome(sceneName, callback = null, shiftAnima= ShiftAnima.simpleShift){
        this.stack = [this.homeScene];
        SceneManager.ins.Enter(sceneName, callback, shiftAnima);
    }
    //从当前场景转换到目标场景
    private shiftScene(targetSceneName, shiftAnima){
        this.scheduleOnce(()=>{
            this.blockInput.node.active = false;
        },1)
        return new Promise((resolve, reject)=>{
            this.loadScene(targetSceneName).then((newScene:Scene)=>{
                resolve(newScene);
                let oldScene = this.curScene;
                this.curScene = newScene;
                shiftAnima(oldScene, newScene, ()=>{
                    if(oldScene){
                        oldScene.onExitScene();
                        if(oldScene.autoDestroy){
                            this.content.removeChild(oldScene.node);
                            oldScene.node.destroy();
                        }
                    }
                    newScene.onEnterScene();
                    this.printState();
                    this.blockInput.node.active = false;
                });
            }).catch((e)=>{
                cc.error(e);
                reject();
                this.blockInput.node.active = false;
            });
        });
    }
    prefabCache = new Map<string, any>();
    //获取场景对象，如果有缓存直接使用，没有则新建对象。
    private loadScene(sceneName:string){
        return new Promise((reslove, reject)=>{
            let sceneNode = this.content.getChildByName(sceneName);
            if(sceneNode){
                let scene:Scene = sceneNode.getComponent(Scene);
                reslove(scene);
            }else{
                Util.loadBundleRes("Scene/"+sceneName+"/"+sceneName, (asset)=>{
                    var newNode:cc.Node = cc.instantiate(asset);
                    newNode.name = sceneName;
                    newNode.position = cc.Vec2.ZERO;
                    newNode.active = false;
                    let scene = newNode.getComponent(Scene);
                    if(scene){
                        this.content.addChild(scene.node, 0);
                        reslove(scene);
                    }else{
                        reject();
                    }
                })
            }
        });
    }
    //在content种找到场景实例，
    public findScene<T extends Scene>(type: {prototype: T}):T{
        return this.content.getComponentInChildren(type);
    }
    //打开面板
    public OpenPanelByName(name, callback = (panel)=>{}){
        this.curScene.OpenPanelByName(name,callback);
    }
    //队列中增加一个面板
    public pushPanel(panelName, callback=null, isQueueHead = false){
        this.curScene.pushPanel(panelName, callback, isQueueHead);
    }
    //队列中增加一个回调
    public pushCall(callback=null, isQueueHead = false){
        this.curScene.pushCall(callback, isQueueHead);
    }
    //开始依次弹队列中的面板
    public checkNextPanel(){
        this.curScene.checkNextPanel();
    }
    //弹出最上层面板
    public popPanel(){
        if(this.curScene && this.curScene.panelStack){
            this.curScene.panelStack.PopCurrent();
        }
    }
    private printState(){
        let str = "\n++++++++++++SceneManager++++++++++++\n+ stack: ";
        for(let i=0; i<this.stack.length; i++){
            str += " >> "+this.stack[i];
        }
        str+="\n+ cache: ";
        for(let i=0;i<this.content.childrenCount;i++){
            str += `${i}:${this.content.children[i].name},`;
        }
        str += "\n++++++++++++++++++++++++++++++++++++\n"
        console.log(str);
    }
    public onShow(data){
        
    }
    public onHide(data){
        console.log("onHide",data);
        if(this.curScene){
            this.curScene.onHide(data);
        }
    }
}




export namespace ShiftAnima{
    export function simpleShift(curScene:Scene, newScene:Scene, finish){
        if(curScene){
            curScene.node.active = false;
        }
        if(newScene){
            newScene.node.active = true;
        }
        finish();
    }
    export function moveLeftShift(curScene:Scene, newScene:Scene, finish){
        if(curScene){
            curScene.node.position = cc.v2(0, 0);
            cc.tween(curScene.node).to(0.5, {position: cc.v2(-ScreenRect.width, 0)}, { easing: 'quintOut'}).call(()=>{
                curScene.node.active = false;
            }).start();
        }
        if(newScene){
            newScene.node.position = cc.v2(ScreenRect.width, 0);
            newScene.node.active = true;
            cc.tween(newScene.node).to(0.5, {position: cc.v2(0, 0)}, { easing: 'quintOut'}).call(()=>{
                finish();
            }).start();
        }
    }
    export function moveRightShift(curScene:Scene, newScene:Scene, finish){
        if(curScene){
            curScene.node.position = cc.v2(0, 0);
            cc.tween(curScene.node).to(0.5, {position: cc.v2(ScreenRect.width, 0)}, { easing: 'quintOut'}).call(()=>{
                curScene.node.active = false;
            }).start();
        }
        if(newScene){
            newScene.node.position = cc.v2(-ScreenRect.width, 0);
            newScene.node.active = true;
            cc.tween(newScene.node).to(0.5, {position: cc.v2(0, 0)}, { easing: 'quintOut'}).call(()=>{
                finish();
            }).start();
        }
    }
    export function moveUpShift(curScene:Scene, newScene:Scene, finish){
        if(curScene){
            curScene.node.position = cc.v2(0, 0);
            cc.tween(curScene.node).to(0.5, {position: cc.v2(0, -ScreenRect.height)}, { easing: 'quintOut'}).call(()=>{
                curScene.node.active = false;
            }).start();
        }
        if(newScene){
            newScene.node.position = cc.v2(0, ScreenRect.height);
            newScene.node.active = true;
            cc.tween(newScene.node).to(0.5, {position: cc.v2(0, 0)}, { easing: 'quintOut'}).call(()=>{
                finish();
            }).start();
        }
    }
    export function moveDownShift(curScene:Scene, newScene:Scene, finish){
        if(curScene){
            curScene.node.position = cc.v2(0, 0);
            cc.tween(curScene.node).to(0.5, {position: cc.v2(0, ScreenRect.height)}, { easing: 'quintOut'}).call(()=>{
                curScene.node.active = false;
            }).start();
        }
        if(newScene){
            newScene.node.position = cc.v2(0, -ScreenRect.height);
            newScene.node.active = true;
            cc.tween(newScene.node).to(0.5, {position: cc.v2(0, 0)}, { easing: 'quintOut'}).call(()=>{
                finish();
            }).start();
        }
    }
    export function scaleShift(curScene:Scene, newScene:Scene, finish){
        if(curScene){
            curScene.node.scale = 1;
            cc.tween(curScene.node).to(1,{scale:0}).call(()=>{
                curScene.node.active = false;
            }).start();
        }
        if(newScene){
            curScene.node.scale = 0;
            newScene.node.active = true;
            cc.tween(newScene.node).delay(1).to(1000,{scale:1}).call(()=>{
                finish();
            }).start();
        }
    }
    export function blackShift(curScene:Scene, newScene:Scene, finish){
        let node = new cc.Node();
        node.color = cc.Color.BLACK;
        let sprite = node.addComponent(cc.Sprite);

        Util.loadBundleRes("Atlas/UI/white", cc.SpriteFrame, (asset)=>{
            sprite.spriteFrame = asset;
            node.width = curScene.node.width;
            node.height = curScene.node.height;
            node.opacity = 0;
            curScene.node.addChild(node);
            cc.tween(node).to(0.15,{opacity:255}).call(()=>{
                curScene.node.active = false;
                node.removeFromParent();
                newScene.node.addChild(node);
                newScene.node.active = true;
            }).to(0.15,{opacity:0}).call(()=>{
                node.removeFromParent();
                finish();
            }).start();
        });
    }
}