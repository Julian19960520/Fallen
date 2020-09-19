export class HeroConf{
	id:number;
	name:string;
	unlockType:string;
	unlockCnt:number;
}

export class ColorData{
    id:number|string;
    name:string;
    color:cc.Color;
}
export class LvlConf{
    objList:any[] = [];
}
export namespace Config{
	//英雄
	export let heros:HeroConf[] = [
		{id:1,name:"勇士", unlockType:"coin", unlockCnt:1},
		{id:2,name:"战士", unlockType:"coin", unlockCnt:100},
		{id:3,name:"射手", unlockType:"coin", unlockCnt:200},
        {id:4,name:"法师", unlockType:"coin", unlockCnt:300},
        
        // {id:0,name:"勇士", unlockType:"coin", unlockCnt:1}, //0代表自己绘画
	]
	export function getHeroConf(id){
		for(let i=0;i<heros.length;i++){
			let hero = this.heros[i];
			if(hero.id = id){
				return hero;
			}
		}
		return heros[0];
    }
    //关卡
    export let levelConf = [
        {},
    ];
	//颜色
	export let colors:ColorData[] = [
        {id:1, name:'黑色', color:cc.color(0,0,0)},
        {id:2, name:'黑色', color:cc.color(34,32,52)},
        {id:3, name:'黑色', color:cc.color(69,40,60)},
        {id:4, name:'黑色', color:cc.color(102,57,49)},
        {id:5, name:'黑色', color:cc.color(143,86,59)},
        {id:6, name:'黑色', color:cc.color(223,113,38)},
        {id:7, name:'黑色', color:cc.color(217,160,102)},
        {id:8, name:'黑色', color:cc.color(238,195,154)},
        {id:9, name:'黑色', color:cc.color(251,242,54)},
        {id:10, name:'黑色', color:cc.color(153,229,80)},
        {id:11, name:'黑色', color:cc.color(106,190,48)},
        {id:12, name:'黑色', color:cc.color(55,148,110)},
        {id:13, name:'黑色', color:cc.color(75,105,47)},
        {id:14, name:'黑色', color:cc.color(82,75,36)},
        {id:15, name:'黑色', color:cc.color(50,60,57)},
        {id:16, name:'黑色', color:cc.color(63,63,116)},
        {id:17, name:'黑色', color:cc.color(48,96,130)},
        {id:18, name:'黑色', color:cc.color(91,110,225)},
        {id:19, name:'黑色', color:cc.color(99,155,255)},
        {id:20, name:'黑色', color:cc.color(95,205,228)},
        {id:21, name:'黑色', color:cc.color(203,219,252)},
        {id:22, name:'黑色', color:cc.color(255,255,255)},
        {id:23, name:'黑色', color:cc.color(155,173,183)},
        {id:24, name:'黑色', color:cc.color(132,126,135)},
        {id:25, name:'黑色', color:cc.color(105,106,106)},
        {id:26, name:'黑色', color:cc.color(89,86,82)},
        {id:27, name:'黑色', color:cc.color(118,66,138)},
        {id:28, name:'黑色', color:cc.color(172,50,50)},
        {id:29, name:'黑色', color:cc.color(217,87,99)},
        {id:30, name:'黑色', color:cc.color(215,123,186)},
        {id:31, name:'黑色', color:cc.color(143,151,74)},
        {id:32, name:'黑色', color:cc.color(138,111,48)},
	]
	export function getColorDataByID(id){
        return colors.find((data)=>{return data.id == id});
    }
}