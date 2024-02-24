export interface ProxyData{
    id: number,
    title: string
}

export interface CreateProxyData{
    hostname:string,
    port?:number,
    title:string,
    identityId: number
}

export interface CreateProxyResult{
    proxyId:number,
    hostname:string,
    port?:number,
    title:string,
    identityId: number
}