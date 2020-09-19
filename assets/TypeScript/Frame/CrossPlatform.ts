export class VideoAd{
    show(){
        return new Promise((resolve, reject)=>{
            resolve();
        })
    };
    load(){
        return new Promise((resolve, reject)=>{
            resolve();
        })
    };
    onLoad(listener){};
    offLoad(listener){};
    onError(listener){};
    offError(listener){};
    onClose(listener){};
    offClose(listener){};
}
export class BannerAd{
    style:{
        top:number, left:number, width:number
    }
    show(){
        return new Promise((resolve, reject)=>{
            resolve();
        })
    };
    hide(){};
    destroy(){};
    onLoad(listener){};
    offLoad(listener){};
    onError(listener){};
    offError(listener){};
    onResize(listener){};
    offResize(listener){};
}
export class SystemInfo{
    system:	        string;//	操作系统版本	"11.4" | "8.0.0"	1.0.0
    platform:	    string;//	操作系统类型	"ios" | "android"	1.0.0
    brand:	        string;//	手机品牌	"Apple" | "Xiaomi"	1.0.0
    model:	        string;//	手机型号		1.0.0
    version:	    string;//	宿主 App 版本号（宿主指今日头条、抖音等）	6.7.8	1.0.0
    appName:	    string;//	宿主 APP 名称	"Toutiao"	1.0.0
    SDKVersion:	    string;//	客户端基础库版本	"1.0.0"	1.0.0
    screenWidth:	number;//	屏幕宽度		1.0.0
    screenHeight:	number;//	屏幕高度		1.0.0
    windowWidth:	number;//	可使用窗口宽度		1.0.0
    windowHeight:	number;//	可使用窗口高度		1.0.0
    pixelRatio:	    number;//	设备像素比		1.0.0
    statusBarHeight:number;//	状态栏的高度，单位 px		1.0.0
    safeArea:	    {
        left:	number	;//安全区域左上角横坐标
        right:	number	;//安全区域右下角横坐标
        top:	number	;//安全区域左上角纵坐标
        bottom:	number	;//安全区域右下角纵坐标
        width:	number	;//安全区域的宽度，单位逻辑像素
        height:	number	;//安全区域的高度，单位逻辑像素
    }
}
export class KVData{
    key:string;
    value:string;
}
export class UserGameData{
    avatarUrl:string;
    nickname:string;
    openid:string;
    KVDataList:KVData[];
}
export class UploadTask{
    abort(){};
    onProgressUpdate(callback:(res:{progress:number, totalBytesSent:number, totalBytesExpectedToSend:number})=>void){}
    offProgressUpdate(callback){};
    onHeadersReceived(callback){};
    offHeadersReceived(callback){};
}
export class DownloadTask{
    onProgressUpdate(callback:(res:{progress:number, totalBytesWritten:number, totalBytesExpectedToWrite:number})=>void){}
    offProgressUpdate(callback){};
    onHeadersReceived(callback){};
    offHeadersReceived(callback){};
}
export class GameRecorderShareButton{
    show(){}
    hide(){}
    onTap(listener){}
    offTap(listener){}
}

export class Canvas {
    width:number;
    height:number;
    getContext(type:string){
        return new Context();
    };
    toTempFilePath(obj:{
        x?: number,
        y?: number,
        width?: number,
        height?: number,
        destWidth?: number,
        destHeight?: number,
        fileType?:string,
        success: (res:{tempFilePath:string}) => void
    }){
        obj.success({tempFilePath:""});
    };
    toTempFilePathSync(obj:{
        x?: number,
        y?: number,
        width?: number,
        height?: number,
        destWidth?: number,
        destHeight?: number
    }){
        return "#tempFilePath#";
    }
};
export class Context{
    fillStyle:string;
    fillRect(x,y,w,h){};
    drawImage(image, sx?, sy?, sw?, sh?, dx?, dy?, dw?, dh?){};
}
export class Image{
    src:string;
    width:number;
    height:number;
    onload(call){};
    onerror(call){};
}
export enum AppName{
    Toutiao = "Toutiao",            //	今日头条
    Douyin = "Douyin",              //	抖音短视屏
    XiGua = "XiGua",                //	西瓜视频
    NewsLite = "news_article_lite", //	头条极速版
}
export class CrossPlatform{
    isDebug:boolean = true;
    env = {
        USER_DATA_PATH:"Root:",
    }
    private onShowListeners = [];
    private onHideListeners = [];
    fakeLeaveAndBack(onShowData){
        // Top.blockInput(true);
        for(let i=0;i<this.onHideListeners.length; i++){
            this.onHideListeners[i]();
        }
        setTimeout(() => {
            // Top.blockInput(false);
            for(let i=0;i<this.onShowListeners.length; i++){
                this.onShowListeners[i](onShowData);
            }
        }, 400);
    }
    onShow(callback){
        this.onShowListeners.push(callback);
    }
    onHide(callback){
        this.onHideListeners.push(callback);
    }
    getLaunchOptionsSync(){
        return {
            scene:1000,
            query:{
                type:"",
                Beats:"",
                saveData:"",
            },
            shareTicket:"",
            referrerInfo:null,
        };
    }

