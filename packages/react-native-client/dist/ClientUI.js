"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
class ClientUI extends react_1.Component {
    render() {
        const { children, renderCheckUpdates, renderDownloading, renderError, renderRestartNow, renderUpdateAvailable } = this.props;
        const { checkUpdatesVisible, downloadingVisible, currentUpdate, currentProgress, errorVisible, error, restartNowVisible, updateAvailableVisible } = this.state;
        return (react_1.default.createElement(react_1.Fragment, null,
            children,
            renderCheckUpdates(checkUpdatesVisible),
            renderDownloading(downloadingVisible, currentUpdate, currentProgress),
            renderError(errorVisible, error, currentUpdate),
            renderRestartNow(restartNowVisible, currentUpdate),
            renderUpdateAvailable(updateAvailableVisible, currentUpdate)));
    }
}
exports.ClientUI = ClientUI;
//# sourceMappingURL=ClientUI.js.map