import React, { Component, Fragment } from 'react'
import { UpdateObject } from '@update-center/core/src';

export interface ClientUIProps {
    renderCheckUpdates      : (visible:boolean) => Component
    renderUpdateAvailable   : (visible: boolean, update?: UpdateObject) => Component
    renderDownloading       : (visible: boolean, update?: UpdateObject, progress?: number) => Component
    renderRestartNow        : (visible: boolean, update?: UpdateObject) => Component
    renderError             : (visible: boolean, error ?: Error, update?: UpdateObject) => Component
}

export interface ClientUIState {
    checkUpdatesVisible     : boolean
    updateAvailableVisible  : boolean
    downloadingVisible      : boolean
    restartNowVisible       : boolean
    errorVisible            : boolean
    currentUpdate           : UpdateObject
    currentProgress         : number
    error                   : Error
}

export class ClientUI extends Component<ClientUIProps, ClientUIState> {
    render () {
        const {
            children,
            renderCheckUpdates,
            renderDownloading,
            renderError,
            renderRestartNow,
            renderUpdateAvailable
        } = this.props
        const {
            checkUpdatesVisible,
            downloadingVisible,
            currentUpdate,
            currentProgress,
            errorVisible,
            error,
            restartNowVisible,
            updateAvailableVisible
        } = this.state
        return (
            <Fragment>
                {children}
                {renderCheckUpdates(checkUpdatesVisible)}
                {renderDownloading(downloadingVisible, currentUpdate, currentProgress)}
                {renderError(errorVisible, error, currentUpdate)}
                {renderRestartNow(restartNowVisible, currentUpdate)}
                {renderUpdateAvailable(updateAvailableVisible, currentUpdate)}
            </Fragment>
        )
    }
}