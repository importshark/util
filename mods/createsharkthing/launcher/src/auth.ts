import fetch from "node-fetch"
import {
    get
} from "./util"
import {
    join
} from "path"

import {AuthSuccess, AuthFail, FastAuthError, GameOwnershipResponse, MSAFailed, MSAToken, MinecraftActiveSkin, MinecraftProfile, MinecraftSuccess, NotOwnsGameFastAuth, OwnsGameFastAuth, QuickProfile, XboxSuccess, XboxXSTSSucess, AuthEvent } from "./types/auth.types"



function isMSASuccess(input: MSAToken | MSAFailed): input is MSAToken {
    let object = < MSAToken > input
    return object["token_type"] !== undefined;
}







function getMSA(code: string): Promise < MSAToken | MSAFailed > {
    return new Promise((resolve, reject) => {


        fetch(`https://login.live.com/oauth20_token.srf`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: "2b2b6b35-33e2-4666-82b4-5937c583c3f0",
                client_secret: "Dg48Q~5Jahsb_uwO4WkRQF0U6CtQm0e5zH0u.cl1",
                code,
                grant_type: "authorization_code",
                redirect_uri: "http://localhost:3000/auth/redirect"
            })
        }).then(x => {
            x.json().then(y => {
                resolve(y)
            })
        })
    })
}

function getXbox(code: string): Promise < XboxSuccess > {
    return new Promise((resolve, reject) => {



        fetch("https://user.auth.xboxlive.com/user/authenticate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "Properties": {
                    "AuthMethod": "RPS",
                    "SiteName": "user.auth.xboxlive.com",
                    "RpsTicket": "d=" + code // you may need to add "d=" before the access token as mentioned earlier
                },
                "RelyingParty": "http://auth.xboxlive.com",
                "TokenType": "JWT"
            })
        }).then(x => {

            if (x.status == 200) {
                x.json().then(resolve).catch(reject)
            } else {
                reject("Unauthorized")
            }
        })
    })
}

/*login with xbox return
{
    "username": "81463707-c286-4440-a189-d383fcd9b194",
    "roles": [],
    "metadata": {},
    "access_token": "eyJraWQiOiJhYzg0YSIsImFsZyI6IkhTMjU2In0.eyJ4dWlkIjoiMjUzNTQ2NjY0Njc1NzI1NyIsImFnZyI6IkFkdWx0Iiwic3ViIjoiODE0NjM3MDctYzI4Ni00NDQwLWExODktZDM4M2ZjZDliMTk0IiwiYXV0aCI6IlhCT1giLCJucyI6ImRlZmF1bHQiLCJyb2xlcyI6W10sImlzcyI6ImF1dGhlbnRpY2F0aW9uIiwicGxhdGZvcm0iOiJVTktOT1dOIiwieXVpZCI6ImFmZjcwZjRmZDc1NTcxM2EwYjc3YTJiMGQ1ZDRjZTYxIiwibmJmIjoxNjc3ODg5MzMxLCJleHAiOjE2Nzc5NzU3MzEsImlhdCI6MTY3Nzg4OTMzMX0.NhCl601EtLpmQzm-foznHclm1890kCyjLGjAYBk_QPA",
    "expires_in": 86400,
    "token_type": "Bearer"
}
*/




function getXSTS(code: string): Promise < XboxXSTSSucess > {
    return new Promise((resolve, reject) => {



        fetch("https://xsts.auth.xboxlive.com/xsts/authorize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "Properties": {
                    "SandboxId": "RETAIL",
                    "UserTokens": [
                        code
                    ]
                },
                "RelyingParty": "rp://api.minecraftservices.com/",
                "TokenType": "JWT"
            })
        }).then(x => {

            if (x.status == 200) {
                x.json().then(resolve).catch(reject)
            } else {
                reject("Unauthorized")
            }
        })
    })
}


function getMinecraftLogin(code: string, uhs: string): Promise < MinecraftSuccess > {
    return new Promise((resolve, reject) => {



        fetch("https://api.minecraftservices.com/authentication/login_with_xbox", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "identityToken": `XBL3.0 x=${uhs};${code}`,
                "ensureLegacyEnabled": true
            })
        }).then(x => {

            if (x.status == 200) {
                x.json().then(resolve).catch(reject)
            } else {
                reject("Unauthorized")
            }
        })
    })
}



