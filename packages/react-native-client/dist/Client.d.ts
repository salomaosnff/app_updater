import { UpdateObject, UpdateCenterClientConfig, UpdateCenterRepository, IUpdateCenterClient } from "@update-center/common";
import RnFS from "react-native-fs";
declare type ProgressFuncion = (result: RnFS.DownloadProgressCallbackResult) => any;
export declare class UpdateCenterClient implements IUpdateCenterClient {
    config: UpdateCenterClientConfig;
    constructor(config: UpdateCenterClientConfig);
    checkUpdates(): Promise<UpdateObject>;
    update(): Promise<any>;
    install(bundle: UpdateObject, onProgress?: ProgressFuncion): Promise<any>;
    activate(bundleId: string, restart?: boolean): Promise<any>;
    download(bundle: UpdateObject, id?: string): Promise<string>;
    generateBundleId({ name, appVersion, version, platform }: UpdateObject): string;
    checkUpdatesInRepo(repo: UpdateCenterRepository): Promise<UpdateObject>;
    uninstall(bundle: UpdateObject): Promise<void>;
    uninstallByBundleId(bundleId: string): Promise<void>;
    restart(): any;
}
export {};
