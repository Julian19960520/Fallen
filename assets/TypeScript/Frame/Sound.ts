import { Util } from "./Util";

export namespace Sound  {
    let soundMap = new Map<string,cc.AudioClip>();
    export let volume = 1;
    export function play(name:string, loop = false){
        if(!name){
            return;
        }
        if(volume <= 0){
            return;
        }
        let clip = soundMap.get(name);
        if(clip){
            cc.audioEngine.play(clip, loop, volume);
        }else{
            Util.loadBundleRes("Sound/"+name, cc.AudioClip, (clip)=>{
                soundMap.set(name, clip);
                cc.audioEngine.play(clip, false, 1);
            });
        }
    }
}
