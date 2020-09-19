
import { DB } from "../Frame/DataBind";
import SceneManager from "../Frame/SceneManager";
import LackDiamondPanel from "../Panel/LackDiamondPanel/LackDiamondPanel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DiamondBar extends DB.DataBindComponent {
    public static ins:DiamondBar = null;
    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Node)
    public icon: cc.Node = null;
    
    curCnt = 0;
    onLoad () {
        this.node.on("click", this.onAddBtnTap, this);
        cc.game.on("updateDiamondBar", this.updateDiamondBar, this);
    }
    onDestroy(){
        cc.game.off("updateDiamondBar", this.updateDiamondBar, this);
    }
    
    onEnable(){
        DiamondBar.ins = this;
        this.updateDiamondBar();
    }
    onDisable(){
        DiamondBar.ins = null;
    }
    updateDiamondBar(){
        let cnt = Math.max(Player.ins.diamond-Player.ins.$flyDiamond, 0);
        this.label.string = cnt.toString();
    }
    onAddBtnTap(){
        SceneManager.ins.OpenPanelByName("LackDiamondPanel",(panel:LackDiamondPanel)=>{
            panel.from = "DiamondBar";
        });
    }
}
