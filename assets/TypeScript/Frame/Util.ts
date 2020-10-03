import { systemInfo, crossPlatform } from "./CrossPlatform";

export namespace Util{
    //读取bundle内资源，优先读取本地包，没有则尝试远程包
    export function loadBundleRes(path:string, type:cc.Asset, call:Function): void;
    export function loadBundleRes(path:string, call:Function, foobar?): void;
    export function loadBundleRes(path:string, param1:cc.Asset|Function, param2:Function|undefined){
        let type = null;
        let call = null;
        if(param1 === cc.SpriteFrame 
                || param1 === cc.Prefab 
                || param1 === cc.AudioClip 
                || param1 === cc.JsonAsset){
            type = param1;
            call = param2;
        }else{
            call = param1;
        }
        var onLocalBundle = (localBundle:cc.AssetManager.Bundle)=>{
            if(localBundle.getInfoWithPath(path)){
                //在首包内，则优先读取首包内资源
                localBundle.load(path, type, (err, asset)=>{
                    call(asset);
                });
            }else{
                //不在首包内，则读取远程包
                let onRemoteBundle = (remoteBundle:cc.AssetManager.Bundle)=>{
                    remoteBundle.load(path, type, (err, asset)=>{
                        call(asset);
                    });
                }
                let remoteBundle = cc.assetManager.getBundle("remoteBundle");
                if(remoteBundle){
                    onRemoteBundle(remoteBundle);
                }else{
                    cc.assetManager.loadBundle("remoteBundle", (err, remoteBundle:cc.AssetManager.Bundle)=>{
                        onRemoteBundle(remoteBundle);
                    });
                }
            }
        }
        let localBundle = cc.assetManager.getBundle("localBundle");
        if(localBundle){
            onLocalBundle(localBundle);
        }else{
            cc.assetManager.loadBundle("localBundle", (err, localBundle:cc.AssetManager.Bundle)=>{
                onLocalBundle(localBundle);
            });
        }
    }
    export function rawUrl(name){
        var path = cc.url.raw(name);
        if (cc.loader.md5Pipe) {
            path = cc.loader.md5Pipe.transformURL(path);
        }
        return path;
    }
    export function enableAllCollider(node:cc.Node){
        let cols = node.getComponents(cc.Collider);
        for(let i=0;i<cols.length;i++){
            cols[i].enabled = true;
        }
    }
    export function disableAllCollider(node:cc.Node){
        let cols = node.getComponents(cc.Collider);
        for(let i=0;i<cols.length;i++){
            cols[i].enabled = false;
        }
    }
    export function getTimeStamp(){
        var date = new Date();
        return date.getTime();
    }
    export function customEvent(type, bubbles = false, detail = null){
        let _customEvent = new cc.Event.EventCustom("",false);
        _customEvent.type = type;
        _customEvent.bubbles = bubbles;
        _customEvent.detail = detail;
        return _customEvent;
    }
    export function vec2ToRadian(vec2:cc.Vec2){
        if(vec2.x == 0 && vec2.y == 0){
            return 0;
        }
        let radian = vec2.angle(cc.Vec2.RIGHT);
        if(vec2.y < 0){
            radian = 2*Math.PI - radian;
        }
        return radian;
    }
    export function  vec2Toangle(vec2:cc.Vec2){
        return vec2ToRadian(vec2)*180/Math.PI;
    }
    export function radToVec2(rad){
        return cc.v2(Math.cos(rad), Math.sin(rad));
    }
    export function angleToVec2(angle){
        return radToVec2(angleToRad(angle));
    }
    export function angleToRad(angle){
        return Math.PI*angle/180;
    }
    export function setAnchor(node:cc.Node, anchorX, anchorY){
        let dx = (anchorX - node.anchorX) * node.width;
        let dy = (anchorY - node.anchorY) * node.height;
        node.x += dx;
        node.y += dy;
        for(let i=0;i<node.childrenCount;i++){
            let child = node.children[i];
            child.x-=dx;
            child.y-=dy;
        }
        node.anchorX = anchorX;
        node.anchorY = anchorY;
    }
    export function randomIdx(len){
        return Math.floor(Math.random()*len);
    }
    export function randomInt(min, max){
        return Math.round(Math.random()*(max-min))+min;
    }
    export function randomFloat(min, max){
        return Math.random()*(max-min) + min;
    }
    export function fixedNum(num:number, point:number){
        return Number.parseFloat(num.toFixed(point));
    }
    export function parseTimeStr(time:number){
        time = Math.floor(time/1000);
        let s = time%60;    //秒
        time = Math.floor(time/60);
        let m = time%60;    //分
        time = Math.floor(time/60);
        let h = time;
        let res = "";
        if(h!=0){
            res += ("0"+h).substr(-2) + ":";
        }
        res += ("0"+m).substr(-2) + ":";
        res += ("0"+s).substr(-2);
        return res;
    }
    //日期
    export function parseDateHHMM(time:number){ 
        let date = new Date(time);
        let h = date.getHours();
        let m = date.getMinutes();
        let res = "";
        res += ("0"+h).substr(-2) + ":";
        res += ("0"+m).substr(-2);
        return res;
    }
    export function parseTimeHHMMSS(time:number){
        let h = Math.floor(time/1000/60/60);
        let m = Math.floor(time/1000/60%60);
        let s = Math.floor(time/1000%60);
        let res = "";
        res += ("0"+h).substr(-2) + ":";
        res += ("0"+m).substr(-2) + ":";
        res += ("0"+s).substr(-2);
        return res;
    }
    export function parseDateMMDD(time:number){ 
        let date = new Date(time);
        let m = date.getMonth()+1;
        let d = date.getDate();
        let res = "";
        res += ("0"+m).substr(-2) + "月";
        res += ("0"+d).substr(-2) + "日";
        return res;
    }
    export function toChineseNum(num){
        return "零一双三四五六七八九十"[num];
    }
    export function toMagnitudeNum(num:number){
        let idx = 0;
        while(num>=1000){
            num /= 1000;
            idx++;
        }
        if(idx == 0){
            return num.toString();
        }else{
            return num.toFixed(1)+["","k","m","g","t","p","e","z","y"][idx];
        }
    }
    export function clampStr(str, maxChars, suffix = "...") {
        var toCodePoint = function(unicodeSurrogates) {
            var r = [], c = 0, p = 0, i = 0;
            while (i < unicodeSurrogates.length) {
                var pos = i;
                c = unicodeSurrogates.charCodeAt(i++);//返回位置的字符的 Unicode 编码 
                if (c == 0xfe0f) {
                    continue;
                }
                if (p) {
                    var value = (0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00));
                    r.push({
                        v: value,
                        pos: pos,
                    }); //计算4字节的unicode
                    p = 0;
                } else if (0xD800 <= c && c <= 0xDBFF) {
                    p = c; //如果unicode编码在oxD800-0xDBff之间，则需要与后一个字符放在一起
                } else {
                    r.push({
                        v: c,
                        pos: pos
                    }); //如果是2字节，直接将码点转为对应的十六进制形式
                }
            }
            return r;
        }
     
