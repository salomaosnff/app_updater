"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
class BasicGuard {
    constructor({ users, scope = [], challenge = true, authorizer, authorizeAsync, realm }) {
        this.scope = scope;
        this.handler = express_basic_auth_1.default({
            users,
            challenge,
            authorizer,
            authorizeAsync,
            realm
        });
    }
}
exports.BasicGuard = BasicGuard;
//# sourceMappingURL=BasicGuard.js.map