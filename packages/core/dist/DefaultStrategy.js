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
class DefaultStrategy {
    getBundleInfo(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                platform: req.body.platform,
                version: req.body.version,
                versionCode: +req.body.version_code,
                name: req.body.name,
                appVersion: req.body.app_version,
            };
        });
    }
    getAgentInfo(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const engines = {};
            for (let h in req.headers) {
                if (!h.startsWith('x-app-engine-'))
                    continue;
                const engineName = h.replace('x-app-engine-', '');
                engines[engineName] = req.get(h);
            }
            return {
                name: req.get('x-app-bundle-name'),
                version: req.get('x-app-bundle-version'),
                versionCode: +req.get('x-app-version-code'),
                appVersion: req.get('x-app-version'),
                platform: req.get('x-app-platform'),
            };
        });
    }
    validateBundle(data, req) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
}
exports.DefaultStrategy = DefaultStrategy;
//# sourceMappingURL=DefaultStrategy.js.map