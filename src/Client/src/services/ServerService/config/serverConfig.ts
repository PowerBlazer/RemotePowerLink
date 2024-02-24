export interface CreateServerData {
    hostname:string,
    title:string,
    port?:number,
    startupCommand?:string
    identityId:number,
    proxyId?:number
}