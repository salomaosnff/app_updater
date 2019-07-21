import { RequestHandler } from "express";
export declare type GuardScope = 'publish' | 'check-updates';
export interface Guard {
    scope: GuardScope[];
    handler?: RequestHandler;
}
