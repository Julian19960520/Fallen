import { crossPlatform } from "../Frame/CrossPlatform";
import { Util } from "../Frame/Util";

export enum EvtType{
    EnergyChange = "EnergyChange",
    FlyingEnergyChange = "FlyingEnergyChange",
    CoinChange = "CoinChange",
    FlyingCoinChange = "FlyingCoinChange",
    HeroDatasChange = "HeroDatasChange"
}

export class HeroData{
    id:number;
    unlockPayCnt:number;
    unlock:boolean;
}
class HeroMng{
    curHeroId = 1;
    heroDatas:HeroData[] = [];
    parseData(data){
        this.curHeroId = data.curHeroId || 1;
        this.heroDatas = data.heroDatas || [];
    }

    makeData(){
        return {
            curHeroId:this.curHeroId,
            heroDatas:this.heroDatas,
        }
    }

    getHeroData(id){
        for(let i=0;i<this.heroDatas.length;i++){
            let hero = this.heroDatas[i];
            if(hero.id == id){
                return hero;
            }
        }
        let hero:HeroData = {id:id, unlockPayCnt:0, unlock:false};
        this.heroDatas.push(hero);
        return hero;
    }

    async unlockHero(id){
        let hero = this.getHeroData(id);
        hero.unlock = true;
        await Player.saveLoacl();
        cc.game.emit(EvtType.HeroDatasChange, this.heroDatas);
        return [
            {type:"hero", id:id}
        ]
    }
}
class CoinMng{
    coin = 200;
    flyingCoin = 0;
    initCoin = 200;
    parseData(data){
        this.coin = data.coin || this.initCoin;
    }

    makeData(){
        return {
            coin:this.coin,
        }
    }

    //操作函数
    useCoin(cnt){
        this.coin-=cnt;
        cc.game.emit(EvtType.EnergyChange, this.coin);
    }
    
    addCoin(cnt){
        this.coin += cnt;
        this.flyingCoin-=cnt;
        cc.game.emit(EvtType.CoinChange, this.coin);
        cc.game.emit(EvtType.FlyingCoinChange, this.flyingCoin);
    }
}
class EnergyMng{
    energy = 3;
    energyMax = 3;
    timePerEnergy = 2*60*1000;
    flyingEnergy = 0;
    lastRecoverEnergyStamp = 0;
    runEnergyThread(){
        //计算下线恢复的能量
        let stamp = Util.getTimeStamp();
        let add = (stamp - this.lastRecoverEnergyStamp)/this.timePerEnergy;
        this.energy += add;
        if(this.energy < this.energyMax){
            this.lastRecoverEnergyStamp += add*this.timePerEnergy;
        }else{
            this.energy = this.energyMax;
            this.lastRecoverEnergyStamp = stamp;
        }
        //每秒检测恢复能量
        setInterval(()=>{
            let stamp = Util.getTimeStamp();
            if(stamp - this.lastRecoverEnergyStamp > this.timePerEnergy){
                this.energy++;
                this.lastRecoverEnergyStamp=stamp;
                cc.game.emit(EvtType.EnergyChange, this.energy);
                Player.saveLoacl();
            }
        }, 1000);
    }
    parseData(data){
        this.energy = data.energy || this.energyMax;
    }

    makeData(){
        return {
            energy:this.energy,
            lastRecoverEnergyStamp:this.lastRecoverEnergyStamp,
        }
    }
    

    //操作函数
    useEnergy(cnt){
        this.energy-=cnt;
        cc.game.emit(EvtType.EnergyChange, this.energy);
    }
    addEnergy(cnt){
        this.energy += cnt;
        this.flyingEnergy-=cnt;
        cc.game.emit(EvtType.EnergyChange, this.energy);
        cc.game.emit(EvtType.FlyingEnergyChange, this.flyingEnergy);
    }
}


export namespace Player{

    export let heroMng = new HeroMng();
    export let energyMng = new EnergyMng();
    export let coinMng = new CoinMng();
    export function init(){
        energyMng.runEnergyThread();
    }
    

    //保存与读取
    export function loadLocal(){
        console.log("读档");
        return new Promise((resolve, reject)=>{
            crossPlatform.getStorage({
                key:"player",
                success:(data)=>{
                    this.parseData(data);
                    resolve();
                },
            });
        })
    }
    export function saveLoacl(){
        console.log("存档");
        return new Promise((resolve, reject)=>{
            crossPlatform.setStorage({
                key:"player",
                data:makeData(),
                success:(data)=>{
                    resolve();
                }
            });
        })
        
    }
    export function parseData(data){
        data = data || {};
        heroMng.parseData(data.heroMng || {});
        energyMng.parseData(data.energyMng || {});
        coinMng.parseData(data.coinMng || {});
    }
    export function makeData(){
        return {
            energy:energyMng.makeData(),
            heroMng:heroMng.makeData(),
            coinMng:coinMng.makeData(),
        }
    }
}
