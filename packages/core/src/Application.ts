import * as Express from 'express'
import { Guard, GuardScope } from './interfaces/Guard.interface';
import { Strategy } from './interfaces/Strategy.interface'
import { Storage } from './interfaces/Storage.interface';
import { DefaultStrategy } from './DefaultStrategy';

export interface ApplicationOptions {
    guards: Guard[]
    strategy?: Strategy
    storage: Storage
}

const createAuthMidleware = (handler: Express.RequestHandler) => [
    (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        // @ts-ignore
        if (req.authenticated) return next()
        handler(req, res, next)
    },
    (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        // @ts-ignore
        req.authenticated = true
        next()
    }
]

export class UpdaterApplication {
    private _guards: Guard[]
    private _strategy: Strategy
    private _storage: Storage

    constructor({
        guards = [],
        strategy = new DefaultStrategy(),
        storage
    }: ApplicationOptions) {
        this._guards = guards
        this._strategy = strategy
        this._storage = storage
    }
    
    private async _routeCheckUpdates(req: Express.Request, res: Express.Response) {
        const params = await this._strategy.getAgentInfo(req)
        const result = await this._storage.findUpdates(params)

        res.json(result)
    }

    private async _routePublish (req:Express.Request, res: Express.Response, next: Express.NextFunction) {
        const info = await this._strategy.getBundleInfo(req)

        // Validate bundle
        if (this._storage.validateBundle && !await this._storage.validateBundle(info)) {
            return res.status(401).json({
                status: 400,
                error: 'Bad Request!'
            })
        }

        res.status(201).json(await this._storage.save(info, req, res, next))
    }

    private _getAuthMiddlewares (scope: GuardScope) {
        return [].concat(this._guards.filter(g => g.scope.includes(scope)).map(g => createAuthMidleware(g.handler)))
    }

    async initInApp(app: Express.Application) {
        const beforeCheckUpdates:Express.RequestHandler[] = this._getAuthMiddlewares('check-updates')
        const beforePublish:Express.RequestHandler[] = this._getAuthMiddlewares('publish')

        if (this._strategy.beforeCheckUpdates) beforeCheckUpdates.push(this._strategy.beforeCheckUpdates.bind(this._strategy))
        if (this._storage.beforeCheckUpdates) beforeCheckUpdates.push(this._storage.beforeCheckUpdates.bind(this._storage))
        
        if (this._strategy.beforePublish) beforePublish.push(this._strategy.beforePublish.bind(this._strategy))
        if (this._storage.beforePublish) beforePublish.push(this._storage.beforePublish.bind(this._storage))
        
        app.get('/updates', ...beforeCheckUpdates, this._routeCheckUpdates.bind(this))
        app.post('/updates', ...beforePublish, this._routePublish.bind(this))
    }
}