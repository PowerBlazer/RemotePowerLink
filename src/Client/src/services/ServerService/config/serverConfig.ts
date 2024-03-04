export interface CreateServerData {
    hostname: string,
    title: string,
    sshPort?: number,
    startupCommand?: string
    identityId: number,
    proxyId?: number
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
