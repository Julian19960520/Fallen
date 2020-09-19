import Scene from "../../Frame/Scene";
import Button from "../../CustomUI/Button";
import SceneManager from "../../Frame/SceneManager";
import ScrollList from "../../CustomUI/ScrollList";
import { Config } from "../../Frame/Config";
import SkinCell from "./SkinCell";
import Top from "../../Frame/Top";
import { AD, AdUnitId } from "../../Frame/AD";
import { Util } from "../../Frame/Util";
import LackDiamondPanel from "../../Panel/LackDiamondPanel/LackDiamondPanel";
import LackCoinPanel from "../../Panel/LackCoinPanel/LackCoinPanel";
import { TGA } from "../../TGA";
import MessageBox from "../../Frame/MessageBox";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkinScene extends Scene {

    @property(Button)
    backBtn: Button = null;
    @property(ScrollList)
    scrollList: ScrollList = null;
    @property(Button)
    buyBtn: Button = null;
    @property(Button)
    useBtn: Button = null;
    @property(Button)
    deleteBtn: Button = null;
    @property(cc.Node)
    usingLabel: cc.Node = null;
    
    curIdx:number = -1;
    curId:number = -1;
    dataArr:any[] = [];
    onLoad () {
        this.backBtn.node.on("click", this.onBackBtnTap, this);
        this.buyBtn.node.on("click", this.onBuyBtnTap, this);
        this.useBtn.node.on("click", this.onUseBtnTap, this);
        this.deleteBtn.node.on("click", this.onDeleteBtnTap, this);
        this.scrollList.node.on(ScrollList.SELECT_ITEM, this.onSelectItem, this);
        this.scrollList.canSelect = (id, extra)=>{
            return id>=0;
        }
    }
    start(){
        TGA.tag("SkinScene",{
            sub:"show",
        });
        this.refrash();
    }
    async refrash(){
        // this.deleteBtn.node.active = false;
        // this.buyBtn.node.active = false;
        // this.useBtn.node.active = false;
        // let idArr:any[] = await Player.ins.paintMng.requestPaintSkinIds();
        // idArr = idArr.concat();
        // for(let i=0;i<Config.normalMouseSkins.length;i++){
        //     idArr.push(Config.normalMouseSkins[i].id);
        // }
        // idArr.unshift(-1);
        // this.dataArr = idArr;
        // this.scrollList.setDataArr(idArr);
        // let idx = idArr.findIndex((id)=>{
        //     return id == Player.ins.skinMng.normalMouseSkinId;
        // });
        // this.scrollList.selectByIdx(idx);
    }

    onSelectItem(idx, id){
        // this.curIdx = idx;
        // this.curId = id;
        // this.normalMouse.beginBeat(null);
        // this.normalMouse.setSkin(id);
        // let lock = Player.ins.skinMng.isSkinLock(id) && id<10000;
        // this.deleteBtn.node.active = id>=10000;
        // this.useBtn.node.active = !lock && id != Player.ins.skinMng.normalMouseSkinId;
        // this.usingLabel.active = id == Player.ins.skinMng.normalMouseSkinId;
        // this.buyBtn.node.active = lock;
        // this.updateCostView();
    }
    onBackBtnTap(){
        SceneManager.ins.Back();
    }
    onBuyBtnTap(){
        // let conf = Config.findSkinConf(this.curId);
        // if(conf){
        //     TGA.tag("SkinScene",{
        //         skinId:this.curId,
        //         unlockType:conf.unlockType,
        //         unlockCnt:conf.unlockCnt,
        //         sub:"clickBuy",
        //     });
        //     let updateView = ()=>{
        //         if(this.curIdx>=0){
        //             let extra = this.scrollList.getExtraData(this.curIdx);
        //             if(extra.item){
        //                 let skinCell = extra.item.getComponent(SkinCell);
        //                 skinCell.setData(skinCell.id);
        //             }
        //         }
        //         this.onSelectItem(this.curIdx, conf);
        //     }
        //     if(conf.unlockType == "coin"){
        //         if(Player.ins.coin >= conf.unlockCnt){
        //             TGA.tag("SkinScene",{
        //                 skinId:conf.id,
        //                 unlockType:conf.unlockType,
        //                 unlockCnt:conf.unlockCnt,
        //                 sub:"buySucc",
        //             });
        //             Player.ins.useCoin(conf.unlockCnt);
            //         Player.ins.skinMng.unlockSkin(conf.id);
            //         Player.ins.save();
            //         SceneManager.ins.OpenPanelByName("GainSkinPanel",(panel:GainSkinPanel)=>{
            //             panel.setData(conf.id, updateView);
            //         });
            //     }else{
            //         SceneManager.ins.OpenPanelByName("LackCoinPanel",(panel:LackCoinPanel)=>{
            //             panel.from = "SkinScene";
            //         });    
            //     }
            // }
            // else if(conf.unlockType == "diamond"){
            //     if(Player.ins.diamond >= conf.unlockCnt){
            //         TGA.tag("SkinScene",{
            //             skinId:conf.id,
            //             unlockType:conf.unlockType,
            //             unlockCnt:conf.unlockCnt,
            //             sub:"buySucc",
            //         });
            //         Player.ins.useDiamond(conf.unlockCnt);
            //         Player.ins.skinMng.unlockSkin(conf.id);
            //         Player.ins.save();
            //         SceneManager.ins.OpenPanelByName("GainSkinPanel",(panel:GainSkinPanel)=>{
            //             panel.setData(conf.id, updateView);
            //         });
            //     }else{
            //         SceneManager.ins.OpenPanelByName("LackDiamondPanel",(panel:LackDiamondPanel)=>{
            //             panel.from = "SkinScene";
            //         });     
            //     }
            // }
            // else if(conf.unlockType == "ad"){
            //     AD.showVideoAd({
            //         id:AdUnitId.UnlockSkin,
            //         succ:()=>{
            //             TGA.tag("SkinScene",{
            //                 skinId:conf.id,
            //                 unlockType:conf.unlockType,
            //                 unlockCnt:conf.unlockCnt,
            //                 sub:"buySucc",
            //             });
            //             Player.ins.skinMng.unlockSkin(conf.id);
            //             Player.ins.save();
            //             SceneManager.ins.OpenPanelByName("GainSkinPanel",(panel:GainSkinPanel)=>{
            //                 panel.setData(conf.id, updateView);
            //             });
            //         },
            //         fail:()=>{
            //             Top.showToast("广告播放失败");
            //         }
            //     })
            // }
        // }
    }
    onUseBtnTap(){
        //隐藏原来的Using
        // let oldIdx = this.dataArr.findIndex((id)=>{
        //     return id == Player.ins.skinMng.normalMouseSkinId;
        // });
        // if(oldIdx>=0){
        //     let extra = this.scrollList.getExtraData(oldIdx);
        //     if(extra.item){
        //         let skinCell = extra.item.getComponent(SkinCell);
        //         skinCell.showUsing(false);
        //     }
        // }
        // //显示现在的
        // Player.ins.skinMng.normalMouseSkinId = this.curId;
        // let newIdx = this.dataArr.findIndex((id)=>{
        //     return id == Player.ins.skinMng.normalMouseSkinId;
        // });
        // if(newIdx>=0){
        //     let extra = this.scrollList.getExtraData(newIdx);
        //     if(extra.item){
        //         let skinCell = extra.item.getComponent(SkinCell);
        //         skinCell.showUsing(true);
        //     }
        // }
        // this.useBtn.node.active = false;
        // this.usingLabel.active = true;

        // Player.ins.save();
    }
    async onDeleteBtnTap(){
        // if(this.curId>=10000){
        //     SceneManager.ins.OpenPanelByName("MessageBox", (panel:MessageBox)=>{
        //         panel.label.string = "是否删除？";
        //         panel.setLeftStyle({text:"删除", color:cc.color(241,138,165), call:async ()=>{
        //             if(this.curId == Player.ins.skinMng.normalMouseSkinId){
        //                 Player.ins.skinMng.normalMouseSkinId = 1;
        //             }
        //             await Player.ins.paintMng.deleteSkin(this.curId);
        //             await this.refrash();
        //         }});
        //         panel.setRightStyle({text:"取消", color:cc.color(101,203,239)});
        //     });
        // }
    }
    updateCostView(){
        // let conf = Config.findSkinConf(this.curId);
        // if(conf){
        //     let coin = Util.searchChild(this.buyBtn.node, "coin");
        //     let diamond = Util.searchChild(this.buyBtn.node, "diamond");
        //     let ad = Util.searchChild(this.buyBtn.node, "ad");
        //     coin.active = conf.unlockType == "coin";
        //     diamond.active = conf.unlockType == "diamond";
        //     ad.active = conf.unlockType == "ad";
        //     if(conf.unlockType == "coin"){
        //         coin.getComponentInChildren(cc.Label).string = conf.unlockCnt+"";
        //     }
        //     if(conf.unlockType == "diamond"){
        //         diamond.getComponentInChildren(cc.Label).string = conf.unlockCnt+"";
        //     }
            
        // }
    }
}