function getOwnership(mccode: string): Promise < GameOwnershipResponse > {
    return new Promise((resolve, reject) => {



        fetch("https://api.minecraftservices.com/entitlements/mcstore", {
            headers: {
                authorization: `Bearer ${mccode}`
            },
            method: "GET"
        }).then(x => {

            if (x.status == 200) {
                x.json().then(resolve).catch(reject)
            } else {
                reject("Unauthorized")
            }
        })
    })
}

function getProfile(mccode: string): Promise < MinecraftProfile > {
    return new Promise((resolve, reject) => {



        fetch("https://api.minecraftservices.com/minecraft/profile", {
            headers: {
                authorization: `Bearer ${mccode}`
            },
            method: "GET"
        }).then(x => {

            if (x.status == 200) {
                x.json().then(resolve).catch(reject)
            } else {
                reject("Unauthorized")
            }
        })
    })
}




export async function authenticate(code: string, update: (event: AuthEvent) => void): Promise < AuthSuccess | AuthFail > {
    let msa = await getMSA(code)
    if (!isMSASuccess(msa)) {
        let data: AuthFail = {

        }
        update({
            status: "Failed",
            data: msa,
            progress: 0,
            event: "MSAuth failed"
        });
        return data;
    }

    update({
        status: "Running",
        data: msa,
        progress: 0,
        event: "MSAuth suceeded."
    })
    let xbox;
    try {
        xbox = await getXbox(msa.access_token)

    } catch (error) {
        let data: AuthFail = {
            msaccess_token: msa.access_token,
            msrefesh_token: msa.refresh_token
        }
        update({
            status: "Failed",
            data: xbox,
            progress: 0,
            event: "Xbox auth failed"
        });
        return data;
    }
    update({
        status: "Running",
        data: xbox,
        progress: 0,
        event: "Xbox auth suceeded."
    })

    let xsts;
    try {
        xsts = await getXSTS(xbox.Token)

    } catch (error) {
        let data: AuthFail = {
            msaccess_token: msa.access_token,
            msrefesh_token: msa.refresh_token
        }
        update({
            status: "Failed",
            data: xsts,
            progress: 0,
            event: "Xbox XSTS auth failed"
        });
        return data;
    }
    update({
        status: "Running",
        data: xsts,
        progress: 0,
        event: "Xbox XSTS auth suceeded."
    })

    let mcauth;
    try {
        mcauth = await getMinecraftLogin(xsts.Token, xsts.DisplayClaims.xui[0].uhs)

    } catch (error) {
        let data: AuthFail = {
            msaccess_token: msa.access_token,
            msrefesh_token: msa.refresh_token
        }
        update({
            status: "Failed",
            data: mcauth,
            progress: 0,
            event: "Minecraft auth failed"
        });
        return data;
    }
    update({
        status: "Running",
        data: mcauth,
        progress: 0,
        event: "Minecraft auth suceeded."
    })


    update({
        status: "Done",
        data: mcauth,
        progress: 100,
        event: "Auth suceeded!"
    })

    let data: AuthSuccess = {
        msaccess_token: msa.access_token,
        access_token: mcauth.access_token,
        msrefesh_token: msa.refresh_token,
        mc: mcauth,
        expires_in: msa.expires_in
    }
    return data;

}






    function fastAuthSuccess(input: OwnsGameFastAuth | NotOwnsGameFastAuth | FastAuthError): input is OwnsGameFastAuth {
        let object = < OwnsGameFastAuth > input;
        return object.ownsGame == true;
    }

function AuthSuccess(input: AuthSuccess | AuthFail): input is AuthSuccess {
    let object = < AuthSuccess > input;
    return object.mc !== undefined;
}

