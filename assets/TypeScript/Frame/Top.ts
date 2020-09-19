import { Util } from "./Util";
import ScreenRect from "./ScreenRect";
import { DB } from "./DataBind";
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
@ccclass
export default class Top extends DB.DataBindComponent {
    static ins:Top = null;
    static node:cc.Node = null;
    private block:cc.BlockInputEvents = null;

    @property(cc.Node)
    private toastPrefab:cc.Node = null;
    onLoad(){
        Top.ins = this;
        Top.node = this.node;
        this.toastPrefab.active = false;
        this.block = this.getComponent(cc.BlockInputEvents);
        Top.blockInput(false);
    }
    static blockKeys = [];
    public static blockInput(b = true, key = "normal"){
        let idx = this.blockKeys.indexOf(key);
        if(b && idx<0){
            this.blockKeys.push(key);
        }else if(!b && idx>=0){
            this.blockKeys.splice(idx, 1);
        }
        Top.ins.block.enabled = this.blockKeys.length != 0;
    }
        
    public static isBlocking(){
        return Top.ins.block.enabled;
    }
    public static tempBlockInput(time){
        this.blockInput(true);
        Top.ins.scheduleOnce(()=>{
            this.blockInput(false);
        },time)
    }
    public static showToast(text:string){
        let toast = cc.instantiate(this.ins.toastPrefab);
        toast.active = true;
        toast.getComponentInChildren(cc.Label).string = text;
        Top.ins.node.addChild(toast);
        toast.opacity = 0;
        toast.y = -20;
        cc.tween(toast)
            .to(0.1, {opacity:255,y:0} )
            .delay(1.5)
            .to(0.1, {opacity:0,y:20} )
            .call(()=>{
                Top.ins.node.removeChild(toast);
            }
        ).start();
    }
    public static showFloatLabel(string , parent:cc.Node, style:{
            offset?, 
            color?,
            stroke?,
            strokeColor?,
            fontSize?,
            duration?,
        }){
        let pos:any = parent.convertToWorldSpaceAR(style.offset || cc.Vec2.ZERO);
        pos = parent.convertToNodeSpaceAR(pos);
        let node = new cc.Node();
        let label = node.addComponent(cc.Label);
        parent.addChild(node);
        node.position = pos;
        label.string = string;
        label.fontSize = style.fontSize || 25;
        label.node.color = style.color || cc.Color.BLACK;
        if(style.stroke){
            let outLine = node.addComponent(cc.LabelOutline);
            outLine.color = style.strokeColor || cc.Color.BLACK;
            outLine.width = style.stroke;
        }
        cc.tween(node)
            .to(0.1, {y:node.y+5} )
            .delay(style.duration || 1.5)
            .to(0.1, {y:node.y+20, opacity:0} )
            .call(()=>{
                node.removeFromParent();
            }
        ).start();
        return label;
    }
    public static bezierSprite(data:{url?:string, spriteFrame?:cc.SpriteFrame, from:cc.Vec2, to:cc.Vec2, onBegin?, onEnd?, cnt?:number, time?:number, deltaT?:number, fromScale?:number, toScale?:number,color?:cc.Color}){
        data.cnt = data.cnt || 1;
        data.time = data.time || 1;
        data.fromScale = data.fromScale || 1;
        data.toScale = data.toScale || 1;
        data.deltaT = data.deltaT || 0.05;
        data.color = data.color || cc.Color.WHITE;
        let firstNode = new cc.Node();
        let func = (sf)=>{
            for(let i=0; i<data.cnt; i++){
                setTimeout(() => {
                    let node:cc.Node = null;
                    if(firstNode){
                        node = firstNode;
                        firstNode = null;
                    }else{
                        node = new cc.Node();
                    }
                    node.scale = data.fromScale;
                    Top.ins.node.addChild(node);
                    let sprite = node.addComponent(cc.Sprite);
                    sprite.spriteFrame = sf;
                    let range = 200;
                    let ctrlPos = data.from.add(cc.v2(Util.randomInt(-range,range), Util.randomInt(-range,range)));
                    node.position = data.from;
                    node.color = data.color;
                    if(data.onBegin){
                        data.onBegin(i==data.cnt-1)
                    }
                    node.runAction(
                        cc.spawn(
                            cc.sequence(
                                cc.bezierTo(data.time, [data.from, ctrlPos, data.to]), 
                                cc.callFunc(()=>{
                                    node.removeFromParent();
                                    if(data.onEnd){
                                        data.onEnd(i==data.cnt-1)
                                    }
    
                                })
                            ),
                            cc.scaleTo(data.time, data.toScale)
                        )
                    );
                }, i*data.deltaT*1000);                
            }
        }
        if(data.url){
            Util.loadBundleRes(data.url, cc.SpriteFrame,(sf)=>{
                func(sf);
            });
        }else if(data.spriteFrame){
            func(data.spriteFrame);
        }else{
            throw Error("bezierSprite参数中，url和spriteFrame不能同时为空");
        }
        return firstNode;
    }
    //将节点从原父节点摘离，放到Top.node下，飞到targetNode上
    public static bezierNode(data:{node:cc.Node, targetNode:cc.Node,parentNode?:cc.Node, time?:number, dCtrlPos?:cc.Vec2,targetScale?:number, onBegin?, onEnd?}){
        data.time = data.time || 1;
        data.targetScale = data.targetScale || data.node.scale;
        data.parentNode = data.parentNode || Top.node;
        let node = data.node;
        if(node.parent){
            let pos = Util.convertPosition(node, data.parentNode);
            node.removeFromParent();
            data.parentNode.addChild(node);
            node.position = pos;
        }else{
            data.parentNode.addChild(node);
        }
        let fromPos = node.position;
        
        let ctrlPos:cc.Vec2 = null;
        if(data.dCtrlPos){
            ctrlPos = fromPos.add(data.dCtrlPos);
        }else{
            let range = 200;
            ctrlPos = fromPos.add(cc.v2(Util.randomInt(-range,range), Util.randomInt(-range,range)));
        }
        if(data.onBegin){
            data.onBegin()
        }
        let targetPos = Util.convertPosition(data.targetNode, Top.node);
        node.runAction(
            cc.sequence(
                cc.spawn(
                    cc.bezierTo(data.time, [fromPos, ctrlPos, targetPos]), 
                    cc.scaleTo(data.time, data.targetScale)
                ),
                cc.callFunc(()=>{
                    node.removeFromParent();
                    if(data.onEnd){
                        data.onEnd()
                    }
                })
            )
        );
        return node;
    }
}
