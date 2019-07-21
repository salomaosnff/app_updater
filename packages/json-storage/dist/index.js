"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const core_1 = require("@update-center/core");
const rootUrl = (req) => `${req.protocol}://${req.get('host')}`;
class JsonStorage {
    constructor({ app, filename = 'bundles.json', minifyJson = false, baseUrl, filesRoute = '/bundles', uploadsDir = 'uploads' }) {
        this._filename = filename;
        this._minifyJson = minifyJson;
        this._baseUrl = baseUrl;
        this._filesRoute = filesRoute;
        this._upload = multer_1.default({
            dest: uploadsDir
        });
        app.use(filesRoute, express_1.static(uploadsDir));
    }
    beforePublish(req, res, next) {
        this._upload.single('bundle')(req, res, next);
    }
    save(data, req, res, next) {
        const baseUrl = this._baseUrl || rootUrl(req) + this._filesRoute;
        data.bundleUrl = `${baseUrl}/${req.file.filename}`;
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            fs_1.readFile(this._filename, { encoding: 'utf8' }, (err, str) => {
                if (err)
                    return reject(err);
                const json = JSON.parse(str || "[]");
                json.unshift(data);
                const jsonString = this._minifyJson ? JSON.stringify(json) : JSON.stringify(json, null, 2);
                fs_1.writeFile(this._filename, jsonString, (err) => {
                    if (err)
                        return reject(err);
                    resolve(true);
                });
            });
        }));
    }
    findUpdates(agent) {
        return new Promise((resolve, reject) => {
            fs_1.readFile(this._filename, { encoding: 'utf8' }, (err, str) => {
                if (err)
                    return reject(err);
                const json = JSON.parse(str || "[]");
                const result = json.find((item) => {
                    return item.name === agent.name &&
                        item.platform === agent.platform &&
                        item.versionCode > agent.versionCode &&
                        core_1.Util.versionSatisfies(agent.appVersion, item.appVersion || '*');
                });
                resolve(result || null);
            });
        });
    }
}
exports.default = JsonStorage;
//# sourceMappingURL=index.js.map