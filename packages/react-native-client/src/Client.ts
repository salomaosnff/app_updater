import {
  UpdateObject,
  UpdateCenterClientConfig,
  UpdateCenterRepository,
  IUpdateCenterClient,
  UpdateError
} from "@update-center/common";

import {
  setActiveBundle,
  registerBundle,
  unregisterBundle,
  reloadBundle
} from "react-native-dynamic-bundle";
import RnFS from "react-native-fs";

import axios, { AxiosResponse, AxiosError } from "axios";

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
    forceRestart = false,
    onProgress?: ProgressFuncion,
  ): Promise<any> {
    const bundleId = this.generateBundleId(bundle);
    const bundlePath = await this.download(bundle, bundleId, onProgress);
    await registerBundle(bundleId, bundlePath);

    await this.activate(bundleId, forceRestart)

    return bundleId;
  }

  async activate(bundleId: string, restart = false) {
    await setActiveBundle(bundleId);
    if (restart) return this.restart();
  }

  async download(bundle: UpdateObject, id?: string, onProgress?: ProgressFuncion): Promise<string> {
    const filename = `${id}.bundle`;

    await RnFS.downloadFile({
      fromUrl: bundle.bundleUrl,
      toFile: `${RnFS.DocumentDirectoryPath}/${filename}`,
      progress: onProgress
    }).promise;

    return filename;
  }

  generateBundleId({
    name,
    version,
    platform,
    versionCode
  }: UpdateObject): string {
    return `${name}-${version}-${versionCode}-${platform}`;
  }

  checkUpdatesInRepo(repo: UpdateCenterRepository): Promise<UpdateObject> {
    const { agent } = this.config;

    return axios
      .get(repo.url, {
        method: "GET",
        // @ts-ignore
        headers: {
          "x-app-bundle-name": agent.name,
          "x-app-bundle-version": agent.version,
          "x-app-platform": agent.platform,
          "x-app-version": agent.appVersion,
          "x-app-version-code": agent.versionCode
        }
      })
      .then((r: AxiosResponse<UpdateObject>) => r.data)
      .catch((err: AxiosError) => {
        if (!err.response) {
          throw new UpdateError(err, 'NETWORK_ERROR')
        }
        if (err.code === 'ECONNABORTED') {
          throw new UpdateError(err, 'CHECKUPDATES_TIMEOUT')
        }
        if ([401, 403].includes(err.response.status)) {
          throw new UpdateError(err, 'UNAUTHORIZED')
        }
        throw err
      });
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
