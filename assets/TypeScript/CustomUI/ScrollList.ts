import { Util } from "../Frame/Util";

const {ccclass,menu, property} = cc._decorator;

enum LayoutType {
    Hor,
    Ver,
    Grid
}
export class ExtraData{
    data:any = null;
    prefab:cc.Node = null;
    item:cc.Node = null;
    x = 0;
    y = 0;
    top = 0;
    bottom = 0;
    left = 0;
    right = 0;
}
@ccclass
@menu("自定义UI/ScrollList")
export default class ScrollList extends cc.ScrollView {
    public static SET_DATA = "SET_DATA";             //item节点事件：数据改变。param：新数据
    public static CONTENT_MOVE = "CONTENT_MOVE";     //item节点事件：content位置移动。param：
    public static SELECT_STATE_CHANGE = "SELECT_STATE_CHANGE";//item节点事件：选中状态改变

    public static SELECT_ITEM = "SELECT_ITEM";     //scrollList事件：选择了新的item

    @property
    private paddingLeft = 0;
    @property
    private paddingRight = 0; 
    @property
    private paddingTop = 0;
    @property
    private paddingBottom = 0; 
    @property
    private spacingX = 0; 
    @property
    private spacingY = 0; 
    @property({
        type:cc.Enum(LayoutType),
        displayName:"LayoutType",
    })
    private layoutType = LayoutType.Hor;
    @property
    private autoCenter = false;
    @property
    private emitContentMove = false;

    @property({ type:[cc.Node] })
    private prefabs:cc.Node[] = [];
    @property(cc.Mask)
    private mask:cc.Mask = null;

    private dataArr:any[] = [];
    private extraArr:ExtraData[] = [];     
    
