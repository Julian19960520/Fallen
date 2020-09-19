

import Env from "./Game/Env";
import { tt } from "./Frame/CrossPlatform";

export namespace TGA{
    export function tag(eventName, extend){
        extend["ver"] = Env.version;
        if(tt){
            tt.reportAnalytics(eventName, extend)
        }
    }
}