import Scene from "../../Frame/Scene";
import SceneManager from "../../Frame/SceneManager";
import { crossPlatform } from "../../Frame/CrossPlatform";
import Top from "../../Frame/Top";
import { Player } from "../../Game/Player";
const {ccclass, menu} = cc._decorator;

@ccclass
@menu('场景/LoginScene') 
export default class LoginScene extends Scene {

    start () {
        this.login();
    }
    async login(){
        await Player.loadLocal();
        Player.init();
        SceneManager.ins.Enter("HomeScene");
    }
}
