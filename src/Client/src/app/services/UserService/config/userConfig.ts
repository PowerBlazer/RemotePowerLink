export interface UserData {
    userId: number,
    username: string,
    email?: string,
    phoneNumber?: string,
    dateCreated: Date,
    emailConfirmed?: boolean,
    twoFactorEnabled?: boolean
}
