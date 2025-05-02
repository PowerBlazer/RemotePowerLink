import { CreateProxyResult, EditProxyResult, ProxyData } from 'app/services/ProxyService/config/proxyConfig';

export class ProxyDataMapper {
    static fromEditProxyResult (editProxyResult: EditProxyResult): ProxyData {
        return {
            proxyId: editProxyResult.proxyId,
            hostname: editProxyResult.hostname,
            title: editProxyResult.title,
            identityId: editProxyResult.identityId,
            sshPort: editProxyResult.sshPort,
            dateCreated: editProxyResult.dateCreated
        }
    }

    static fromCreateProxyResult (createProxyResult: CreateProxyResult): ProxyData {
        return {
            proxyId: createProxyResult.proxyId,
            title: createProxyResult.title,
            hostname: createProxyResult.hostname,
            identityId: createProxyResult.identityId,
            sshPort: createProxyResult.sshPort,
            dateCreated: createProxyResult.dateCreated
        }
    }
}
