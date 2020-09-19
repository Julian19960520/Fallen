// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ScrollList from "../../CustomUI/ScrollList";
import Button from "../../CustomUI/Button";
import { Util } from "../../Frame/Util";
import { Config, HeroConf } from "../../Frame/Config";

import { DB } from "../../Frame/DataBind";
import { Sound } from "../../Frame/Sound";
import Music from "../../Frame/Music";
import { Player } from "../../Game/Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HeroSelecter extends DB.DataBindComponent {
    public static SELECT_CHANGE = "SELECT_CHANGE";

    @property(ScrollList)
    scrollList : ScrollList = null;
    
    @property(Button)
    leftBtn:Button = null;
    @property(Button)
    rightBtn:Button = null;
    
    dataArr:HeroConf[] = [];
    
    onLoad () {
        this.scrollList.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.scrollList.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.leftBtn.node.on("click", this.onLeftBtnTap, this);
        this.rightBtn.node.on("click", this.onRightBtnTap, this);
    }

    start(){
        this.scheduleOnce(()=>{
            let dataArr = Config.heros.concat();
            dataArr.push(null);
            dataArr.unshift(null);
            this.initScrollList(dataArr);
        });
    }

    initScrollList(dataArr:HeroConf[]){
        Util.updateAllLayout(this.scrollList.node);
        Util.updateAllWidget(this.scrollList.node);
        this.scrollList.setDataArr(dataArr);
        this.dataArr = dataArr;
        let idx = this.findCurIdx();
        this.scrollList.centerToIdx(idx, 0.3);
    }
    
    onTouchEnd(e:cc.Event.EventTouch){
        let startX = e.getStartLocation().x;
        let endX = e.getLocation().x;
        let idx = this.findCurIdx();
        if(endX-startX>100 && idx>1){
            this.onLeftBtnTap();
        }else if(endX-startX < -100 && idx<this.dataArr.length-2){
            this.onRightBtnTap();
        }else{
            this.scrollList.centerToIdx(idx, 0.3);
        }
    }
    onLeftBtnTap(){
        Sound.play("shift");
        let idx = this.findCurIdx();
        if(idx>1){
            idx--;
            Player.heroMng.curHeroId = this.dataArr[idx].id;
            this.scrollList.centerToIdx(idx, 0.3);
        }
    }
    onRightBtnTap(){
        Sound.play("shift");
        let idx = this.findCurIdx();
        if(idx<this.dataArr.length-2){
            idx++;
            Player.heroMng.curHeroId = this.dataArr[idx].id;
            this.scrollList.centerToIdx(idx, 0.3);
        }
    }
    
    findCurIdx(){
        let idx = this.dataArr.findIndex((data)=>{
            if(!data){
                return false;
            }
            return data.id == Player.heroMng.curHeroId;
        });
        idx = Util.clamp(idx, 0, this.dataArr.length-1);
        return idx;
    }
    
    updateBtn(){

    }
}
