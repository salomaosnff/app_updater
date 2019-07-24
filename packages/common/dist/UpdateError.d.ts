export declare type UpdateErrorCode = 'CHECKUPDATES_FAIL' | 'DOWNLOAD_FAILED' | 'INSTALL_FAILED' | 'RESTART_FAILED';
export declare class UpdateError extends Error {
    code: UpdateErrorCode;
    error: Error;
    name: string;
    constructor(message: string, code: UpdateErrorCode, error: Error);
}
