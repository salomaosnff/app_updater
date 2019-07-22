import * as Express from 'express';
import { Guard } from './interfaces/Guard.interface';
import { Strategy } from './interfaces/Strategy.interface';
import { Storage } from './interfaces/Storage.interface';
export interface ApplicationOptions {
    guards: Guard[];
    strategy?: Strategy;
    storage: Storage;
}
export declare class UpdaterApplication {
    private _guards;
    private _strategy;
    private _storage;
    constructor({ guards, strategy, storage }: ApplicationOptions);
    private _routeCheckUpdates;
    private _routePublish;
    private _getAuthMiddlewares;
    initInApp(app: Express.Application): Promise<void>;
}
