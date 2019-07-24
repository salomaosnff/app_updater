

import { writeFile, readFile } from 'fs'
import { Request, Response, NextFunction, Application, static as serveFiles } from 'express';
import multer from 'multer';
import { Storage, AgentInfo, UpdateObject, Util } from '@update-center/core';

const rootUrl = (req: Request) => `${req.protocol}://${req.get('host')}`

interface JsonStorageOptions {
    app: Application
    minifyJson?: boolean
    filename?: string
    uploadsDir?: string
    baseUrl?: string
    filesRoute?: string
}

export default class JsonStorage implements Storage {
    private _upload: multer.Instance
    private _filename: string
    private _baseUrl: string
    private _minifyJson: boolean
    private _filesRoute: string

    constructor({
        app,
        filename = 'bundles.json',
        minifyJson = false,
        baseUrl,
        filesRoute = '/bundles',
        uploadsDir = 'uploads'
    }: JsonStorageOptions) {
        this._filename = filename
        this._minifyJson = minifyJson
        this._baseUrl = baseUrl
        this._filesRoute = filesRoute
        this._upload = multer({
            dest: uploadsDir
        })
        app.use(filesRoute, serveFiles(uploadsDir))
    }

    beforePublish(req: Request, res: Response, next: NextFunction) {
        this._upload.single('bundle')(req, res, next)
    }

    save(data: UpdateObject, req: Request, res: Response, next: NextFunction): Promise<boolean> {
        const baseUrl = this._baseUrl || rootUrl(req) + this._filesRoute
        data.bundleUrl = `${baseUrl}/${req.file.filename}`

        return new Promise(async (resolve, reject) => {
            readFile(this._filename, { encoding: 'utf8' }, (err, str: string) => {
                if (err) return reject(err)

                const json: UpdateObject[] = JSON.parse(str || "[]")

                json.unshift(data)

                const jsonString = this._minifyJson ? JSON.stringify(json) : JSON.stringify(json, null, 2)

                writeFile(this._filename, jsonString, (err) => {
                    if (err) return reject(err)
                    resolve(true)
                })
            })
        })
    }

    findUpdates(agent: AgentInfo): Promise<UpdateObject | null> {
        return new Promise((resolve, reject) => {
            readFile(this._filename, { encoding: 'utf8' }, (err, str: string) => {
                if (err) return reject(err)

                const json: UpdateObject[] = str ? JSON.parse(str) : []
                const result = json.find((item) => {
                    return item.name === agent.name &&
                        item.platform === agent.platform &&
                        item.versionCode > agent.versionCode &&
                        Util.versionSatisfies(agent.appVersion, item.appVersion || '*')
                })

                resolve(result || null)
            })
        })
    }
}