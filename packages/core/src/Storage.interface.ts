import { Request, Response, NextFunction } from 'express'
import { UpdateObject, AgentInfo } from './Strategy.interface';
import { RequestHandler } from 'express';

export interface Storage {
    beforePublish               ?: RequestHandler
    beforeCheckUpdates          ?: RequestHandler
    findUpdates (agent: AgentInfo, req?: Request)       : Promise<UpdateObject|null>
    validateBundle?(data: UpdateObject, req?: Request)  : Promise<boolean>
    save (data: UpdateObject, req?: Request, res?: Response, next?: NextFunction): Promise<boolean|null>
}