import React from 'react'
import { Platform, Text } from "react-native";
import { UpdateObject, UpdateCenterRepository, AgentInfo, UpdateError } from "@update-center/common";
import { UpdateCenterClient } from "./Client";

export interface ClientUIProps {
  renderCheckUpdates: (visible: boolean, close: Function) => React.Component;
  renderUpdateAvailable: (
    visible: boolean,
    close: Function,
    install: Function,
    update?: UpdateObject,
  ) => React.Component;
  renderNoUpdateAvailable: (
    visible: boolean,
    close: Function,
  ) => React.Component;
  renderDownloading: (
    visible: boolean,
    close: Function,
    update?: UpdateObject,
    progress?: number
  ) => React.Component;
  renderRestartNow: (
    visible: boolean,
    close: Function,
    restart: Function,
    update?: UpdateObject
  ) => React.Component;
  renderError: (
    visible: boolean,
    close: Function,
    error: Error,
    update?: UpdateObject
  ) => React.Component;
}

export interface ClientUIState {
  checkUpdatesVisible: boolean;
  updateAvailableVisible: boolean;
  noUpdatesAvailableVisible: boolean,
  downloadingVisible: boolean;
  restartNowVisible: boolean;
  errorVisible: boolean;
  currentUpdate: UpdateObject;
  currentProgress: number;
  error: Error;
}

export interface UpdatesConfigPlatform {
  agent: AgentInfo,
  repositories?: UpdateCenterRepository[]
}

export type UpdatesConfig = {
  repositories: UpdateCenterRepository[],
  android?: UpdatesConfigPlatform,
  ios?: UpdatesConfigPlatform,
}

export class UpdateCenterUI extends React.Component<ClientUIProps, ClientUIState> {
  state: ClientUIState = {
    checkUpdatesVisible: false,
    updateAvailableVisible: false,
    downloadingVisible: false,
    noUpdatesAvailableVisible: false,
    restartNowVisible: false,
    errorVisible: false,
    currentProgress: 0,
    currentUpdate: null,
    error: null,
  }
  private static _ref: React.RefObject<UpdateCenterUI>;
  static client: UpdateCenterClient;

  static get instance (): UpdateCenterUI {
    return this._ref.current
  }

  static configure(updatesConfig: UpdatesConfig) {
    const { repositories = [], android, ios } = updatesConfig;

    const platformRespositories = Platform.select({
      android: (android && android.repositories) || [],
      ios: (android && ios.repositories) || [],
      default: []
    });

    const config = {
      ...Platform.select({ android, ios }),
      repositories: platformRespositories.concat(repositories)
    };

    UpdateCenterUI.client = new UpdateCenterClient(config);
  }

  constructor (props) {
    super(props)

    if (!UpdateCenterUI.client) {
      console.warn(`Update Client not configured! Call ${this.constructor.name}.configure().`)
    }
  }

  async checkUpdates (dialog = true) {
    try {
      this.setState({
        checkUpdatesVisible: dialog,
        error: null,
        errorVisible: false
      })

      const update = await UpdateCenterUI.client.checkUpdates()
      
      this.setState({
        checkUpdatesVisible: false,
        updateAvailableVisible: !!update,
        noUpdatesAvailableVisible: !update,
        currentUpdate: update
      })
    } catch (error) {
      if (!(error instanceof UpdateError)) error = new UpdateError(error, 'CHECKUPDATES_FAIL')

      this.setState({
        checkUpdatesVisible: false,
        updateAvailableVisible: false,
        noUpdatesAvailableVisible: false,
        currentUpdate: null,
        error,
        errorVisible: true
      })
    }
  }

  async installUpdates (dialog = true, forceRestart = false) {
    try {
      this.setState({
        downloadingVisible: dialog
      })
  
      await UpdateCenterUI.client.install(this.state.currentUpdate, forceRestart, p => {
        this.setState({
          currentProgress: p.bytesWritten / p.contentLength
        })
      })
      
      this.setState({
        downloadingVisible: false,
        currentUpdate: null,
        updateAvailableVisible: false,
        restartNowVisible: dialog
      })
    } catch (error) {
      if (!(error instanceof UpdateError)) error = new UpdateError(error, 'INSTALL_FAILED')

      this.setState({
        downloadingVisible: false,
        currentUpdate: null,
        updateAvailableVisible: false,
        restartNowVisible: false,
        error,
        errorVisible: true
      })
    }
  }

  async restart (force = true) {
    try {
      if (force) return UpdateCenterUI.client.restart()    
      this.setState({
        restartNowVisible: true
      })
    } catch (error) {
      if (!(error instanceof UpdateError)) error = new UpdateError(error, 'RESTART_FAILED')

      this.setState({
        restartNowVisible: false,
        error,
        errorVisible: true
      })
    }
  }

  render() {
    const {
      children,
      renderCheckUpdates,
      renderDownloading,
      renderError,
      renderRestartNow,
      renderUpdateAvailable,
      renderNoUpdateAvailable
    } = this.props;
    const {
      checkUpdatesVisible,
      downloadingVisible,
      currentUpdate,
      currentProgress,
      errorVisible,
      error,
      restartNowVisible,
      updateAvailableVisible,
      noUpdatesAvailableVisible
    } = this.state;
    return (
      <React.Fragment>
        {children}
        {renderCheckUpdates && renderCheckUpdates(checkUpdatesVisible, () => {
          this.setState({
            checkUpdatesVisible: false
          });
        })}
        {renderDownloading && renderDownloading(
          downloadingVisible,
          () => {
            this.setState({
              downloadingVisible: false
            });
          },
          currentUpdate,
          currentProgress
        )}
        {renderError && renderError(
          errorVisible,
          () => {
            this.setState({
              errorVisible: false
            });
          },
          error,
          currentUpdate
        )}
        {renderRestartNow && renderRestartNow(
          restartNowVisible,
          () => {
            this.setState({
              restartNowVisible: false
            });
          },
          () => this.restart(true),
          currentUpdate
        )}
        {renderUpdateAvailable && renderUpdateAvailable(
          updateAvailableVisible,
          () => {
            this.setState({
              updateAvailableVisible: false
            });
          },
          () => this.installUpdates(),
          currentUpdate
        )}
        {renderNoUpdateAvailable && renderNoUpdateAvailable(
          noUpdatesAvailableVisible,
          () => {
            this.setState({
              noUpdatesAvailableVisible: false
            });
          }
        )}
        {renderError && renderError(
          errorVisible,
          () => {
            this.setState({
              errorVisible: false
            });
          },
          error
        )}
      </React.Fragment>
    );
  }
}
