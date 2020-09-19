// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { Util } from "../Frame/Util";
import ScreenRect from "../Frame/ScreenRect";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Env extends cc.Component {

    static gm = true;
    static isProd = true;
    static version = "0.0.2";
    onLoad () {
        if(Env.gm){
            Util.loadBundleRes("Prefab/GM", (asset)=>{
                let gm = cc.instantiate(asset);
                ScreenRect.Ins.node.addChild(gm);
            });
        }
    }
}
