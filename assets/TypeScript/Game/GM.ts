import { crossPlatform } from "../Frame/CrossPlatform";
import { Util } from "../Frame/Util";
import { AD } from "../Frame/AD";
import { Vibrate } from "../Frame/Vibrate";
import { Sound } from "../Frame/Sound";
import Music from "../Frame/Music";
import SceneManager from "../Frame/SceneManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GM extends cc.Component {
    @property(cc.Button)
    openBtn: cc.Button = null;
    @property(cc.Button)
    closeBtn: cc.Button = null;
    @property(cc.Node)
    buttonPrefab: cc.Node = null;
    @property(cc.Node)
    panel: cc.Node = null;
    @property(cc.Node)
    content: cc.Node = null;
    
    onLoad() {
        this.openBtn.node.on("click", () => {
            this.panel.active = !this.panel.active;
        }, this);
        this.closeBtn.node.on("click", () => {
            this.closePanel();
        }, this);
        this.buttonPrefab.active = false;
        this.closePanel();
        this.initBtn();
    }

    initBtn(){
        this.addBtn("清空缓存", () => {
            crossPlatform.clearStorageSync();
            crossPlatform.exitMiniProgram();
        });
        this.addBtn("大退", () => {
            crossPlatform.exitMiniProgram();
        });
        this.addBtn("跳过广告", () => {
            AD.skip = !AD.skip;
        },()=>{
            return AD.skip?"跳过广告":"正常广告"
        });
        this.addBtn("震动〇", () => {
            Vibrate.enable = !Vibrate.enable;
        },()=>{
            return Vibrate.enable?"震动〇":"震动X"
        });
        this.addBtn("音效", () => {
            Util.showKeyBoard( (Sound.volume*100).toString(), (res)=>{
                let num = Number.parseInt(res);
                Sound.volume = num/100;
            })
        });
        this.addBtn("音乐", () => {
            Util.showKeyBoard( (Music.volume*100).toString(), (res)=>{
                let num = Number.parseInt(res);
                Music.volume = num/100;

            })
        });
    }

    closePanel(){
        this.panel.active = false;
    }

    addBtn(name, func, updateLabelFunc = null) {
        let node = cc.instantiate(this.buttonPrefab);
        node.active = true;
        node.on("click", func, this);

        let label = node.getComponentInChildren(cc.Label);
        if(updateLabelFunc){
            label.string = updateLabelFunc();
            node.on("click", ()=>{
                label.string = updateLabelFunc();
            }, this);  
        }else{
            label.string = name;
        }
        
        this.content.addChild(node);
        return node;
    }
}
