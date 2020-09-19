// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class SyncNode extends cc.Component {

    @property(cc.Node)
    target: cc.Node = null;

    @property
    always = false;
    onLoad () {
        if(this.target){
            this.target.on(cc.Node.EventType.POSITION_CHANGED, ()=>{
                this.node.position = this.target.position;
            }, this);
            this.target.on(cc.Node.EventType.SIZE_CHANGED, ()=>{
                this.node.width = this.target.width;
                this.node.height = this.target.height;
            }, this);
            this.target.on(cc.Node.EventType.ANCHOR_CHANGED, ()=>{
                this.node.anchorX = this.target.anchorX;
                this.node.anchorY = this.target.anchorY;
            }, this);
        }
    }
    update(){
        if(this.always){
            this.sync();
        }
    }
    sync(){
        if(this.target){
            this.node.position = this.target.position;
            this.node.width = this.target.width;
            this.node.height = this.target.height;
            this.node.anchorX = this.target.anchorX;
            this.node.anchorY = this.target.anchorY;
        }
    }
}
