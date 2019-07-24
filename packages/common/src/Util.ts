import semver from 'semver'

export namespace Util {
    export function versionSatisfies (version: string, range: string) {
        return semver.satisfies(version, range)
    }
}