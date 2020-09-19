import { crossPlatform } from "./CrossPlatform";


export namespace Local {
    let map = new Map<string, any>();
    let dirtyList = [];
    export function Get(key){
        if(map.has(key)){
            return map.get(key);
        }else{
            let value = crossPlatform.getStorageSync(key);
            map.set(key, value);
            return value;
        }
    }
    export function GetAsync(key, succ){
        if(map.has(key)){
            succ(map.get(key));
        }else{
            crossPlatform.getStorage({
                key:key,
                success:(res)=>{
                    map.set(key, res);
                    succ(res);
                },
                fail:()=>{
                    succ("");
                },
            });
        }
    }
    export function Set(key:string, value){
        map.set(key, value);
        if(dirtyList.indexOf(key)<0){
            dirtyList.push(key);
        }
        Save();
    }
    export function Save(){
        for(let i=0;i<dirtyList.length;i++){
            let key = dirtyList[i];
            let data = map.get(key);
            crossPlatform.setStorage({key:key, data:data});
        }
        dirtyList = [];
    }
    export function setDirty(key){
        if(dirtyList.indexOf(key)<0){
            dirtyList.push(key);
        }
        Save();
    }
}
