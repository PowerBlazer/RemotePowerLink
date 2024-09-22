
//Модели подтверждения почты

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

//------------------------------------------------------

//Модели изменения пароля пользователя
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

//--------------------------------------------------------

//Модели запрос на изменения почты 
export interface SendCodeToChangeEmailResponse {
    sessionId: string
}

export interface ResendCodeToChangeEmailResponse {
    sessionId:string
}

export interface ResendCodeToChangeEmailData {
    sessionId:string
}

export interface VerifyCodeToChangeEmailData {
    sessionId: string,
    verificationCode: string
}

//--------------------------------------------------------

export interface SendCodeToConfirmNewEmailData {
    newEmail: string,
    sessionId: string
}

export interface SendCodeToConfirmNewEmailResponse {
    sessionId: string
}

export interface ResendCodeToConfirmNewEmailResponse {
    sessionId:string
}

export interface ResendCodeToConfirmNewEmailData {
    sessionId:string
}

export interface VerifyCodeToConfirmNewEmailData {
    sessionId: string,
    verificationCode: string
}