export async function fastAuth(code: string, update: (event: AuthEvent) => void): Promise < OwnsGameFastAuth | NotOwnsGameFastAuth | FastAuthError > {
    update({
        status: "Running",
        data: undefined,
        progress: 0,
        event: "Fastauth starting."
    })
    let msa = await getMSA(code) //Step 1
    if (!isMSASuccess(msa)) {
        update({
            status: "Failed",
            data: msa,
            progress: 0,
            event: "MSAuth failed"
        });
        let data: FastAuthError = {
            ownsGame: false
        }
        return data;
    }

    update({
        status: "Running",
        data: msa,
        progress: 14 / 100,
        event: "MSAuth suceeded."
    })
    let xbox;
    try {
        xbox = await getXbox(msa.access_token) //Step 2

    } catch (error) {
        update({
            status: "Failed",
            data: xbox,
            progress: 0,
            event: "Xbox auth failed"
        });
        let data: FastAuthError = {
            msrefesh_token: msa.refresh_token,
            msaccess_token: msa.access_token
        }
        return data;
    }
    update({
        status: "Running",
        data: xbox,
        progress: 28 / 100,
        event: "Xbox auth suceeded."
    })

    let xsts;
    try {
        xsts = await getXSTS(xbox.Token) //Step 3

    } catch (error) {
        update({
            status: "Failed",
            data: xsts,
            progress: 0,
            event: "Xbox XSTS auth failed"
        });
        let data: FastAuthError = {
            msrefesh_token: msa.refresh_token,
            msaccess_token: msa.access_token
        }
        return data;
    }
    update({
        status: "Running",
        data: xsts,
        progress: 42 / 100,
        event: "Xbox XSTS auth suceeded."
    })

    let mcauth;
    try {
        mcauth = await getMinecraftLogin(xsts.Token, xsts.DisplayClaims.xui[0].uhs) //Step 4

    } catch (error) {
        update({
            status: "Failed",
            data: mcauth,
            progress: 0,
            event: "Minecraft auth failed"
        });
        let data: FastAuthError = {
            msrefesh_token: msa.refresh_token,
            msaccess_token: msa.access_token
        }
        return data;
    }
    update({
        status: "Running",
        data: mcauth,
        progress: 56 / 100,
        event: "Minecraft auth suceeded."
    })

    let ownership;
    try {
        ownership = await getOwnership(mcauth.access_token) //Step 5

    } catch (error) {
        update({
            status: "Failed",
            data: ownership,
            progress: 0,
            event: "Checking ownership failed"
        });
        let data: FastAuthError = {
            msrefesh_token: msa.refresh_token,
            msaccess_token: msa.access_token,
            ownsGame: false
        }
        return data;
    }
    update({
        status: "Running",
        data: ownership,
        progress: 70 / 100,
        event: "Checking ownership suceeded."
    })


    let profileData;
    try {
        profileData = await getProfile(mcauth.access_token) //Step 6

    } catch (error) {
        update({
            status: "Failed",
            data: profileData,
            progress: 0,
            event: "Getting profile information failed"
        });
        let data: FastAuthError = {
            msrefesh_token: msa.refresh_token,
            msaccess_token: msa.access_token,
            ownsGame: false
        }
        return data;
    }
    update({
        status: "Running",
        data: profileData,
        progress: 84 / 100,
        event: "Getting profile information suceeded."
    })

    let ownsGame = (ownership.items.findIndex(x => x.name == "game_minecraft") > -1) ? true : false

    if (!ownsGame) {
        let returnData: NotOwnsGameFastAuth = {
            msaccess_token: msa.access_token,
            msrefesh_token: msa.refresh_token,
            ownsGame: false,
            expires_in: msa.expires_in
        }
        return returnData;
    }

    let activeskin = < MinecraftActiveSkin > profileData.skins.find(x => x.state === "ACTIVE")

    let profile: QuickProfile = {
        activeskin,
        capes: profileData.capes,
        id: profileData.id,
        name: profileData.name,
        profileActions: profileData.profileActions,
        skins: profileData.skins
    }


    let data: OwnsGameFastAuth = {
        msaccess_token: msa.access_token,
        access_token: mcauth.access_token,
        msrefesh_token: msa.refresh_token,
        ownsGame,
        profile,
        expires_in: msa.expires_in,
        uuid: profile.id,
        username: profile.name
    }

    update({
        status: "Done",
        data: data,
        progress: 1,
        event: "Fastauth suceeded!"
    }) //Step 7

    return data;





}

export function getLink() {
    return `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=2b2b6b35-33e2-4666-82b4-5937c583c3f0&response_type=code&redirect_uri=http://localhost:3000/auth/redirect&scope=XboxLive.signin%20offline_access&prompt=select_account `
}

export function getBrowser() {
    let browser = get();
    if (!browser) return false;
    return join(browser.browser, browser.app)
}

/*
fastAuth("M.R3_SN1.00e8fcb3-7cd5-5e14-4526-6ea97f319673", (event) => {
    console.log(event)


}).then(x => {
    console.log("dun")
    console.log(fastAuthSuccess(x))
    console.log(x)
}).catch(console.log)




*/




//refresh post client_id=CLIENT_ID_HERE&client_secret=CLIENT_SECRET_HERE&refresh_token=REFRESH_TOKEN_HERE&grant_type=refresh_token&redirect_uri=REDIRECT_URI_HERE