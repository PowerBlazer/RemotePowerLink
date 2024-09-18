export interface SendCodeToConfirmEmailModel {
    email: string
}

export interface SendCodeToConfirmEmailResponse {
    sessionId: string
}

export interface VerifyCodeToConfirmEmailModel {
    sessionId: string,
    verificationCode: string
}

export interface ResendCodeToConfirmEmailModel {
    sessionId: string,
    email: string
}

export interface ResendCodeToConfirmEmailResponse {
    sessionId: string
}

export interface SendCodeToUpdatePasswordResponse {
    sessionId: string
}

export interface ResendCodeToUpdatePasswordResponse {
    sessionId:string
}

export interface ResendCodeToUpdatePasswordData {
    sessionId:string
}

export interface VerifyCodeToUpdatePasswordData {
    sessionId: string,
    verificationCode: string
}
