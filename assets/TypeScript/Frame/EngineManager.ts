import { FightSystem } from "./FightSystem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EngineManager extends cc.Component {
    public static Ins:EngineManager;
    @property(cc.Camera)
    public mainCamera:cc.Camera;
    public onLoad(){
        EngineManager.Ins = this;
        FightSystem.init();
    }
    //改变默认的Update逻辑，使得timeScale影响Update的参数dt
    setupTimeScale(){
        let scheduler: cc.Scheduler = cc.director["_scheduler"];
        let schedulerUpdateFunc = scheduler.update;
        scheduler.update = function (dt: number) {
            schedulerUpdateFunc.call(scheduler, this._timeScale === 0 ? 0 : dt / this._timeScale);
        }
        let _deltaTime: number = 0;
        Object.defineProperty(cc.director, "_deltaTime", {
            get: () => {
                let r = _deltaTime * cc.director.getScheduler().getTimeScale();
                    return r; 
                },
            set: (value) => { 
                _deltaTime = value;
            },
            enumerable: true,
            configurable: true
        });
    }
    //提供常驻的定时回调
    public startSchedule(callback: Function, interval?: number, repeat?: number, delay?: number){
        this.schedule(callback, interval, repeat, delay);
    }
    public endSchedule(callback){
        this.unschedule(callback);
    }
}
