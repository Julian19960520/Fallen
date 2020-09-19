
import { crossPlatform } from "./CrossPlatform";
export enum ShareType{
    default = "default",
    help = "sendHelp",
    anwser = "anwser",
    shareForCoin = "share_for_coin",
    daily = "share_for_coin",               //后台分享方案太多了,与shareForCoin相同
    luckBox = "luckybox_ingame",             //后台分享方案太多了,与shareForCoin相同
    extraEnergyReward = "lvlReward",        //收集星星再得体力
    shareForEnergy = "share_for_energy",
    timeline = "timeline",
}

export class ShareData{
    shareType?:	string;
    title?:	string;
    titleParams?:	object;
    imageUrl?:	string;
    imageUrlId?:	string;
    query?:	string;
    activityId?:	string;
    templateInfo?:	object;
    success?:(res)=>void;
    fail?:(res)=>void;
    complete?:(res)=>void;
    showFailModal?:boolean;
}

export namespace Share{
    export let shareing = false;
    export let skip = false;
    let lastShareType = "";
    let failCnt = 0;

    export function shareMessage(data:ShareData){
        shareing = true;
        let oriSuccess = data.success;
        let oriFail = data.fail;
        
        let doSucc = (res)=>{
            if(oriSuccess) oriSuccess(res);
        }
        let doFail = (res)=>{
            if(data.showFailModal){
                showFailModal(()=>{
                    //去分享
                    doSucc(res);
                },()=>{
                    //取消
                    if(oriFail) oriFail(res);
                    setTimeout(() => {
                        shareing = false;
                    }, 500);
                });
            }else{
                if(oriFail) oriFail(res);
                setTimeout(() => {
                    shareing = false;
                }, 500);
            }
        }
        if(skip){
            doSucc(skip);
        }
        data.success = (res)=>{
            setTimeout(() => {
                shareing = false;
            }, 500);
            shareing = false;
            //超过2秒，模拟成功回调
            if(Math.random()>0.3){
                //大概率成功
                doSucc(res);
                failCnt = 0;
            }else{
                //小概率失败
                doFail(res);
                failCnt++;
            }
            lastShareType = data.shareType;
        }
        data.fail = (res)=>{
            //不足两秒，模拟失败，失败计数
            if(data.shareType == lastShareType){
                failCnt ++;
            }else{
                failCnt = 1;
            }
            //如果超过3次，则成功
            if(failCnt > 3){
                doSucc(res);
                failCnt = 0;
            }else{
                doFail(res);
            }
            lastShareType = data.shareType;
        }
        doSucc({});
    }

    export function showFailModal(onConfirm, onCancel){
        if(crossPlatform){
            crossPlatform.showModal({
                title:"提示",
                content:"分享失败，请尝试不同群",
                showCancel:true,
                cancelText:"取消",
                confirmText:"去分享",
                success:(res)=>{
                    if (res.confirm) {
                        onConfirm();
                    }else {
                        onCancel();
                    }
                },
                fail:()=>{
                    onCancel();
                },
            });
        }else{
            onConfirm();
        }
    }
}