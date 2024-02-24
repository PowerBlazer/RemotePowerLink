export interface IdentityData{
    id: number,
    title: string
}

export interface CreateIdentityData{
    title: string,
    username: string,
    password: string
}

export interface CreateIdentityResult{
    identityId: number,
    title: string,
    username: string,
    password: string
}