    shareAppMessage(obj:{
        title?: string, 
        imageUrl?:string, 
        query?:string, 
        imageUrlId?:string,

        channel?: "token"|"video",
        extra?: {
            videoPath: string, // 可替换成录屏得到的视频地址
            videoTopics: string[], //话题
            hashtag_list: string[], //话题
            withVideoId: boolean,   //
        },
        templateId?:string,
        success?:(res)=>void,
        fail?:(res)=>void,
    }){
        if(obj.success) obj.success({});
        console.log("分享", obj);
    }
    setStorage(obj:{key:string, data:object, success:(res)=>void, fail?, complete?}){}
    setStorageSync(key:string, value:object){}
    getStorage(data:{key:string, success:(res)=>void, fail?, complete?}){data.success("")}
    getStorageSync(key:string):any{}
    clearStorageSync(){};
    exitMiniProgram(){
        console.log("退出游戏");
    };
    getFileSystemManager(){
        return {
            saveFile(data:{tempFilePath:string, filePath:string, success, fail}){
                data.success(data.filePath);
            },
            saveFileSync(tempFilePath:string, filePath:string){
                return filePath+":"+tempFilePath;
            },
            accessSync(path:string){},
            mkdirSync(dirPath:string, recursive:boolean){},
            writeFileSync(filePath:string, data:string|ArrayBuffer, encoding:string="binary"){},
            readFileSync(filePath:string, encoding?:string, position?:string, length?:string):string|ArrayBuffer{return "";},
            unlinkSync(filePath:string){},
        }
    }
    createGameRecorderShareButton(obj:{
        text?:string,
        icon?:string,
        image?:string,
        fontSize?:number,
        
        style:{
            left,
            top,
            height,
            paddingRight?,
        },
        share?:{
            query?:string,
            title?:{
                template:"default.score"|"default.level"|"default.opponent"|"default.cost",
                data:object,
            }
            bgm?:string,
            timeRange?:Array<Array<number>>,
            button?:{
                template:string,
            },
        }
    }){
        return new GameRecorderShareButton();
    }
    //微信专用API
    getGameRecorder(){
        return {
            start(obj:{duration?:number,fps?:number, bitrate?:number, gop?:number, hookBgm?:boolean}){
                console.log("开始录屏");
            },
            pause(){},
            recordClip(obj:{timeRange?:number[], success?:(res:{index:number})=>{void}, fail?, complete?}){},
            clipVideo(obj:{path:string, timeRange?:number[], clipRange?:number[], success?, fail?}){},
            resume(){},
            stop(){
                console.log("结束录屏");
                return new Promise(()=>{});
            },
            onStart(callback){},
            onResume(callback){},
            onPause(callback){},
            onStop(callback:(obj:{videoPath:string})=>void){},
            onError(callback:(obj:{errMsg:string})=>void){},
            onInterruptionBegin(callback){},
            onInterruptionEnd(callback){},
        }
    }
    //抖音专用API
    getGameRecorderManager(){
        return {
            start(obj:{duration:number}){
                console.log("开始录屏");
            },
            pause(){},
            recordClip(obj:{timeRange?:number[], success?:(res:{index:number})=>{void}, fail?, complete?}){},
            clipVideo(obj:{path:string, timeRange?:number[], clipRange?:number[], success?, fail?}){},
            resume(){},
            stop(){
                console.log("结束录屏");
                return "视频地址";
            },
            onStart(callback){},
            onResume(callback){},
            onPause(callback){},
            onStop(callback:(obj:{videoPath:string})=>void){},
            onError(callback:(obj:{errMsg:string})=>void){},
            onInterruptionBegin(callback){},
            onInterruptionEnd(callback){},
        }
    }
    createCanvas(){
        return new Canvas();
    }
    createImage(){
        return new Image();
    }
    getOpenDataContext(){
        return {
            postMessage(message){}
        };
    }
    getSystemInfoSync(){
        let sys =  new SystemInfo();
        sys.system = "Android";
        sys.SDKVersion = "99.99.99";
        return sys;
    }
    createRewardedVideoAd(data:{adUnitId:string}){
        return new VideoAd();
    }
    createBannerAd(data:{adUnitId: string, adIntervals?:number, style?:{ width?:number, left?:number, top?:number} }){
        return new BannerAd();
    }
    reportAnalytics(evtName:string, obj:Object){
        console.log("Analytics", evtName, obj);
    };
    vibrateShort(){};
    vibrateLong(){};
    login(data:{success}){
        data.success({code:1});
    };
    setUserGroup(data){};
    setUserCloudStorage(data:{KVDataList:KVData[], success, fail?, complete?}){
        if(data.success) data.success();
    };
    getFriendCloudStorage(data:{keyList:string[], success?:(res:UserGameData[])=>void, fail?, complete?}){
        data.success([]);
    }
    downloadFile(data:{
        url:string,
        header?:object,
        timeout?:number,
        filePath?:string,
        success?:(res:{tempFilePath:string, filePath:string, statusCode:number})=>void,
        fail?:()=>void,
        complete?:()=>void,
    }){
        return new DownloadTask();
    }
    uploadFile(data:{
        url:string,
        filePath:string,
        name:string,
        header?:object,
        formData?:object,
        timeout?:number,
        success?:(res:{tempFilePath:string, filePath:string, statusCode:number})=>void,
        fail?:()=>void,
        complete?:()=>void,
    }){
        return new DownloadTask();
    }
    showKeyboard(data:{
        defaultValue: string,
        maxLength:number,
        multiple:boolean,
        confirmHold:boolean,
        confirmType:string,
        success?,
        fail?,
        complete?,
    }){
    }
    hideKeyboard(data){}
    offKeyboardConfirm(onConfirm){}
    onKeyboardConfirm(onConfirm){
        onConfirm && onConfirm({value:"hello"});
    }
    getSetting(data:{success, fail?, withSubscriptions?}){}
    authorize(data:{scope, success, fail?}){}
    getUserInfo(data:{success, fail?, withCredentials?}){}
    onShareAppMessage(func:()=> {shareType:string}){}
    onShareTimeline(func:()=>{}){}
    showShareMenu(data:{withShareTicket?:boolean, menus?:string[], success?, fail?}){};
    getUpdateManager(){
        return {
            onCheckForUpdate : null,
            onUpdateReady: null,
            applyUpdate: null,
            onUpdateFailed: null,
        };
    }
    saveImageToPhotosAlbum(data:{filePath:string, success, fail? }){
        data.success();
    };
    openSetting(data:{withSubscriptions?, success?, fail?}){};
    showModal(data:{
        title?:string,
        content?:string,
        showCancel?:boolean,
        cancelText?:string,
        cancelColor?:string,
        confirmText?:string,
        confirmColor?:string,
        success?,
        fail?,
    }){};
    request(data:{
        url: string,
        method: string,
        data: {
          alias_ids: string[],
        },
        success:(res)=>void,
    }){};
    navigateToVideoView(data:{
        videoId: string,
        success: (res) => void,
        fail: (err) => void,
    }){
        data.success({});
    }
}

export let crossPlatform:CrossPlatform = new CrossPlatform();
export let wx:CrossPlatform = window["wx"];
export let tt:CrossPlatform = window["tt"];

if(tt){
    crossPlatform = tt;
    wx = null;
}if(wx){
    crossPlatform = wx;
}
export let systemInfo:SystemInfo = crossPlatform.getSystemInfoSync();
