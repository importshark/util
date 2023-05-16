export interface AuthSuccess extends BaseAuth {
    mc: MinecraftSuccess,
    access_token: string,
}

export type AuthFail = Partial < BaseAuth >

    export interface QuickProfile extends MinecraftProfile {
        activeskin: MinecraftActiveSkin | undefined
    }

export interface BaseAuth {
    msaccess_token: string,
    msrefesh_token: string,
    expires_in: number
}

export interface OwnsGameFastAuth extends BaseAuth {
    uuid: string,
    username: string,
    access_token: string,
    ownsGame: true,
    profile: QuickProfile
}

export interface NotOwnsGameFastAuth extends BaseAuth {

    ownsGame: false
}
export interface FastAuthError {
    ownsGame: false,
    msaccess_token ? : string,
    msrefesh_token ? : string,
    expires_in ? : number
}

export interface MSAToken {
    "token_type": "bearer",
    "expires_in": number,
    "scope": string,
    "access_token": string,
    "refresh_token": string,
    "user_id": string,
    "foci": string
}

export interface MSAFailed {
    "error": string,
    "error_description": string,
    "correlation_id": string
}

export interface uhs {
    "uhs": string
}



export interface XboxSuccess {
    "IssueInstant": string,
    "NotAfter": string,
    "Token": string,
    "DisplayClaims": {
        "xui": Array < uhs >
    }
}

export interface XboxXSTSSucess {
    "IssueInstant": string,
    "NotAfter": string,
    "Token": string,
    "DisplayClaims": {
        "xui": Array < uhs >
    }
}


export type Status = "Running" | "Failed" | "Done"

export interface AuthEvent {
    progress: number,
    event: string,
    data: unknown,
    status: Status
}

export interface MinecraftSuccess {
    "username": string,
    "roles": Array < unknown > ,
    "metadata": {
        [key: string]: unknown
    },
    "access_token": string,
    "expires_in": number,
    "token_type": string
}

export type SkinVariant = "CLASSIC" | "SLIM"

export type SkinState = "ACTIVE" | "INACTIVE"

interface MinecraftSkin {
    "id": string,
    "state": SkinState,
    "url": string,
    "variant": SkinVariant
}

export interface MinecraftActiveSkin extends MinecraftSkin {
    "state": "ACTIVE"
}

export interface MinecraftCape {
    "id": string,
    "state": SkinState,
    "url": string,
    "alias": string
}

export interface MinecraftProfile {
    "id": string,
    "name": string,
    "skins": Array < MinecraftSkin > ,
    "capes": Array < MinecraftCape > ,
    "profileActions": NonNullable < unknown >
}

export interface OwnershipItem {
    "name": string,
    "signature": string
}

export interface GameOwnershipResponse {
    "items": Array < OwnershipItem > ,
    "signature": string,
    "keyId": string
}