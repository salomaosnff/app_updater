import {
  UpdateObject,
  IUpdateCenterClient,
  UpdateCenterClientConfig,
  UpdateCenterRepository
} from "@update-center/common";

import {
  setActiveBundle,
  registerBundle,
  unregisterBundle,
  reloadBundle
} from "react-native-dynamic-bundle";
import RnFS from "react-native-fs";

type ProgressFuncion = (result: RnFS.DownloadProgressCallbackResult) => any;

export class UpdateCenterClient implements IUpdateCenterClient {
  constructor(public config: UpdateCenterClientConfig) {}

  async checkUpdates(): Promise<UpdateObject> {
    let update;

    for (let repo of this.config.repositories) {
      if (update) return update;
      update = await this.checkUpdatesInRepo(repo);
    }

    return update;
  }

  async update(): Promise<any> {
    const update = await this.checkUpdates();

    if (update) {
      const id = await this.install(update);
      await setActiveBundle(id);
    }
  }

  async install(
    bundle: UpdateObject,
    onProgress?: ProgressFuncion
  ): Promise<any> {
    const bundleId = this.generateBundleId(bundle);
    const bundlePath = await this.download(bundle, bundleId);
    await registerBundle(bundleId, bundlePath);

    return bundleId;
  }

  async activate(bundleId: string, restart = false) {
    await setActiveBundle(bundleId);
    if (restart) return this.restart();
  }

  async download(bundle: UpdateObject, id?: string): Promise<string> {
    const filename = `${RnFS.DocumentDirectoryPath}/${id}.bundle`;

    await RnFS.downloadFile({
      fromUrl: bundle.bundleUrl,
      toFile: filename
    }).promise;

    return filename;
  }

  generateBundleId({
    name,
    appVersion,
    version,
    platform
  }: UpdateObject): string {
    return `${name}-${appVersion}-${version}-${platform}`;
  }

  checkUpdatesInRepo(repo: UpdateCenterRepository): Promise<UpdateObject> {
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
    }).then((r: Response) => r.json());
  }

  async uninstall(bundle: UpdateObject) {
    return this.uninstallByBundleId(this.generateBundleId(bundle));
  }

  async uninstallByBundleId(bundleId: string) {
    await unregisterBundle(bundleId);
    await RnFS.unlink(`${RnFS.DocumentDirectoryPath}/${bundleId}.bundle`);
  }

  restart() {
    return reloadBundle();
  }
}
