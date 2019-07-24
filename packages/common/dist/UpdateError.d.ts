export declare type UpdateErrorCode = 'CHECKUPDATES_FAIL' | 'DOWNLOAD_FAILED' | 'CHECKUPDATES_TIMEOUT' | 'INSTALL_FAILED' | 'RESTART_FAILED' | 'UNAUTHORIZED' | 'NETWORK_ERROR';
export declare class UpdateError extends Error {
    error: Error;
    code: UpdateErrorCode;
    name: string;
    constructor(error: Error, code: UpdateErrorCode);
}
