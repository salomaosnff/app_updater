import { Request } from "express"
import { Strategy, AgentInfo, UpdateObject } from "./interfaces/Strategy.interface"

export class DefaultStrategy implements Strategy {
    async getBundleInfo(req: Request): Promise<UpdateObject> {
        return {
            platform: req.body.platform,
            version: req.body.version,
            versionCode: +req.body.version_code,
            name: req.body.name,
            appVersion: req.body.app_version,
        }
    }

    async getAgentInfo(req: Request): Promise<AgentInfo> {
        const engines: { [key: string]: string } = {}

        // @ts-ignore
        for (let h in req.headers) {
            if (!h.startsWith('x-app-engine-')) continue
            const engineName = h.replace('x-app-engine-', '')
            engines[engineName] = req.get(h)
        }

        return {
            name: req.get('x-app-bundle-name'),
            version: req.get('x-app-bundle-version'),
            versionCode: +req.get('x-app-version-code'),
            appVersion: req.get('x-app-version'),
            platform: req.get('x-app-platform'),
        }
    }

    async validateBundle(data: UpdateObject, req?: Request): Promise<boolean> {
        return true
    }
}