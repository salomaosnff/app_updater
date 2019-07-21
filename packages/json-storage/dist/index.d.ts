import { Request, Response, NextFunction, Application } from 'express';
import { Storage, AgentInfo, UpdateObject } from '@appupdater/core';
interface JsonStorageOptions {
    app: Application;
    minifyJson?: boolean;
    filename?: string;
    uploadsDir?: string;
    baseUrl?: string;
    filesRoute?: string;
}
export default class JsonStorage implements Storage {
    private _upload;
    private _filename;
    private _baseUrl;
    private _minifyJson;
    private _filesRoute;
    constructor({ app, filename, minifyJson, baseUrl, filesRoute, uploadsDir }: JsonStorageOptions);
    beforePublish(req: Request, res: Response, next: NextFunction): void;
    save(data: UpdateObject, req: Request, res: Response, next: NextFunction): Promise<boolean>;
    findUpdates(agent: AgentInfo): Promise<UpdateObject | null>;
}
export {};
