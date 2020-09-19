const {ccclass, menu, property} = cc._decorator;

if (cc.Toggle) {//升级引擎适配代码
    cc.Toggle["_triggerEventInScript_isChecked"] = true;
}

@ccclass
@menu("自定义UI/Toggle")
export default class Toggle extends cc.Toggle {
    public static STATE_CHANGE:"STATE_CHANGE";
    onLoad(){
        let evtHandler = new cc.Component.EventHandler();
        evtHandler.target = this.node;
        evtHandler.handler = "_stateChange"
        evtHandler.component = "Toggle";
        this.checkEvents = [evtHandler];
        this.node.emit(Toggle.STATE_CHANGE, this.isChecked, false);
    }
    _stateChange(toggle){
        this.node.emit(Toggle.STATE_CHANGE, this.isChecked, true);
    }
}
