import { tt } from "../Frame/CrossPlatform";
import Env from "./Env";
export namespace TGA{
    export function tag(eventName, extend){
        extend["ver"] = Env.version;
        if(tt){
            tt.reportAnalytics(eventName, extend)
        }
    }
}