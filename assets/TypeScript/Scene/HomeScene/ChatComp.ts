import ChatItem, { ChatData } from "./ChatItem";
import Pool from "../../Frame/Pool";
import { TweenUtil } from "../../Frame/TweenUtil";
import { Util } from "../../Frame/Util";
import { ChatInfo } from "../../Game/Controller/TapeMng";

const {ccclass, property} = cc._decorator;


@ccclass
export default class ChatComp extends cc.Component {

    @property
    max = 3;
    @property(Pool)
    chatItemPool: Pool = null;

    chatItems:ChatItem[] = [];

    infos:ChatInfo[] = [];
    idx = 0;
    timer = 0;

    setData(infos:ChatInfo[]){
        this.infos = infos; 
        this.idx = 0;
    }

    update(dt){
        if(this.idx < this.infos.length){
            this.timer+=dt;
            if(this.timer > 2){
                if(this.idx<this.infos.length){
                    this.push(this.infos[this.idx]);
                }
                this.timer = 0;
                this.idx++;
            }
        }
    }

    push(chatData:ChatInfo){
        if(!chatData){
            return;
        }
        let node = this.chatItemPool.get();
        this.node.addChild(node);
        node.position = cc.Vec2.ZERO;
        Util.updateAllLayout(node);
        let item = node.getComponent(ChatItem);
        item.setData(chatData);
        this.chatItems.push(item);
        TweenUtil.fadeIn(node);
        for(let i=0; i<this.chatItems.length; i++){
            let item = this.chatItems[i];
            cc.tween(item.node).to(0.3, {y:item.node.y+50}).start();
        }
        if(this.chatItems.length > this.max){
            let last = this.chatItems.shift();
            TweenUtil.fadeOut(last.node, 0.3, ()=>{
                last.node.emit(Pool.PUT);
            });
        }
    }
}
