export interface IdentityData {
    identityId: number,
    title: string,
    username: string
}

export interface CreateIdentityData {
    title: string,
    username: string,
    password: string
}

export interface CreateIdentityResult {
    identityId: number,
    title: string,
    username: string,
}

export interface EditIdentityData {
    identityId: number,
    title: string,
    username: string,
    password: string
}

export interface EditIdentityResult {
    identityId: number,
    title: string,
    username: string,
}
