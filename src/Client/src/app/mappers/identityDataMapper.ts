import {
    CreateIdentityResult,
    EditIdentityResult,
    IdentityData
} from 'app/services/IdentityService/config/identityConfig';

export class IdentityDataMapper {
    static fromEditIdentityResult (editIdentityResult: EditIdentityResult): IdentityData {
        return {
            identityId: editIdentityResult.identityId,
            title: editIdentityResult.title,
            username: editIdentityResult.username,
            dateCreated: editIdentityResult.dateCreated
        }
    }

    static fromCreateIdentityResult (createIdentityResult: CreateIdentityResult): IdentityData {
        return {
            title: createIdentityResult.title,
            identityId: createIdentityResult.identityId,
            username: createIdentityResult.username,
            dateCreated: createIdentityResult.dateCreated
        };
    }
}
