"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = __importDefault(require("semver"));
var Util;
(function (Util) {
    function versionSatisfies(version, range) {
        return semver_1.default.satisfies(version, range);
    }
    Util.versionSatisfies = versionSatisfies;
})(Util = exports.Util || (exports.Util = {}));
//# sourceMappingURL=Util.js.map