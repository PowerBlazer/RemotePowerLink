export interface LoginModel {
    email: string,
    password: string
}

export interface LoginResponse {
    accessToken?: string,
    refreshToken?: string
}

export interface RefreshTokenModel {
    accessToken: string,
    refreshToken: string
}

export interface RefreshTokenResponse {
    accessToken?: string,
    refreshToken?: string
}

export interface RegistrationModel {
    sessionId: string,
    userName: string,
    password: string,
    passwordConfirm: string
}

export interface RegistrationResponse {
    accessToken: string,
    refreshToken: string
}

