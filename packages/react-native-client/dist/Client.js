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
const react_native_dynamic_bundle_1 = require("react-native-dynamic-bundle");
const react_native_fs_1 = require("react-native-fs");
class UpdateCenterClient {
    constructor(config) {
        this.config = config;
    }
    checkUpdates() {
        return __awaiter(this, void 0, void 0, function* () {
            let update;
            for (let repo of this.config.repositories) {
                if (update)
                    return update;
                update = yield this.checkUpdatesInRepo(repo);
            }
            return update;
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const update = yield this.checkUpdates();
            if (update) {
                const id = yield this.install(update);
                yield react_native_dynamic_bundle_1.setActiveBundle(id);
            }
        });
    }
    install(bundle, onProgress) {
        return __awaiter(this, void 0, void 0, function* () {
            const bundleId = this.generateBundleId(bundle);
            const bundlePath = yield this.download(bundle, bundleId);
            yield react_native_dynamic_bundle_1.registerBundle(bundleId, bundlePath);
            return bundleId;
        });
    }
    activate(bundleId, restart = false) {
        return __awaiter(this, void 0, void 0, function* () {
            yield react_native_dynamic_bundle_1.setActiveBundle(bundleId);
            if (restart)
                return this.restart();
        });
    }
    download(bundle, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const filename = `${react_native_fs_1.default.DocumentDirectoryPath}/${id}.bundle`;
            yield react_native_fs_1.default.downloadFile({
                fromUrl: bundle.bundleUrl,
                toFile: filename
            }).promise;
            return filename;
        });
    }
    generateBundleId({ name, appVersion, version, platform }) {
        return `${name}-${appVersion}-${version}-${platform}`;
    }
    checkUpdatesInRepo(repo) {
        const { agent } = this.config;
        return fetch(repo.url, {
            method: "GET",
            // @ts-ignore
            headers: {
                "x-app-bundle-name": agent.name,
                "x-app-bundle-version": agent.version,
                "x-app-platform": agent.platform,
                "x-app-version": agent.appVersion,
                "x-app-version-code": agent.versionCode
            }
        }).then((r) => r.json());
    }
    uninstall(bundle) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.uninstallByBundleId(this.generateBundleId(bundle));
        });
    }
    uninstallByBundleId(bundleId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield react_native_dynamic_bundle_1.unregisterBundle(bundleId);
            yield react_native_fs_1.default.unlink(`${react_native_fs_1.default.DocumentDirectoryPath}/${bundleId}.bundle`);
        });
    }
    restart() {
        return react_native_dynamic_bundle_1.reloadBundle();
    }
}
exports.UpdateCenterClient = UpdateCenterClient;
//# sourceMappingURL=Client.js.map