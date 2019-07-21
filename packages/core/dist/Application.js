"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultStrategy_1 = require("./DefaultStrategy");
const createAuthMidleware = (handler) => [
    (req, res, next) => {
        // @ts-ignore
        if (req.authenticated)
            return next();
        handler(req, res, next);
    },
    (req, res, next) => {
        // @ts-ignore
        req.authenticated = true;
        next();
    }
];
class UpdaterApplication {
    constructor({ guards = [], strategy = new DefaultStrategy_1.DefaultStrategy(), storage }) {
        this._guards = guards;
        this._strategy = strategy;
        this._storage = storage;
    }
    _routeCheckUpdates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = yield this._strategy.getAgentInfo(req);
            const result = yield this._storage.findUpdates(params);
            res.json(result);
        });
    }
    _routePublish(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = yield this._strategy.getBundleInfo(req);
            // Validate bundle
            if (this._storage.validateBundle && !(yield this._storage.validateBundle(info))) {
                return res.status(401).json({
                    status: 400,
                    error: 'Bad Request!'
                });
            }
            res.status(201).json(yield this._storage.save(info, req, res, next));
        });
    }
    _getAuthMiddlewares(scope) {
        return [].concat(this._guards.filter(g => g.scope.includes(scope)).map(g => createAuthMidleware(g.handler)));
    }
    initInApp(app) {
        return __awaiter(this, void 0, void 0, function* () {
            const beforeCheckUpdates = this._getAuthMiddlewares('check-updates');
            const beforePublish = this._getAuthMiddlewares('publish');
            if (this._strategy.beforeCheckUpdates)
                beforeCheckUpdates.push(this._strategy.beforeCheckUpdates.bind(this._strategy));
            if (this._storage.beforeCheckUpdates)
                beforeCheckUpdates.push(this._storage.beforeCheckUpdates.bind(this._storage));
            if (this._strategy.beforePublish)
                beforePublish.push(this._strategy.beforePublish.bind(this._strategy));
            if (this._storage.beforePublish)
                beforePublish.push(this._storage.beforePublish.bind(this._storage));
            app.get('/updates', ...beforeCheckUpdates, this._routeCheckUpdates.bind(this));
            app.post('/updates', ...beforePublish, this._routePublish.bind(this));
        });
    }
}
exports.UpdaterApplication = UpdaterApplication;
//# sourceMappingURL=Application.js.map