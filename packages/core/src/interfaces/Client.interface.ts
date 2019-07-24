import { UpdateObject, AgentInfo } from "./Strategy.interface";

export type PromiseOr<T> = T | Promise<T>

export interface UpdateCenterRepository {
    name: string
    url : string
}

export interface UpdateCenterClientConfig {
    agent       : AgentInfo
    repositories: UpdateCenterRepository[]
}

export interface UpdateCenterClient {
    config: UpdateCenterClientConfig

    install(...args:any[]): PromiseOr<any>
    download(...args:any[]): PromiseOr<any>
    checkUpdates (...args:any[]): PromiseOr<UpdateObject>
    update (...args:any[]): PromiseOr<any>
    uninstall(...args:any[]): PromiseOr<any>
    restart(...args:any[]): PromiseOr<any>
}