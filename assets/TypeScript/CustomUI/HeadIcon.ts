import { Util } from "../Frame/Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HeadIcon extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    oriSf:cc.SpriteFrame = null;
    onLoad(){
        this.oriSf = this.sprite.spriteFrame;
    }
    
    getOriSf(){
        if(!this.oriSf){
            this.oriSf = this.sprite.spriteFrame;
        }
        return this.oriSf;
    }
    loadUrl(url:string){
        if(url){
            if(url.startsWith("http")){
                cc.loader.load({url:url+'?file=a.png', type:'png'},(err, tex)=>{
                    if(err){
                        this.sprite.spriteFrame = this.oriSf;
                    }else{
                        this.sprite.spriteFrame = new cc.SpriteFrame(tex)
                    }
                });
            }else{
                Util.loadBundleRes(url, cc.SpriteFrame, (sf)=>{
                    this.sprite.spriteFrame = sf;
                });
            }
        }else{
            this.sprite.spriteFrame = this.getOriSf();
        }
    }
}