    onLoad () {
        for(let i=0;i<this.prefabs.length;i++){
            this.prefabs[i].active = false;
        }
        this.node.on('scrolling', this.onScrolling, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    onTouchEnd(){
        if(this.autoCenter){
            let offset = this.getScrollOffset();
            if(this.layoutType == LayoutType.Ver){
                let curY = -offset.y+this.mask.node.height/2;
                let distance = 100000;
                let idx = 0;
                for(let i=0; i<this.extraArr.length; i++){
                    let extra = this.extraArr[i];
                    let temp = Math.abs(extra.y - curY);
                    if(temp < distance){
                        distance = temp;
                        idx = i;
                    }
                }
                this.centerToIdx(idx, 0.3);
            }else if(this.layoutType == LayoutType.Hor){
                let curX = -offset.x+this.mask.node.width/2;
                let distance = 100000;
                let idx = 0;
                for(let i=0; i<this.extraArr.length; i++){
                    let extra = this.extraArr[i];
                    let temp = Math.abs(extra.x - curX);
                    if(temp < distance){
                        distance = temp;
                        idx = i;
                    }
                }
                this.centerToIdx(idx, 0.3);
            }else {
                //TODO
            }
        }
    }
    onScrolling(){
        this.updateList();
    }

    //更新显示
    private lastStartIdx = -1;
    private lastEndIdx = -1;
    updateList(){
        let offset = this.getScrollOffset();
        //获取应该在显示区域内的数据
        let startIdx = -1, endIdx = -1;
        for(let i=0; i<this.extraArr.length; i++){
            let extra = this.extraArr[i];
            if(this.layoutType == LayoutType.Ver){
                if(-extra.bottom>offset.y && startIdx == -1){
                    startIdx = i;
                }
                if(-extra.top<offset.y+this.mask.node.height){
                    endIdx = i;
                }
            }else if(this.layoutType == LayoutType.Hor){
                if(extra.left>-offset.x && startIdx == -1){
                    startIdx = i-2;
                }
                if(extra.right<-offset.x+this.mask.node.width){
                    endIdx = i+1;
                }
            }else{
                if(-extra.bottom>offset.y && -extra.left>offset.x && startIdx == -1){
                    startIdx = i;
                }
                if(-extra.top<offset.y+this.mask.node.height && -extra.right<offset.x+this.mask.node.width){
                    endIdx = i;
                }
            }
        }

        if(this.lastStartIdx !== startIdx || this.lastEndIdx !== endIdx){
            //更新
            this.lastStartIdx = startIdx;
            this.lastEndIdx = endIdx;
            for(let i=0; i<this.dataArr.length; i++){
                let data = this.dataArr[i];
                let extra = this.extraArr[i];
                if(i>=startIdx && i<=endIdx){   //应该显示
                    if(!extra.item){                      //如果这个数据还没有对应的显示item
                        extra.item = this.newItem(extra.prefab);      //获取一个item显示之   
                        extra.item.x = extra.x;
                        extra.item.y = extra.y;
                        extra.item.emit(ScrollList.SET_DATA, data);
                        extra.item.emit(ScrollList.SELECT_STATE_CHANGE, i == this.curSelectIdx);
                    }
                }else{                          //不该显示
                    if(extra.item){ 
                        this.returnPool(extra.prefab, extra.item);   //放回对象池                   
                        extra.item = null;
                    }
                }
            }
        }
        //发送content移动事件
        if(this.emitContentMove){
            let centerPos = offset.sub(cc.v2(this.mask.node.width/2, this.mask.node.height/2));
            for(let i=0; i<this.extraArr.length; i++){
                let extra = this.extraArr[i];
                if(extra.item){
                    extra.item.emit(ScrollList.CONTENT_MOVE, centerPos);
                } 
            }
        }
    }

    //设置数据源
    public setDataArr(dataArr:any[]){
        this.reset();
        dataArr = dataArr || [];
        this.dataArr = dataArr;
        while(this.extraArr.length<dataArr.length){
            this.extraArr.push(new ExtraData());
        }
        let posY = this.paddingTop;
        let posX = this.paddingLeft;
        let contentH = 0;
        for(let i=0; i<dataArr.length; i++){
            let data = dataArr[i];
            let extra = this.extraArr[i];
            extra.data = data;
            //找到数据对应的prefab
            if(data !== null && data !== undefined && data["_prefabName"]){
                let _prefabName = data["_prefabName"];
                for(let j=0; j<this.prefabs.length; j++){
                    if(this.prefabs[j].name == _prefabName){
                        extra.prefab = this.prefabs[j];
                        break;
                    }
                }
            }else{
                extra.prefab = this.prefabs[0];
            }
            //计算cell占位大小
            let size = this.calculateSizeFunc(data, extra);
            //计算位置
            if(this.layoutType == LayoutType.Ver){
                extra.top = -posY;
                posY += (1-extra.prefab.anchorY) * size.h;
                extra.y = -posY;
                posY += extra.prefab.anchorY * size.h;
                extra.bottom = -posY;
                posY += this.spacingY;
            }else if(this.layoutType == LayoutType.Hor){
                extra.left = posX;
                posX += (1-extra.prefab.anchorX) * size.w;
                extra.x = posX;
                posX += extra.prefab.anchorX * size.w;
                extra.right = posX;
                posX += this.spacingX;
            }else{
                //行优先，如果当前行剩余宽度不足cell大小时，换行
                if(this.mask.node.width - posX - this.paddingRight < size.w){
                    posX = this.paddingLeft;
                    posY += size.h + this.spacingY;
                    contentH = posY + size.h + this.paddingBottom;
                }
                extra.y = -posY - (1-extra.prefab.anchorY) * size.h;
                extra.left = posX;
                posX += (1-extra.prefab.anchorX) * size.w;
                extra.x = posX;
                posX += extra.prefab.anchorX * size.w;
                extra.right = posX;
                posX += this.spacingX;
            }
        }
        if(this.layoutType == LayoutType.Ver){
            posY += this.paddingBottom;
            this.content.height = posY;
        }else if(this.layoutType == LayoutType.Hor){
            posX += this.paddingRight
            this.content.width =posX;
        }else{
            this.content.width = this.mask.node.width;
            this.content.height = contentH;
        }
        this.updateList();
    }

    getPrefabName = (data:any, extra:ExtraData)=>{

    }
    
    calculateSizeFunc = (data:any, extra:ExtraData)=>{
        return {
            w:extra.prefab.width, 
            h:extra.prefab.height
        };
    }
    canSelect = (data:any, extra:ExtraData)=>{
        return true
    }


    //重置
    public reset(){
        this.lastStartIdx = -1;
        this.lastEndIdx = -1;
        for(let i=0; i<this.extraArr.length; i++){
            let extra = this.extraArr[i];
            if(extra.item){
                this.returnPool(extra.prefab, extra.item);   //放回对象池                   
                extra.item = null;
            }
        }
    }
    //局中到
    centerToIdx(idx, timeInSecond){
        if(this.layoutType == LayoutType.Ver){
            if(idx < 0){
                this.scrollTo(cc.v2(1,1), timeInSecond);
            }else if(idx >= this.extraArr.length){
                this.scrollTo(cc.v2(0,0), timeInSecond);
            }else{
                let extra = this.extraArr[idx];
                let ratio = 1-(extra.top-this.mask.node.height/2) / (this.content.height-this.mask.node.height);
                this.scrollTo(cc.v2(0, ratio), timeInSecond);
            }
        }else if(this.layoutType == LayoutType.Hor){
            if(idx < 0){
                this.scrollTo(cc.v2(0,0), timeInSecond);
            }else if(idx >= this.extraArr.length){
                this.scrollTo(cc.v2(1,1), timeInSecond);
            }else{
                let extra = this.extraArr[idx];
                let ratio = (extra.x-this.mask.node.width/2) / (this.content.width-this.mask.node.width);
                this.scrollTo(cc.v2(ratio, 0), timeInSecond);
            }
        }else{
            //TODO
        }
    }
    getExtraData(i){
        return this.extraArr[i];
    }
    getDataArr(){
        return this.dataArr;
    }
    //对象池
    pools:Map<cc.Node, any[]> = new Map<cc.Node, any[]>();
    public newItem(prefab:cc.Node):cc.Node{
        let pool = this.pools.get(prefab) || [];
        this.pools.set(prefab, pool);

        let item:cc.Node = null;
        if(pool.length>0){
            item = pool.shift();
        }else{
            item = cc.instantiate(prefab);
            this.content.addChild(item);
            item.on("click", this.onItemTap, this);
        }
        item.active = true;

        if(this.layoutType == LayoutType.Ver){
            item.x = 0;
        }else if(this.layoutType == LayoutType.Hor){
            item.y = 0;
        }else{
            //无需归位
        }
        return item;
    }
    public returnPool(prefab, item){
        let pool = this.pools.get(prefab) || [];
        this.pools.set(prefab, pool);
        pool.push(item);
        if(this.layoutType == LayoutType.Ver){
            item.x = -100000;
        }else if(this.layoutType == LayoutType.Hor){
            item.y = -100000;
        }else{
            item.x = item.y = -100000;
        }
    }

    curSelectIdx = -1;
    onItemTap(e:cc.Event.EventTouch){
        let item = e.target;
        for(let i=0;i<this.extraArr.length;i++){
            let extra = this.extraArr[i];
            let canselect = this.canSelect(this.dataArr[i], extra);
            if(canselect){
                if(extra.item == item){
                    this.selectByIdx(i);
                    break;
                }
            }
        }
    }
    selectByIdx(idx:number){
        //重置原来的item
        if(this.curSelectIdx >= 0 && this.curSelectIdx < this.extraArr.length){
            let extra = this.extraArr[this.curSelectIdx];
            if(extra.item){
                extra.item.emit(ScrollList.SELECT_STATE_CHANGE, false);
            }
        }
        //选中新item
        this.curSelectIdx = idx;
        let extra = this.extraArr[idx];
        if(extra && extra.item){
            extra.item.emit(ScrollList.SELECT_STATE_CHANGE, true);
        }
        //发送更改选中事件
        this.node.emit(ScrollList.SELECT_ITEM, idx, this.dataArr[idx]);
    }
}
