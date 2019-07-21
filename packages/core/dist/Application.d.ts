import * as Express from 'express';
import { Guard } from './Guard.interface';
import { Strategy } from './Strategy.interface';
import { Storage } from './Storage.interface';
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
