export interface SendEmailVerificationModel {
    email: string
}

export interface SendEmailVerificationResponse {
    sessionId: string
}

export interface ConfirmEmailModel {
    sessionId: string,
    verificationCode: string
}

export interface RegistrationModel {
    sessionId: string,
    userName: string,
    password: string,
    passwordConfirm: string
}

export interface RegistrationResponse{
    accessToken: string,
    refreshToken: string
}

export interface ResendEmailVerificationModel {
    sessionId: string,
    email: string
}

export interface  ResendEmailVerificationResponse{
    sessionId: string
}
