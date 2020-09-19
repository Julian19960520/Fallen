// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ScrollList from "../../CustomUI/ScrollList";
import { SkinConf, Config } from "../../Frame/Config";
import { Util } from "../../Frame/Util";
import Player from "../../Game/Player";
import SceneManager from "../../Frame/SceneManager";
import PaintScene from "../PaintScene/PaintScene";
import Top from "../../Frame/Top";
import PreviewPaintPanel from "../../Panel/PreviewPaintPanel/PreviewPaintPanel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkinCell extends cc.Component {
    @property(cc.Sprite)
    skinSprite: cc.Sprite = null;

    @property(cc.Node)
    lockNode: cc.Node = null;

    @property(cc.Node)
    usingNode: cc.Node = null;

    @property(cc.Node)
    normalNode: cc.Node = null;
    @property(cc.Node)
    paintNode: cc.Node = null;

    id:number = null;
    createNew = false;
    onLoad () {
        this.node.on(ScrollList.SET_DATA, this.setData, this);
        this.node.on(ScrollList.SELECT_STATE_CHANGE, this.onSelectStateChange, this);
        this.node.on("click", this.onClick, this);
    }

    async setData(id:number){
        this.id = id;
        this.createNew = id<0;
        if(this.createNew){
            this.normalNode.active = false;
            this.paintNode.active = true;
            this.node.color = cc.color(101, 239, 153);
        }else{
            this.node.color = cc.Color.WHITE;
            this.normalNode.active = true;
            this.paintNode.active = false;
            this.showUsing(id == Player.ins.skinMng.normalMouseSkinId);
            if(id<10000){
                //内置皮肤
                this.lockNode.active = Player.ins.skinMng.isSkinLock(id);
                let conf = Config.findSkinConf(id);
                Util.loadBundleRes(conf.url, cc.SpriteFrame, (sf)=>{
                    this.skinSprite.spriteFrame = sf;
                    this.skinSprite.node.x = conf.offsetX;
                    this.skinSprite.node.y = conf.offsetY;
                    this.skinSprite.node.scale = 1;
                });
            }else{
                //绘制皮肤
                this.lockNode.active = false;
                let data = await Player.ins.paintMng.requestPaintSkinData(id);
                let texture = await Player.ins.paintMng.getTexture(data);
                let sf = new cc.SpriteFrame(texture);
                this.skinSprite.spriteFrame = sf;
                this.skinSprite.node.x = 0;
                this.skinSprite.node.y = -40;
                this.skinSprite.node.scale = 0.5;
            }
        }
    }

    onSelectStateChange(b){
        if(!this.createNew){
            this.node.color = b ? cc.color(152, 216, 255): cc.Color.WHITE;
        }
    }
    showUsing(b){
        this.usingNode.active = b;
    }
    async onClick(){
        if(this.createNew){
            let ids:number[] = await Player.ins.paintMng.requestPaintSkinIds();
            if(ids.length>=5){
                Top.showToast("最多画5个");
            }else{
                SceneManager.ins.Enter("PaintScene", (scene:PaintScene)=>{
                    scene.completeCall = async (pixels:Uint8Array)=>{
                        SceneManager.ins.OpenPanelByName("PreviewPaintPanel", (panel:PreviewPaintPanel)=>{
                            let texture = Util.screenShotToTexture(scene.node);
                            panel.setData(pixels, texture);
                            panel.saveCall = async (id)=>{
                                Player.ins.skinMng.normalMouseSkinId = id;
                                SceneManager.ins.Back();
                            }
                        });
                    }
                });
            }
        }
    }
}
