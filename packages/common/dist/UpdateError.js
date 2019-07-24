"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UpdateError extends Error {
    constructor(error, code) {
        super(error.message);
        this.error = error;
        this.code = code;
        this.name = 'UpdateError';
        this.stack = error.stack;
        if (error instanceof UpdateError) {
            this.code = error.code;
            this.error = error.error;
            this.message = error.message;
        }
    }
}
exports.UpdateError = UpdateError;
//# sourceMappingURL=UpdateError.js.map