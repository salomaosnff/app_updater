
export type UpdateErrorCode = 'CHECKUPDATES_FAIL' | 'DOWNLOAD_FAILED' | 'INSTALL_FAILED' | 'RESTART_FAILED'

export class UpdateError extends Error {
  name = 'UpdateError'

  constructor (
    message: string,
    public code: UpdateErrorCode,
    public error: Error
  ) {
    super(message)
  }
}