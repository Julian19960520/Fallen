// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Pool extends cc.Component {
    public static PUT = "PUT";
    @property(cc.Node)
    prefab: cc.Node = null;

    nodePool = new cc.NodePool();

    onLoad(){
        this.prefab.active = false;
    }
    get(){
        let ret:cc.Node = null;
        if(this.nodePool.size()>0){
            ret = this.nodePool.get();
        }else{
            ret = cc.instantiate(this.prefab);
            ret.on(Pool.PUT, ()=>{
                this.put(ret);
            });
        }
        ret.active = true;
        return ret;
    }

    put(node:cc.Node){
        this.nodePool.put(node);
    }
}
