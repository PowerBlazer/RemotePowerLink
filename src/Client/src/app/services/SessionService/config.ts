export interface SessionInstanceData {
    id: number,
    userId: number,
    serverId: number,
    dateCreated: Date
}

export interface CreateSessionData {
    serverId: number
}
