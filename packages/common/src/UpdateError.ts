
export type UpdateErrorCode = 'CHECKUPDATES_FAIL' | 'DOWNLOAD_FAILED' | 'CHECKUPDATES_TIMEOUT' | 'INSTALL_FAILED' | 'RESTART_FAILED'| 'UNAUTHORIZED' | 'NETWORK_ERROR'

export class UpdateError extends Error {
  name = 'UpdateError'

  constructor (
    public error: Error,
    public code: UpdateErrorCode
  ) {
    super(error.message)

    this.stack = error.stack

    if (error instanceof UpdateError) {
      this.code = error.code
      this.error = error.error
      this.message = error.message
    }
  }
}