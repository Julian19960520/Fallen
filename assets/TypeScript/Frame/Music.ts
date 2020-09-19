// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { Util } from "./Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Music extends cc.Component {
    public static Finish = "MusicFinish";
    public static Loaded = "MusicLoaded";
    @property({type:cc.AudioClip})
    clip: cc.AudioClip = null;
    @property
    loop:boolean = false;
    @property
    volume:number = 1;
    id = null;
    public static volume:number = 1;
    playing = false;
    pausing = false;
    playingWhenDisable = false;
    url = "";
    onLoad () {
    }
    onEnable(){
        if(this.playingWhenDisable){
            this.resume();
        }
    }
    onDisable(){
        this.playingWhenDisable = this.playing;
        if(this.playing){
            this.pause();
        }
    }
    onDestroy(){
        this.stop();
    }
    loadMusic(name, callback = null){
        this.url = name;
        this.clip = null;
        Util.loadBundleRes("Music/"+name, cc.AudioClip,(clip)=>{
            if(this.url == name){
                this.clip = clip;
                if(callback && this.isValid){
                    callback();
                    this.node.emit(Music.Loaded);
                }
            }
        } )
    }
    play(){
        if(this.volume <= 0){
            return;
        }
        if(this.id!=null){
            this.stop();
        }
        this.id = cc.audioEngine.play(this.clip, this.loop, this.volume * Music.volume);
        if(this.pausing){
            this.pause();
        }
        cc.audioEngine.setFinishCallback(this.id, (res)=>{
            this.node.emit(Music.Finish);
            this.playing = false;
            this.id = null;
            console.log("Music Finish",res);
        });
        this.playing = true;
    }
    stop(){
        cc.audioEngine.stop(this.id);
        this.id = null;
        this.playing = false;
    }
    pause(){
        this.pausing = true;
        if(this.id){
            cc.audioEngine.pause(this.id);
            this.playing = false;
        }
    }
    resume(){
        this.pausing = false;
        if(this.id){
            cc.audioEngine.resume(this.id);
            this.playing = true;
        }
    }
    getDuration(){
        return cc.audioEngine.getDuration(this.id);
    }
    setCurrentTime(time){
        cc.audioEngine.setCurrentTime(this.id, time);
    }
    getCurrentTime(){
        return cc.audioEngine.getCurrentTime(this.id);
    }
    getState(){
        return cc.audioEngine.getState(this.id);
    }
    hasId(){
        return this.id !== null;
    }
    isLoaded(){
        return this.clip !== null;
    }
}
