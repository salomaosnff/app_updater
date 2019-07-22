var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { setActiveBundle, registerBundle, unregisterBundle, reloadBundle
// @ts-ignore
 } from 'react-native-dynamic-bundle';
import RnFS from 'react-native-fs';
export class ReactNativeClient {
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
                yield setActiveBundle(id);
            }
        });
    }
    install(bundle) {
        return __awaiter(this, void 0, void 0, function* () {
            const bundleId = this.generateBundleId(bundle);
            const bundlePath = yield this.download(bundle, bundleId);
            yield registerBundle(bundleId, bundlePath);
            return bundleId;
        });
    }
    download(bundle, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const filename = `${RnFS.DocumentDirectoryPath}/${id}.bundle`;
            yield RnFS.downloadFile({
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
            method: 'GET',
            // @ts-ignore
            headers: {
                'x-app-bundle-name': agent.name,
                'x-app-bundle-version': agent.version,
                'x-app-platform': agent.platform,
                'x-app-version': agent.appVersion,
                'x-app-version-code': agent.versionCode
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
            yield unregisterBundle(bundleId);
            yield RnFS.unlink(`${RnFS.DocumentDirectoryPath}/${bundleId}.bundle`);
        });
    }
    restart() {
        return reloadBundle();
    }
}
//# sourceMappingURL=Client.js.map