import { RequestHandler, Request } from "express"
import BasicAuth, { safeCompare, AsyncAuthorizer, Authorizer, ValueOrFunction } from "express-basic-auth"
import { Guard, GuardScope } from "./interfaces/Guard.interface";

export interface BasicGuardOptions {
    scope           ?: GuardScope[],
    users: { [key:string]: string },
    challenge       ?: boolean,
    authorizer      ?: Authorizer | AsyncAuthorizer,
    authorizeAsync  ?: boolean
    realm           ?: ValueOrFunction<string>
}

export class BasicGuard implements Guard {
    public scope: GuardScope[]
    public handler: RequestHandler
    
    constructor ({
        users,
        scope = [],
        challenge = true,
        authorizer,
        authorizeAsync,
        realm
    }: BasicGuardOptions) {
        this.scope = scope
        this.handler = BasicAuth({
            users,
            challenge,
            authorizer,
            authorizeAsync,
            realm
        })
    }
}