import { Request } from "express";
import { Strategy, AgentInfo, UpdateObject } from "./Strategy.interface";
export declare class DefaultStrategy implements Strategy {
    getBundleInfo(req: Request): Promise<UpdateObject>;
    getAgentInfo(req: Request): Promise<AgentInfo>;
    validateBundle(data: UpdateObject, req?: Request): Promise<boolean>;
}
