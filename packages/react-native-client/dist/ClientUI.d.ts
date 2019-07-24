import { Component } from "react";
import { UpdateObject, UpdateCenterRepository, AgentInfo } from "@update-center/common";
import { UpdateCenterClient } from "./Client";
export interface ClientUIProps {
    renderCheckUpdates: (visible: boolean, close: Function) => Component;
    renderUpdateAvailable: (visible: boolean, close: Function, install: Function, update?: UpdateObject) => Component;
    renderNoUpdateAvailable: (visible: boolean, close: Function) => Component;
    renderDownloading: (visible: boolean, close: Function, update?: UpdateObject, progress?: number) => Component;
    renderRestartNow: (visible: boolean, close: Function, restart: Function, update?: UpdateObject) => Component;
    renderError: (visible: boolean, close: Function, error: Error, update?: UpdateObject) => Component;
}
export interface ClientUIState {
    checkUpdatesVisible: boolean;
    updateAvailableVisible: boolean;
    noUpdatesAvailableVisible: boolean;
    downloadingVisible: boolean;
    restartNowVisible: boolean;
    errorVisible: boolean;
    currentUpdate: UpdateObject;
    currentProgress: number;
    error: Error;
}
export interface UpdatesConfigPlatform {
    agent: AgentInfo;
    repositories?: UpdateCenterRepository[];
}
export declare type UpdatesConfig = {
    repositories: UpdateCenterRepository[];
    android?: UpdatesConfigPlatform;
    ios?: UpdatesConfigPlatform;
};
export declare class UpdateCenterUI extends Component<ClientUIProps, ClientUIState> {
    state: ClientUIState;
    private static _ref;
    static client: UpdateCenterClient;
    static readonly instance: UpdateCenterUI;
    static configure(updatesConfig: UpdatesConfig): typeof UpdateCenterUI;
    constructor(props: any);
    checkUpdates(dialog?: boolean): Promise<void>;
    installUpdates(dialog?: boolean): Promise<void>;
    restart(force?: boolean): Promise<any>;
    render(): JSX.Element;
}
