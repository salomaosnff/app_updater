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
const react_1 = require("react");
const react_native_1 = require("react-native");
const common_1 = require("@update-center/common");
const Client_1 = require("./Client");
class UpdateCenterUI extends react_1.Component {
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
        if (UpdateCenterUI.client) {
            console.warn(`Update Client not configured! Call ${this.constructor.name}.configure().`);
        }
    }
    static get instance() {
        return this._ref.current;
    }
    static configure(updatesConfig) {
        const { repositories = [], android, ios } = updatesConfig;
        const platformRespositories = react_native_1.Platform.select({
            android: (android && android.repositories) || [],
            ios: (android && ios.repositories) || [],
            default: []
        });
        const config = Object.assign({}, react_native_1.Platform.select({ android, ios }), { repositories: platformRespositories.concat(repositories) });
        this.client = new Client_1.UpdateCenterClient(config);
        return this;
    }
    checkUpdates(dialog = true) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setState({
                    checkUpdatesVisible: dialog
                });
                const update = yield UpdateCenterUI.client.checkUpdates();
                this.setState({
                    checkUpdatesVisible: false,
                    updateAvailableVisible: !!update,
                    noUpdatesAvailableVisible: !update,
                    currentUpdate: update
                });
            }
            catch (err) {
                this.setState({
                    checkUpdatesVisible: false,
                    updateAvailableVisible: false,
                    noUpdatesAvailableVisible: false,
                    currentUpdate: null,
                    error: new common_1.UpdateError('Failed to check for updates', 'CHECKUPDATES_FAIL', err),
                    errorVisible: true
                });
            }
        });
    }
    installUpdates(dialog = true) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setState({
                    downloadingVisible: dialog
                });
                yield UpdateCenterUI.client.install(this.state.currentUpdate, p => {
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
                this.setState({
                    downloadingVisible: false,
                    currentUpdate: null,
                    updateAvailableVisible: false,
                    restartNowVisible: false,
                    error: new common_1.UpdateError('Failed to install updates', 'INSTALL_FAILED', error),
                    errorVisible: true
                });
            }
        });
    }
    restart(force = true) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!force)
                    return UpdateCenterUI.client.restart();
                this.setState({
                    restartNowVisible: true
                });
            }
            catch (error) {
                this.setState({
                    restartNowVisible: false,
                    error: new common_1.UpdateError('Failed to install updates', 'RESTART_FAILED', error),
                    errorVisible: true
                });
            }
        });
    }
    render() {
        const { children, renderCheckUpdates, renderDownloading, renderError, renderRestartNow, renderUpdateAvailable, renderNoUpdateAvailable } = this.props;
        const { checkUpdatesVisible, downloadingVisible, currentUpdate, currentProgress, errorVisible, error, restartNowVisible, updateAvailableVisible, noUpdatesAvailableVisible } = this.state;
        return (react_1.default.createElement(react_1.Fragment, null,
            children,
            renderCheckUpdates(checkUpdatesVisible, () => {
                this.setState({
                    checkUpdatesVisible: false
                });
            }),
            renderDownloading(downloadingVisible, () => {
                this.setState({
                    downloadingVisible: false
                });
            }, currentUpdate, currentProgress),
            renderError(errorVisible, () => {
                this.setState({
                    errorVisible: false
                });
            }, error, currentUpdate),
            renderRestartNow(restartNowVisible, () => {
                this.setState({
                    restartNowVisible: false
                });
            }, () => this.restart(true), currentUpdate),
            renderUpdateAvailable(updateAvailableVisible, () => {
                this.setState({
                    updateAvailableVisible: false
                });
            }, () => this.installUpdates(), currentUpdate),
            renderNoUpdateAvailable(noUpdatesAvailableVisible, () => {
                this.setState({
                    noUpdatesAvailableVisible: false
                });
            }),
            renderError(errorVisible, () => {
                this.setState({
                    errorVisible: false
                });
            }, error)));
    }
}
exports.UpdateCenterUI = UpdateCenterUI;
//# sourceMappingURL=ClientUI.js.map