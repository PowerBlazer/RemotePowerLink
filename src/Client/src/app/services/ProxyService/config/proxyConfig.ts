﻿export interface ProxyData {
    proxyId: number,
    title: string,
    hostname: string,
    sshPort?: number,
    identityId: number
}

export interface CreateProxyData {
    hostname: string,
    sshPort?: number,
    title: string,
    identityId: number
}

export interface CreateProxyResult {
    proxyId: number,
    hostname: string,
    sshPort?: number,
    title: string,
    identityId: number
}

export interface EditProxyData {
    proxyId: number,
    title: string,
    hostname: string,
    sshPort?: string,
    identityId: number
}

export interface EditProxyResult{
    proxyId: number,
    title: string,
    hostname: string,
    sshPort?: number,
    identityId: number
}