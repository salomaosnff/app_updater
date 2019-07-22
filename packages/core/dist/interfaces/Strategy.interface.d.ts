import { Request, RequestHandler } from 'express';
export interface AgentInfo {
    name: string;
    version: any;
    versionCode: number;
    platform: string;
    appVersion: string;
}
export interface UpdateObject {
    name: string;
    version: string;
    versionCode: number;
    platform: string;
    appVersion: string;
    bundleUrl?: string;
}
export interface Strategy {
    beforePublish?: RequestHandler;
    beforeCheckUpdates?: RequestHandler;
    getAgentInfo(req: Request): Promise<AgentInfo>;
    getBundleInfo(req: Request): Promise<UpdateObject>;
}
