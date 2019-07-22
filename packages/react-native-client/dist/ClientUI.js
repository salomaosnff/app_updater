import React, { Component, Fragment } from 'react';
export class ClientUI extends Component {
    render() {
        const { children, renderCheckUpdates, renderDownloading, renderError, renderRestartNow, renderUpdateAvailable } = this.props;
        const { checkUpdatesVisible, downloadingVisible, currentUpdate, currentProgress, errorVisible, error, restartNowVisible, updateAvailableVisible } = this.state;
        return (React.createElement(Fragment, null,
            children,
            renderCheckUpdates(checkUpdatesVisible),
            renderDownloading(downloadingVisible, currentUpdate, currentProgress),
            renderError(errorVisible, error, currentUpdate),
            renderRestartNow(restartNowVisible, currentUpdate),
            renderUpdateAvailable(updateAvailableVisible, currentUpdate)));
    }
}
//# sourceMappingURL=ClientUI.js.map