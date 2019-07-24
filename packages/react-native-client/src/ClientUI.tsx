import React, { Component, Fragment } from "react";
import { Platform } from "react-native";
import { UpdateObject, UpdateCenterRepository, AgentInfo } from "@update-center/common";
import { UpdateCenterClient } from "./Client";

export interface ClientUIProps {
  renderCheckUpdates: (visible: boolean, close: Function) => Component;
  renderUpdateAvailable: (
    visible: boolean,
    close: Function,
    update?: UpdateObject
  ) => Component;
  renderDownloading: (
    visible: boolean,
    close: Function,
    update?: UpdateObject,
    progress?: number
  ) => Component;
  renderRestartNow: (
    visible: boolean,
    close: Function,
    update?: UpdateObject
  ) => Component;
  renderError: (
    visible: boolean,
    close: Function,
    error?: Error,
    update?: UpdateObject
  ) => Component;
}

export interface ClientUIState {
  checkUpdatesVisible: boolean;
  updateAvailableVisible: boolean;
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

export class UpdateCenterUI extends Component<ClientUIProps, ClientUIState> {
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

    this.client = new UpdateCenterClient(config);

    return this
  }

  constructor (props) {
    super(props)

    if (UpdateCenterUI.client) {
      console.warn(`Update Client not configured! Call ${this.constructor.name}.configure().`)
    }
  }

  async checkUpdates (dialog = true) {
    this.setState({
      checkUpdatesVisible: dialog
    })

    const update = await UpdateCenterUI.client.checkUpdates()
    
    this.setState({
      checkUpdatesVisible: false,
      updateAvailableVisible: !!update,
      currentUpdate: update
    })
  }

  async installUpdates (dialog = true) {
    this.setState({
      downloadingVisible: dialog
    })

    await UpdateCenterUI.client.install(this.state.currentUpdate, p => {
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
  }

  async restart (force = true) {
    if (!force) return UpdateCenterUI.client.restart()    
    this.setState({
      restartNowVisible: true
    })
  }

  render() {
    const {
      children,
      renderCheckUpdates,
      renderDownloading,
      renderError,
      renderRestartNow,
      renderUpdateAvailable
    } = this.props;
    const {
      checkUpdatesVisible,
      downloadingVisible,
      currentUpdate,
      currentProgress,
      errorVisible,
      error,
      restartNowVisible,
      updateAvailableVisible
    } = this.state;
    return (
      <Fragment>
        {children}
        {renderCheckUpdates(checkUpdatesVisible, () => {
          this.setState({
            checkUpdatesVisible: false
          });
        })}
        {renderDownloading(
          downloadingVisible,
          () => {
            this.setState({
              downloadingVisible: false
            });
          },
          currentUpdate,
          currentProgress
        )}
        {renderError(
          errorVisible,
          () => {
            this.setState({
              errorVisible: false
            });
          },
          error,
          currentUpdate
        )}
        {renderRestartNow(
          restartNowVisible,
          () => {
            this.setState({
              restartNowVisible: false
            });
          },
          currentUpdate
        )}
        {renderUpdateAvailable(
          updateAvailableVisible,
          () => {
            this.setState({
              updateAvailableVisible: false
            });
          },
          currentUpdate
        )}
      </Fragment>
    );
  }
}
