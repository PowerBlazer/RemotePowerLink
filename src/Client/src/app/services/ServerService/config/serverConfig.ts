export interface CreateServerData {
    hostname: string,
    title: string,
    sshPort?: number,
    startupCommand?: string
    identityId: number,
    proxyId?: number
}

export interface EditServerData {
    serverId: number
    title: string
    hostname: string
    sshPort?: string
    startupCommand?: string
    identityId: number
    proxyId?: number
}

export interface EditServerResult {
    serverId: number
    title: string
    hostname: string
    sshPort?: number
    startupCommand?: string
    identityId: number
    proxyId?: number
    systemTypeName?: string
    systemTypeIcon?: string
}

export interface CreateServerResult {
    serverId: number,
    hostname: string,
    title: string,
    sshPort: number,
    startupCommand: string,
    identityId: number,
    proxyId: number,
    systemTypeName: string,
    systemTypeIcon: string
}

export interface ServerData{
    serverId: number,
    hostname: string,
    title: string,
    sshPort?: number,
    startupCommand?: string
    identityId: number,
    proxyId?: number,
    systemTypeName?: string,
    systemTypeIcon?: string
}
