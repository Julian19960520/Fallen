
import { DB } from "../Frame/DataBind";
import SceneManager from "../Frame/SceneManager";
import LackCoinPanel from "../Panel/LackCoinPanel/LackCoinPanel";
import { Player } from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CoinBar extends DB.DataBindComponent {
    public static ins:CoinBar = null;

    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Node)
    public icon: cc.Node = null;

    curCnt = 0;
    onLoad () {
        this.node.on("click", this.onAddBtnTap, this);
        cc.game.on("updateCoinBar", this.updateCoinBar, this);
    }
    onDestroy(){
        cc.game.off("updateCoinBar", this.updateCoinBar, this);
    }
    updateCoinBar(){
        let cnt = Math.max(Player.coinMng.coin-Player.coinMng.flyingCoin, 0);
        this.label.string = cnt.toString();
    }
    onEnable(){
        CoinBar.ins = this;
        this.updateCoinBar();
    }
    onDisable(){
        CoinBar.ins = null;
    }
    onAddBtnTap(){
        SceneManager.ins.OpenPanelByName("LackCoinPanel",(panel:LackCoinPanel)=>{
            panel.from = "Coinbar";
        });
    }
}
