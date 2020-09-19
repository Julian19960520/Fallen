
import { crossPlatform, wx, tt, GameRecorderShareButton, systemInfo } from "./CrossPlatform";
import { Util } from "./Util";
import Top from "./Top";

export namespace GameRecorder {    
    let videoPath = "";
    export let disableGameRecorder = false;
    export let recordering = false;
    export let startStamp = 0;
    export let videoDuration = 0;
    let inited = false;
    function Init(){
        if(inited)return;
        inited = true;
        if(tt){
            tt.getGameRecorderManager().onStop(res => {
                videoPath = res.videoPath;
            });
            tt.getGameRecorderManager().onStart(res => {
                
            });
        }
    }
    //开始录屏
    export function start(duration = 300){
        console.log("GameRecorder.start");
        Init();
        if(wx && isSdkOk()){
            console.log("GameRecorder.wxstart");
            wx.getGameRecorder().start({duration:duration, hookBgm:false}); 
        }
        if(tt){
            tt.getGameRecorderManager().start({duration:duration});  
        }
        videoDuration = 0;
        startStamp = Util.getTimeStamp(); 
        recordering = true;
    }
    //结束录屏
    export function stop(){
        console.log("GameRecorder.stop");
        if(wx && isSdkOk()){
            if(recordering){
                console.log("GameRecorder.stop");
                wx.getGameRecorder().stop();
            }
        }
        if(tt){
            if(recordering){
                console.log("GameRecorder.stop");
                tt.getGameRecorderManager().stop();  
            }
        }
        recordering = false;  
        videoDuration = Util.getTimeStamp() - startStamp;
    }

    export function hasVideo(){
        return videoDuration > 4000;
    }
    //创建分享按钮
    let wxShareBtn:GameRecorderShareButton = null;
    let myShareBtnNode:cc.Node = null;
    export function createGameRecorderShareButton(obj:{parentNode:cc.Node,textures:any[],onSucc?,onFail?}){
        if(wx && isSdkOk()){
            setTimeout(() => {
                let style = Util.convertToWindowSpace(obj.parentNode);
                wxShareBtn = wx.createGameRecorderShareButton({
                    text:"",
                    icon:"packRes/transparent.png",
                    image:"packRes/GameRecorderShareButton.jpg",
                    style:{
                        top:style.top,
                        left:style.left,
                        height:50,
                        paddingRight:160,
                    },
                    share:{
                        query:"",
                        title:{
                            template:"default.score",
                            data:{score:1},
                        },
                        bgm:"",
                        timeRange:[[0,60*1000]],
                    }
                });
                wxShareBtn.show();
            }, 500);
        }
        if(tt){
            Util.loadBundleRes("Prefab/GameRecorderShareButton", (asset)=>{
                let node = cc.instantiate(asset);
                node.on("click", ()=>{
                    tt.shareAppMessage({
                        title: "成语连连看", 
                        channel:"video",
                        extra:{
                            videoPath:videoPath,
                            videoTopics:["成语连连看"],
                            hashtag_list:["节奏打地鼠"],
                            withVideoId: true,
                        },
                        success:()=>{
                            let rewardTip = Util.searchChild(node, "rewardTip");
                            if(rewardTip.active){
                                node.dispatchEvent(Util.customEvent("gainDiamond",true,{cnt:2}));
                                rewardTip.active = false;
                            }
                            if(obj.onSucc)obj.onSucc();
                        },
                        fail:obj.onFail,
                    });
                }, node);
                if(obj.textures && obj.textures.length>0){
                    let i = 0;
                    let screenImg = Util.searchChild(node, "screenImg").getComponent(cc.Sprite);
                    node.runAction(cc.repeatForever(
                        cc.sequence(
                            cc.callFunc(()=>{
                                i++;
                                screenImg.spriteFrame = new cc.SpriteFrame(obj.textures[i%obj.textures.length]);
                            }),
                            cc.delayTime(0.5)
                        )
                    ));
                    node.runAction(cc.repeatForever(
                        cc.sequence(
                            cc.scaleTo(0.5, 1.05, 1.05),
                            cc.scaleTo(0.5, 1, 1),
                        )
                    ));
                }
                obj.parentNode.addChild(node);
                myShareBtnNode = node;
            });
        }
    }
    export function share(succ, fail){
        Top.showToast("分享录屏准备中");
        Top.blockInput(true, "GameRecorder.share");
        crossPlatform.shareAppMessage({
            title: "节奏打地鼠", 
            channel:"video",
            extra:{
                videoPath:videoPath,
                videoTopics:["节奏打地鼠"],
                hashtag_list:["节奏打地鼠"],
                withVideoId: true,
            },
            success:(res)=>{
                Top.blockInput(false, "GameRecorder.share");
                succ && succ(res);
            },
            fail:(res)=>{
                Top.blockInput(false, "GameRecorder.share");
                fail && fail(res);
            },
        });
    }
    //隐藏分享视频按钮
    export function clearGameRecorderShareButton(){
        if(wxShareBtn){
            wxShareBtn.hide();
        }
        if(myShareBtnNode){
            myShareBtnNode.destroy();
        }
    }
    export function clearVideo(){
        videoDuration = 0;
        videoPath = "";
        videoDuration = 0;
        if(wx){

        }
    }

    let _isSdkOk = undefined;
    export function isSdkOk(){
        return false;
        if(_isSdkOk === undefined){
            _isSdkOk = Util.compareSDKVersion("2.8.0") 
            && !systemInfo.model.startsWith("iPhone 11") 
            && !systemInfo.model.startsWith("iPhone 6s") 
            && !disableGameRecorder;
        }
        console.log("_isSdkOk", _isSdkOk);
        return _isSdkOk;
    }
}
