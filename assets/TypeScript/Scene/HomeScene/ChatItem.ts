// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import HeadIcon from "../../CustomUI/HeadIcon";
import { Util } from "../../Frame/Util";
import { ChatInfo } from "../../Game/Controller/TapeMng";

const {ccclass, property} = cc._decorator;

export class ChatData{
    headUrl:string;
    message:string;
}
@ccclass
export default class ChatItem extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(HeadIcon)
    headIcon: HeadIcon = null;

    setData(data:ChatInfo){
        this.label.string = Util.clampStr(data.msg, 20, "...");
        this.headIcon.loadUrl(data.headUrl);
    }
}
