import { RequestHandler } from "express";

export type GuardScope = 'publish' | 'check-updates'

export interface Guard {
    scope  : GuardScope[]
    handler: RequestHandler
}