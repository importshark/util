export interface AuthInfo {
    username: string,
    uuid: string,
    access_token: string
}


export interface NoAuthInfo {
    username: string,
    uuid?: string
}
