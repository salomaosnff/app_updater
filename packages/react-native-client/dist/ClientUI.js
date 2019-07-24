var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import { Platform } from "react-native";
import { UpdateError } from "@update-center/common";
import { UpdateCenterClient } from "./Client";
export class UpdateCenterUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkUpdatesVisible: false,
            updateAvailableVisible: false,
            downloadingVisible: false,
            noUpdatesAvailableVisible: false,
            restartNowVisible: false,
            errorVisible: false,
            currentProgress: 0,
            currentUpdate: null,
            error: null,
        };
        if (!UpdateCenterUI.client) {
            console.warn(`Update Client not configured! Call ${this.constructor.name}.configure().`);
        }
    }
    static get instance() {
        return this._ref.current;
    }
    static configure(updatesConfig) {
        const { repositories = [], android, ios } = updatesConfig;
        const platformRespositories = Platform.select({
            android: (android && android.repositories) || [],
            ios: (android && ios.repositories) || [],
            default: []
        });
        const config = Object.assign({}, Platform.select({ android, ios }), { repositories: platformRespositories.concat(repositories) });
        UpdateCenterUI.client = new UpdateCenterClient(config);
    }
    checkUpdates(dialog = true) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setState({
                    checkUpdatesVisible: dialog,
                    error: null,
                    errorVisible: false
                });
                const update = yield UpdateCenterUI.client.checkUpdates();
                this.setState({
                    checkUpdatesVisible: false,
                    updateAvailableVisible: !!update,
                    noUpdatesAvailableVisible: !update,
                    currentUpdate: update
                });
            }
            catch (error) {
                if (!(error instanceof UpdateError))
                    error = new UpdateError(error, 'CHECKUPDATES_FAIL');
                this.setState({
                    checkUpdatesVisible: false,
                    updateAvailableVisible: false,
                    noUpdatesAvailableVisible: false,
                    currentUpdate: null,
                    error,
                    errorVisible: true
                });
            }
        });
    }
    installUpdates(dialog = true, forceRestart = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setState({
                    downloadingVisible: dialog
                });
                yield UpdateCenterUI.client.install(this.state.currentUpdate, forceRestart, p => {
                    this.setState({
                        currentProgress: p.bytesWritten / p.contentLength
                    });
                });
                this.setState({
                    downloadingVisible: false,
                    currentUpdate: null,
                    updateAvailableVisible: false,
                    restartNowVisible: dialog
                });
            }
            catch (error) {
                if (!(error instanceof UpdateError))
                    error = new UpdateError(error, 'INSTALL_FAILED');
                this.setState({
                    downloadingVisible: false,
                    currentUpdate: null,
                    updateAvailableVisible: false,
                    restartNowVisible: false,
                    error,
                    errorVisible: true
                });
            }
        });
    }
    restart(force = true) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (force)
                    return UpdateCenterUI.client.restart();
                this.setState({
                    restartNowVisible: true
                });
            }
            catch (error) {
                if (!(error instanceof UpdateError))
                    error = new UpdateError(error, 'RESTART_FAILED');
                this.setState({
                    restartNowVisible: false,
                    error,
                    errorVisible: true
                });
            }
        });
    }
    render() {
        const { children, renderCheckUpdates, renderDownloading, renderError, renderRestartNow, renderUpdateAvailable, renderNoUpdateAvailable } = this.props;
        const { checkUpdatesVisible, downloadingVisible, currentUpdate, currentProgress, errorVisible, error, restartNowVisible, updateAvailableVisible, noUpdatesAvailableVisible } = this.state;
        return (<React.Fragment>
        {children}
        {renderCheckUpdates && renderCheckUpdates(checkUpdatesVisible, () => {
            this.setState({
                checkUpdatesVisible: false
            });
        })}
        {renderDownloading && renderDownloading(downloadingVisible, () => {
            this.setState({
                downloadingVisible: false
            });
        }, currentUpdate, currentProgress)}
        {renderError && renderError(errorVisible, () => {
            this.setState({
                errorVisible: false
            });
        }, error, currentUpdate)}
        {renderRestartNow && renderRestartNow(restartNowVisible, () => {
            this.setState({
                restartNowVisible: false
            });
        }, () => this.restart(true), currentUpdate)}
        {renderUpdateAvailable && renderUpdateAvailable(updateAvailableVisible, () => {
            this.setState({
                updateAvailableVisible: false
            });
        }, () => this.installUpdates(), currentUpdate)}
        {renderNoUpdateAvailable && renderNoUpdateAvailable(noUpdatesAvailableVisible, () => {
            this.setState({
                noUpdatesAvailableVisible: false
            });
        })}
        {renderError && renderError(errorVisible, () => {
            this.setState({
                errorVisible: false
            });
        }, error)}
      </React.Fragment>);
    }
}
//# sourceMappingURL=ClientUI.js.map