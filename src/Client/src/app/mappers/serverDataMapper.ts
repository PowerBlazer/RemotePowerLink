import { CreateServerResult, EditServerResult, ServerData } from 'app/services/ServerService/config/serverConfig';

export class ServerDataMapper {
    static fromEditServerResult (editServerResult: EditServerResult): ServerData {
        return {
            serverId: editServerResult.serverId,
            hostname: editServerResult.hostname,
            title: editServerResult.title,
            identityId: editServerResult.identityId,
            proxyId: editServerResult.proxyId,
            sshPort: editServerResult.sshPort,
            startupCommand: editServerResult.startupCommand,
            systemTypeIcon: editServerResult.systemTypeIcon,
            systemTypeName: editServerResult.systemTypeName,
            dateCreated: editServerResult.dateCreated,
            encodingId: editServerResult.encodingId
        };
    }

    static fromCreateServerResult (createServerResult: CreateServerResult): ServerData {
        return {
            serverId: createServerResult.serverId,
            title: createServerResult.title,
            sshPort: createServerResult.sshPort,
            hostname: createServerResult.hostname,
            identityId: createServerResult.identityId,
            proxyId: createServerResult.proxyId,
            startupCommand: createServerResult.startupCommand,
            systemTypeIcon: createServerResult.systemTypeIcon,
            systemTypeName: createServerResult.systemTypeName,
            dateCreated: createServerResult.dateCreated,
            encodingId: createServerResult.encodingId
        };
    }
}
