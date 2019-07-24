"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UpdateError extends Error {
    constructor(message, code, error) {
        super(message);
        this.code = code;
        this.error = error;
        this.name = 'UpdateError';
    }
}
exports.UpdateError = UpdateError;
//# sourceMappingURL=UpdateError.js.map