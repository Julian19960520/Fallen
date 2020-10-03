import { tt, crossPlatform, systemInfo, AppName, wx } from "./CrossPlatform";
import Top from "./Top";
import { Util } from "./Util";
import Env from "../Game/Env";
import { TGA } from "../Game/TGA";


export namespace AdUnitId{
    export let FreeCoin = "1f2a4ppm2abh4bgeal";
    export let FreeDiamond = "1f2a4ppm2abh4bgeal";
    export let FreeEnergy = "1f2a4ppm2abh4bgeal";
    export let UnlockSkin = "1f2a4ppm2abh4bgeal";
    export let UnlockTape = "1f2a4ppm2abh4bgeal";
    export let FinishBet = "1f2a4ppm2abh4bgeal";
    export let Reborn = "1f2a4ppm2abh4bgeal";
    export let UnlockMusicRecommend = "1f2a4ppm2abh4bgeal";
    
    if(Env.isProd){
        FreeCoin = "ebg233qlm2hj0e7528";
        FreeDiamond = "ch6n00a6bac4gbe803";
        FreeEnergy = "3wnfvfk8k8d43902j2";
        UnlockSkin = "124b3d3fk568889ia4";
        UnlockTape = "1g0d4ck9h66f3b1j16";
        FinishBet = "3lha93m93dl82cd000";
        UnlockMusicRecommend = "3lha93m93dl82cd000";
    }
}

export enum VideoError{
    UserCancel,
    NoAd,
    LowSdk,
}
export namespace AD{
    export let skip = false;

    export function showVideoAd(data:{id:string, succ?, fail?}){
        //H5直接成功
        if(!tt || skip){
            data.succ && data.succ();
            return;
        }
        //版本不够失败
        if(!Util.compareSDKVersion('1.3.0')){
            data.fail && data.fail(VideoError.LowSdk);
            Top.showToast("播放广告失败");
            return;
        }
        //创建视频组件（单例）
        if(crossPlatform.createRewardedVideoAd){
            TGA.tag("showVideoAd",{
                id:data.id,
                step:"click",
            });
            Top.showToast("广告准备中...");
            Top.blockInput(true, "showVideoAd");
            let videoAd = crossPlatform.createRewardedVideoAd({adUnitId:data.id});        
            //点击关闭视频组件时回调
            let closeCall = (res)=>{
                if(res.isEnded){
                    data.succ && data.succ();
                    crossPlatform.reportAnalytics("ad",{
                        id:data.id,
                        step:"complete",
                    });
                }else{
                    console.log(res);
                    data.fail && data.fail(VideoError.UserCancel);
                }
                videoAd.offClose(closeCall);
                videoAd.offError(onError);
                Top.blockInput(false, "showVideoAd");
            }
            let onError = (err)=>{
                console.log("video onError",err);
                data.fail && data.fail(VideoError.NoAd);
                videoAd.offClose(closeCall);
                videoAd.offError(onError);
                Top.blockInput(false, "showVideoAd");
            }
            videoAd.onError(onError)
            //尝试播放
            videoAd.show().then(() => {
                    //播放成功，则增加关闭回调
                    videoAd.onClose(closeCall);
                })
                .catch(() => {
                    //播放失败，则尝试手动拉取一次
                    videoAd.load()
                        .then(() => {
                            //手动拉取成功，再尝试播放
                            videoAd.show().then(()=>{
                                //二次尝试成功
                                videoAd.onClose(closeCall);
                            })
                            .catch((err)=>{
                                //二次尝试失败
                                console.log(err);
                                data.fail && data.fail(VideoError.NoAd);
                                videoAd.offError(onError);
                            });
                        })
                        .catch((err)=>{
                            //手动拉取成功，则按照没有广告可看失败处理
                            console.log(err);
                            data.fail && data.fail(VideoError.NoAd);
                            videoAd.offError(onError);
                        });
                });
        }else{
            data.succ && data.succ();
        }
    }

    export function showBanner(id:string, style, succ, fail){
        if(tt){
            if(systemInfo.appName == AppName.Douyin){
                return;
            }
            let bannerAd = crossPlatform.createBannerAd({
                adUnitId: id,
                adIntervals:30,
                style: style
            });
            bannerAd.onResize(size => {
                // good
                bannerAd.style.top = systemInfo.windowHeight - size.height;
                bannerAd.style.left = (systemInfo.windowWidth - size.width) / 2;
            });
            let loadedCall = () => {
                bannerAd.show()
                    .then(() => {
                        console.log("广告显示成功");
                    })
                    .catch(err => {
                        console.log("广告组件出现问题", err);
                    });
                bannerAd.offLoad(loadedCall);
            }
            bannerAd.onLoad(loadedCall);
            return bannerAd;
        }else{
            return null;
        }
    }
}