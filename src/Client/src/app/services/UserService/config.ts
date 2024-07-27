export interface UserData {
    userId: number,
    username: string,
    email?: string,
    phoneNumber?: string,
    dateCreated: Date,
    emailConfirmed?: boolean,
    twoFactorEnabled?: boolean
}

export interface ChangePasswordData{
    previousPassword: string,
    newPassword: string,
    sessionId: string
}

export interface SendCodeResetPasswordCodeResponse {
    sessionId: string
}

export interface ResendResetPasswordCodeResponse{
    sessionId:string
}

export interface ResendResetPasswordCodeData {
    sessionId:string
}

export interface VerifyResetPasswordCodeData {
    sessionId: string,
    verificationCode: string
}
