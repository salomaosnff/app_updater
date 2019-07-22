import { RequestHandler } from "express";
import { AsyncAuthorizer, Authorizer, ValueOrFunction } from "express-basic-auth";
import { Guard, GuardScope } from "./interfaces/Guard.interface";
export interface BasicGuardOptions {
    scope?: GuardScope[];
    users: {
        [key: string]: string;
    };
    challenge?: boolean;
    authorizer?: Authorizer | AsyncAuthorizer;
    authorizeAsync?: boolean;
    realm?: ValueOrFunction<string>;
}
export declare class BasicGuard implements Guard {
    scope: GuardScope[];
    handler: RequestHandler;
    constructor({ users, scope, challenge, authorizer, authorizeAsync, realm }: BasicGuardOptions);
}