        maxChars *= 2;
     
        var codeArr = toCodePoint(str);
        var numChar = 0;
        var index = 0;
        for (var i = 0; i < codeArr.length; ++i) {
            var code = codeArr[i].v;
            var add = 1;
            if (code >= 128) {
                add = 2;
            }
     
            //如果超过了限制，则按上一个为准
            if (numChar + add > maxChars){
                break;
            }
     
            index = i;
     
            //累加
            numChar += add;
        }
     
        if(codeArr.length - 1 == index){
            return str;
        }
     
        var more = suffix? 1:0;
     
        return str.substring(0, codeArr[index - more].pos + 1) + suffix;
    }

    export function lerp(cur:number, tar:number, ratio:number){
        return (tar-cur)*ratio+cur;
    }
    export function lerp01(cur:number, tar:number, ratio:number){
        ratio = clamp01(ratio);
        return lerp(cur, tar, ratio);
    }
    export function clamp(value, min, max){
        return Math.min(Math.max(value, min), max);
    }
    export function clamp01(value){
        return Math.min(Math.max(value, 0), 1);
    }
    export function sign(value){
        if(value>0){
            return 1;
        }else if(value<0){
            return -1;
        }else{
            return 0;
        }
    }
    export function move(cur, tar, step){
        if(Math.abs(tar-cur) > step){
            if(cur < tar){
                return cur + step;
            }else{
                return cur - step;
            }
        }else{
            return tar;
        }    
    }
    export function shuffle(arr){
        for (let i = arr.length - 1; i > 0; i--){  
            let idx = randomIdx(i);
            let temp = arr[i];  
            arr[i] = arr[idx];  
            arr[idx] = temp;  
        }  
    }
    
    export function lerpVec2(cur:cc.Vec2, tar:cc.Vec2, ratio:number){
        let x = lerp(cur.x, tar.x, ratio);
        let y = lerp(cur.y, tar.y, ratio);
        return cc.v2(x,y);
    }
    export function lerpVec201(cur:cc.Vec2, tar:cc.Vec2, ratio:number){
        let x = lerp01(cur.x, tar.x, ratio);
        let y = lerp01(cur.y, tar.y, ratio);
        return cc.v2(x,y);
    }
    export function moveVec2(cur:cc.Vec2, tar:cc.Vec2, step:number){
        let dir = tar.sub(cur);
        if(dir.magSqr() > step*step){
            dir.normalize(dir);
            dir.mulSelf(step);
            return dir.addSelf(cur);
        }else{
            return tar;
        }
    }
    //以node为prefab，复制出多个同样的兄弟node，使得兄弟数量达到cnt，并对每个兄弟调用call
    export function makeBro(prefab:cc.Node, cnt:number, call:(node:cc.Node, idx:number)=>void){
        let parent = prefab.parent;
        while(parent.childrenCount < cnt){
            let node = cc.instantiate(prefab);
            parent.addChild(node);
        }
        for(let i=0;i<parent.childrenCount;i++){
            let child = parent.children[i];
            if(i<cnt){
                child.active = true;
                call(child, i);
            }else{
                child.active = false;
            }
        }
    }
    //计算nodeA相对nodeB的相对坐标。即如果把NodeA放到NodeB下，返回NodeA的坐标
    export function convertPosition(nodeA:cc.Node, nodeB:cc.Node, offset=cc.Vec2.ZERO){
        let res = cc.v2();
        nodeA.convertToWorldSpaceAR(offset, res);
        nodeB.convertToNodeSpaceAR(res, res);
        return res;
    }
    export function moveToNewParent(node:cc.Node, newParent:cc.Node){
        let pos = convertPosition(node, newParent);
        node.removeFromParent(false);
        newParent.addChild(node);
        node.position = pos;
    }
    //深度优先搜索子节点
    export function searchChild(node:cc.Node, name:string):cc.Node{
        for(let i=0;i<node.childrenCount;i++){
            let child = node.children[i];
            if(child.name == name){
                return child;
            }else{
                let res = searchChild(child, name);
                if(res){
                    return res;
                }
            }
        }
    }
    export function emitAllChild(node:cc.Node, event){
        if(!node){
            return;
        }
        let func = (node:cc.Node)=>{
            node.emit(event);
            for(let i=0;i<node.childrenCount;i++){
                func(node.children[i]);
            }
        }
        func(node);
    }
    //移动node到一个新的节点下，并保持位置不变
    export function moveNode(node:cc.Node, parent:cc.Node){
        let res = cc.v2();
        node.convertToWorldSpaceAR(cc.Vec2.ZERO, res);
        parent.convertToNodeSpaceAR(res, res);
        if(node.parent){
            node.removeFromParent();
        }
        parent.addChild(node);
        node.position = res;
    }

    export function convertToWindowSpace(node:cc.Node){
        let rect = node.getBoundingBoxToWorld();
        let ratio = cc.view["_devicePixelRatio"];
        let scale = cc.view.getScaleX();
        let factor = scale/ratio;
        let point = cc.v2(rect.x, rect.y);
        cc.view["_convertPointWithScale"](point);
        return {
            left:rect.x*factor,
            top:systemInfo.screenHeight-(rect.y+rect.height)*factor,
            width:rect.width*factor,
            height:rect.height*factor,
        }
    }

    export function setColorMat(node:cc.Node, mat4:cc.Mat4){
        let onMatReady = (material)=>{
            let sprites = node.getComponentsInChildren(cc.Sprite).concat(node.getComponents(cc.Sprite));
            for(let i=0;i<sprites.length;i++){
                sprites[i].setMaterial(0, material);
            }
        }
        let material = node["_material_"];
        if(material){
            onMatReady(material);
        }else{
            cc.loader.loadRes("materials/gray-sprite", cc.Material, function(err, res) {
                var material = cc.Material["getInstantiatedMaterial"](res, node);
                onMatReady(material);
            })
        }
    }

    export function compareSDKVersion(version:string){
        if(!systemInfo) return true;
        let sdkVersion = systemInfo.SDKVersion;
        let arr1 = sdkVersion.split(".");
        let arr2 = version.split(".");
        for(let i=0; i<arr1.length; i++){
            let v1 = parseFloat(arr1[i]);
            let v2 = parseFloat(arr2[i]);
            if(v1 < v2){
                return false;
            }else if(v1 > v2){
                return true;
            }
        }
        return true;
    }
    export function compareAppName(appName:string){
        return appName == systemInfo.appName;
    }
    export function newSprite(url){
        let node = new cc.Node();
        let sprite = node.addComponent(cc.Sprite);
        cc.loader.loadRes(url, cc.SpriteFrame, (err, sf)=>{
            sprite.spriteFrame = sf;
        });
        return sprite;
    }
    export function addOpenContentIn(parent:cc.Node, data){
        let node = new cc.Node();
        let openC = node.addComponent(cc.WXSubContextView);
        parent.addChild(node);
        node.width = parent.width;
        node.height = parent.height;
        crossPlatform.getOpenDataContext().postMessage(data);
        return null;
    }

    //截图是反的！！！
    export function screenShotToTexture(parnet:cc.Node) {
        let node = new cc.Node();
        node.parent = parnet;//cc.director.getScene();
        // node.x = ScreenRect.width/2;
        // node.y = ScreenRect.height/2;
        let camera = node.addComponent(cc.Camera);

        // 设置你想要的截图内容的 cullingMask
        camera.cullingMask = 0xffffffff;

        // 新建一个 RenderTexture，并且设置 camera 的 targetTexture 为新建的 RenderTexture，这样 camera 的内容将会渲染到新建的 RenderTexture 中。
        let texture = new cc.RenderTexture();
        let gl = cc.game["_renderContext"];
        // 如果截图内容中不包含 Mask 组件，可以不用传递第三个参数
        texture.initWithSize(parnet.width, parnet.height, gl.STENCIL_INDEX8);
        camera.targetTexture = texture;

        // 渲染一次摄像机，即更新一次内容到 RenderTexture 中
        camera["render"](null);
        node.removeFromParent();
        // 这样我们就能从 RenderTexture 中获取到数据了
        return texture;
    }
    export function screenShotToTempFilePath(node:cc.Node, callback, fail = null){
        if(crossPlatform.isDebug){
            setTimeout(() => {
                callback("");
            }, 100);
            return;
        }
        let canvas:any = cc.game.canvas;
        let rate = canvas.width/canvas.clientWidth;
        let style = convertToWindowSpace(node);
        style.left *= rate;
        style.top *= rate;
        style.width *= rate;
        style.height *= rate;
        canvas.toTempFilePath({
            x:style.left,
            y:style.top,
            width:style.width,
            height:style.height,
            success:(res)=>{
                callback(res.tempFilePath);
            },
            fail:fail
        })
    }
    export function downloadTxt(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        
        element.style.display = 'none';
        document.body.appendChild(element);
       
        element.click();
       
        document.body.removeChild(element);
    }
    export function toQueryStr(data){
        if(!data)return "";
        let dataStr = "";
        for (let key in data) {
            let value = data[key];
            if(typeof value === "object"){
                dataStr += `${key}=${JSON.stringify(value)}&`;
            }else{
                dataStr += `${key}=${value}&`;
            }
        }
        if (dataStr.endsWith("&")) {
            dataStr = dataStr.slice(0, dataStr.length - 1);
        }
        return dataStr;
    }
    export function showKeyBoard(defaultValue:string, callback){
        crossPlatform.showKeyboard({
            defaultValue: defaultValue,
            maxLength:20,
            multiple:false,
            confirmHold:true,
            confirmType:"done",
            complete:(res)=>{
                console.log(res);
            }
        })
        let onConfirm = (data)=>{
            callback(data.value);
            crossPlatform.offKeyboardConfirm(onConfirm);
            crossPlatform.hideKeyboard({});
        }
        crossPlatform.onKeyboardConfirm(onConfirm);
    }
    export function enCodeHtml(n): any {
		n = n.replace(/%/g, "%25");
		n = n.replace(/\+/g, "%2B");
		n = n.replace(/\//g, "%2F");
		n = n.replace(/\?/g, "%3F");
		n = n.replace(/\#/g, "%23");
		n = n.replace(/\&/g, "%26");
		n = n.replace(/\=/g, "%3d");
		return n;
    }
    export function isAndroid(){
        if(!systemInfo) return true;
        return systemInfo.system.startsWith("Android");
    }
    export function isIOS(){
        if(!systemInfo) return true;
        return systemInfo.system.startsWith("iOS");
    }
    export function isWindows(){
        if(!systemInfo) return true;
        return systemInfo.system.startsWith("Windows");
    }
    export function isMacOS(){
        if(!systemInfo) return true;
        return systemInfo.system.startsWith("macOS");
    }

    export let useTimeline = false;
    export function canShareTimeLine(){
        return Util.isAndroid() && Util.compareSDKVersion("2.12.0") && useTimeline;
    }

    export function getServerTime(){
        return tang.TimeUtil.serverTime;
    }
    export function isToday(time){
        let dateA = new Date(time);
        let serverT = getServerTime();
        let dateB = new Date(serverT);
        let a = dateA.setHours(0, 0, 0, 0);
        let b = dateB.setHours(0, 0, 0, 0);
        return (a == b);
    }
    export function isYestoday(time){
        let dateA = new Date(time*1000);
        let dateB = new Date(getServerTime()*1000);
        let a = dateA.setHours(0, 0, 0, 0);
        let b = dateB.setHours(0, 0, 0, 0);
        return (a == b-1000*60*60*24);
    }

    export function saveImageToPhotosAlbum(){
        // let tempFilePath= canvas["toTempFilePath"]({
        //     x: rect.x,
        //     y: rect.y,
        //     width: rect.width,
        //     height: rect.height,
        //     destWidth: rect.width,
        //     destHeight: rect.height,
        //      success: (res) => {
        //          wx.saveImageToPhotosAlbum({
        //             filePath : res.tempFilePath,
        //             success : function(res) {
        //                 CommonUtils.showToast("截图已保存到相册", 2000);								
        //             }.bind(this),
        //             fail : function(err) {
        //                 egret.log(err);
        //                 CommonUtils.showToast("截图保存失败，权限不足", 2000);								
        //             }.bind(this)
        //         });
        //     },
        //      fail:(res)=>{
        //          CommonUtils.showToast("截图保存失败，请再次尝试", 2000);		
        //      }
        // });

    }    
    export function updateAllWidget(node:cc.Node){
        let widgets = node.getComponentsInChildren(cc.Widget);
        for(let i=0;i<widgets.length;i++){
            widgets[i].updateAlignment();
        }
    }
    export function updateAllLayout(node:cc.Node){
        let layouts = node.getComponentsInChildren(cc.Layout);
        for(let i=0;i<layouts.length;i++){
            layouts[i].updateLayout();
        }
    }

    let compressVersion = 1;
    export function compressPixels(pixels:Uint8Array){
        let colors = [];        //四个一组，分别为rgba，颜色下标即为在此数组出现的顺序
        let sections = [];        //每两个一组，分别为 相同颜色像素连续个数，颜色下标

        let cIdx = -1;          //上个像素的颜色下标
        let idx = 0;
        let pixelsLen = pixels.length;
        let r,g,b,a, cnt=0;
        while(idx<pixelsLen){
            r = pixels[idx];
            g = pixels[idx+1];
            b = pixels[idx+2];
            a = pixels[idx+3];
            //初始化第一个颜色
            if(colors.length == 0){
                colors.push(r,g,b,a);
                cIdx = 0;
            }
            //判断当前像素颜色是否与上个像素相同
            if(r == colors[cIdx*4]
                && g == colors[cIdx*4+1]
                && b == colors[cIdx*4+2]
                && a == colors[cIdx*4+3]){
                    //相同，计数+1
                    cnt++;
                    //Uint8Array中最大能存255，
                    if(cnt==255){
                        sections.push(cnt, cIdx);
                        cnt=0;
                    }
            }else{
                //不同，则将连续像素存入数组
                sections.push(cnt, cIdx);
                let newcIdx = -1;
                for(let i=0; i<colors.length; i+=4){
                    if(colors[i] == r && colors[i+1] == g &&colors[i+2] == b &&colors[i+3] == a){
                        newcIdx = i/4;
                        break;
                    }
                }
                if(newcIdx == -1){
                    newcIdx = colors.length/4;
                    colors.push(r,g,b,a);
                }
                cnt = 1;
                cIdx = newcIdx;
            }
            idx += 4;
        }
        //最后一个连续像素没有触发“颜色不同”分支，结束时直接存入最后一个连续像素
        sections.push(cnt, cIdx);
        let func = (num)=>{
            return [
                num>>>24,
                (num&0x00ff0000)>>16,
                (num&0x0000ff00)>>8,
                (num&0x000000ff)
            ]
        }
        let head = func(compressVersion)
                        .concat(func(pixelsLen))
                        .concat(func(colors.length))
                        .concat(func(sections.length));
        let array = func(head.length).concat(head).concat(colors).concat(sections);
        console.log("原大小："+pixels.length+",压缩后大小："+array.length+",压缩比："+(array.length/pixels.length));
        return array;
    }
    export function decompressionPixels(array:number[]){
        let func = (arr:number[])=>{
            return (arr[0]<<24) + (arr[1]<<16) + (arr[2]<<8) + arr[3];
        }
        let headLen = func(array.slice(0, 4));
        let head = array.slice(4, 4+headLen);
        let compressVersion = func(head.slice(0, 4));
        if(compressVersion == 1){
            let pixelsLen = func(head.slice(4,8));
            let colorsLen = func(head.slice(8,12));
            let sectionsLen = func(head.slice(12,16));
            let pixels = new Uint8Array(pixelsLen);
            let begin = 4+headLen;
            let colors = array.slice(begin, begin+colorsLen);
            let sections = array.slice(begin+colorsLen, begin+colorsLen+sectionsLen);
            let idx = 0;
            let sIdx = 0;
            while(sIdx<sectionsLen){
                let cnt = sections[sIdx];
                let cIdx = sections[sIdx+1];
                
                let colorR = colors[cIdx*4];
                let colorG = colors[cIdx*4+1];
                let colorB = colors[cIdx*4+2];
                let colorA = colors[cIdx*4+3];

                for(let i=0;i<cnt;i++){
                    pixels[idx] = colorR;
                    pixels[idx+1] = colorG;
                    pixels[idx+2] = colorB;
                    pixels[idx+3] = colorA;
                    idx+=4;
                }
                sIdx+=2;
            }
            return pixels;
        }else{
            return new Uint8Array(0);
        }
    }
}