"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLink = exports.fastAuth = exports.authenticate = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
function isMSASuccess(input) {
    const object = input;
    return object["token_type"] !== undefined;
}
function getMSA(code) {
    return new Promise((resolve) => {
        (0, node_fetch_1.default)(`https://login.live.com/oauth20_token.srf`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: "2b2b6b35-33e2-4666-82b4-5937c583c3f0",
                client_secret: "Dg48Q~5Jahsb_uwO4WkRQF0U6CtQm0e5zH0u.cl1",
                code,
                grant_type: "authorization_code",
                redirect_uri: `http://localhost:27356/auth/redirect`
            })
        }).then(x => {
            x.json().then(y => {
                resolve(y);
            });
        });
    });
}
function getXbox(code) {
    return new Promise((resolve, reject) => {
        (0, node_fetch_1.default)("https://user.auth.xboxlive.com/user/authenticate", {
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
                x.json().then((y) => {
                    resolve(y);
                }).catch(reject);
            }
            else {
                reject("Unauthorized");
            }
        });
    });
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
function getXSTS(code) {
    return new Promise((resolve, reject) => {
        (0, node_fetch_1.default)("https://xsts.auth.xboxlive.com/xsts/authorize", {
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
                x.json().then((y) => {
                    resolve(y);
                }).catch(reject);
            }
            else {
                reject("Unauthorized");
            }
        });
    });
}
function getMinecraftLogin(code, uhs) {
    return new Promise((resolve, reject) => {
        (0, node_fetch_1.default)("https://api.minecraftservices.com/authentication/login_with_xbox", {
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
                x.json().then((y) => {
                    resolve(y);
                }).catch(reject);
            }
            else {
                reject("Unauthorized");
            }
        });
    });
}
function getOwnership(mccode) {
    return new Promise((resolve, reject) => {
        (0, node_fetch_1.default)("https://api.minecraftservices.com/entitlements/mcstore", {
            headers: {
                authorization: `Bearer ${mccode}`
            },
            method: "GET"
        }).then(x => {
            if (x.status == 200) {
                x.json().then((y) => {
                    resolve(y);
                }).catch(reject);
            }
            else {
                reject("Unauthorized");
            }
        });
    });
}
function getProfile(mccode) {
    return new Promise((resolve, reject) => {
        (0, node_fetch_1.default)("https://api.minecraftservices.com/minecraft/profile", {
            headers: {
                authorization: `Bearer ${mccode}`
            },
            method: "GET"
        }).then(x => {
            if (x.status == 200) {
                x.json().then((y) => {
                    resolve(y);
                }).catch(reject);
            }
            else {
                reject("Unauthorized");
            }
        });
    });
}
function authenticate(code, update) {
    return __awaiter(this, void 0, void 0, function* () {
        const msa = yield getMSA(code);
        if (!isMSASuccess(msa)) {
            const data = {};
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
        });
        let xbox;
        try {
            xbox = yield getXbox(msa.access_token);
        }
        catch (error) {
            const data = {
                msaccess_token: msa.access_token,
                msrefesh_token: msa.refresh_token
            };
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
        });
        let xsts;
        try {
            xsts = yield getXSTS(xbox.Token);
        }
        catch (error) {
            const data = {
                msaccess_token: msa.access_token,
                msrefesh_token: msa.refresh_token
            };
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
        });
        let mcauth;
        try {
            mcauth = yield getMinecraftLogin(xsts.Token, xsts.DisplayClaims.xui[0].uhs);
        }
        catch (error) {
            const data = {
                msaccess_token: msa.access_token,
                msrefesh_token: msa.refresh_token
            };
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
        });
        update({
            status: "Done",
            data: mcauth,
            progress: 100,
            event: "Auth suceeded!"
        });
        const data = {
            msaccess_token: msa.access_token,
            access_token: mcauth.access_token,
            msrefesh_token: msa.refresh_token,
            mc: mcauth,
            expires_in: msa.expires_in
        };
        return data;
    });
}
exports.authenticate = authenticate;
function AuthSuccess(input) {
    const object = input;
    return object.mc !== undefined;
}
function fastAuth(code, update) {
    return __awaiter(this, void 0, void 0, function* () {
        update({
            status: "Running",
            data: undefined,
            progress: 0,
            event: "Fastauth starting."
        });
        const msa = yield getMSA(code); //Step 1
        if (!isMSASuccess(msa)) {
            update({
                status: "Failed",
                data: msa,
                progress: 0,
                event: "MSAuth failed"
            });
            const data = {
                ownsGame: false
            };
            return data;
        }
        update({
            status: "Running",
            data: msa,
            progress: 14 / 100,
            event: "MSAuth suceeded."
        });
        let xbox;
        try {
            xbox = yield getXbox(msa.access_token); //Step 2
        }
        catch (error) {
            update({
                status: "Failed",
                data: xbox,
                progress: 0,
                event: "Xbox auth failed"
            });
            const data = {
                msrefesh_token: msa.refresh_token,
                msaccess_token: msa.access_token,
                ownsGame: false
            };
            return data;
        }
        update({
            status: "Running",
            data: xbox,
            progress: 28 / 100,
            event: "Xbox auth suceeded."
        });
        let xsts;
        try {
            xsts = yield getXSTS(xbox.Token); //Step 3
        }
        catch (error) {
            update({
                status: "Failed",
                data: xsts,
                progress: 0,
                event: "Xbox XSTS auth failed"
            });
            const data = {
                msrefesh_token: msa.refresh_token,
                msaccess_token: msa.access_token,
                ownsGame: false
            };
            return data;
        }
        update({
            status: "Running",
            data: xsts,
            progress: 42 / 100,
            event: "Xbox XSTS auth suceeded."
        });
        let mcauth;
        try {
            mcauth = yield getMinecraftLogin(xsts.Token, xsts.DisplayClaims.xui[0].uhs); //Step 4
        }
        catch (error) {
            update({
                status: "Failed",
                data: mcauth,
                progress: 0,
                event: "Minecraft auth failed"
            });
            const data = {
                msrefesh_token: msa.refresh_token,
                msaccess_token: msa.access_token,
                ownsGame: false
            };
            return data;
        }
        update({
            status: "Running",
            data: mcauth,
            progress: 56 / 100,
            event: "Minecraft auth suceeded."
        });
        let ownership;
        try {
            ownership = yield getOwnership(mcauth.access_token); //Step 5
        }
        catch (error) {
            update({
                status: "Failed",
                data: ownership,
                progress: 0,
                event: "Checking ownership failed"
            });
            const data = {
                msrefesh_token: msa.refresh_token,
                msaccess_token: msa.access_token,
                ownsGame: false
            };
            return data;
        }
        update({
            status: "Running",
            data: ownership,
            progress: 70 / 100,
            event: "Checking ownership suceeded."
        });
        let profileData;
        try {
            profileData = yield getProfile(mcauth.access_token); //Step 6
        }
        catch (error) {
            update({
                status: "Failed",
                data: profileData,
                progress: 0,
                event: "Getting profile information failed"
            });
            const data = {
                msrefesh_token: msa.refresh_token,
                msaccess_token: msa.access_token,
                ownsGame: false
            };
            return data;
        }
        update({
            status: "Running",
            data: profileData,
            progress: 84 / 100,
            event: "Getting profile information suceeded."
        });
        const ownsGame = (ownership.items.findIndex(x => x.name == "game_minecraft") > -1) ? true : false;
        if (!ownsGame) {
            const returnData = {
                msaccess_token: msa.access_token,
                msrefesh_token: msa.refresh_token,
                ownsGame: false,
                expires_in: msa.expires_in
            };
            return returnData;
        }
        const activeskin = profileData.skins.find(x => x.state === "ACTIVE");
        const profile = {
            activeskin,
            capes: profileData.capes,
            id: profileData.id,
            name: profileData.name,
            profileActions: profileData.profileActions,
            skins: profileData.skins
        };
        const data = {
            msaccess_token: msa.access_token,
            access_token: mcauth.access_token,
            msrefesh_token: msa.refresh_token,
            ownsGame,
            profile,
            expires_in: msa.expires_in,
            uuid: profile.id,
            username: profile.name
        };
        update({
            status: "Done",
            data: data,
            progress: 1,
            event: "Fastauth suceeded!"
        }); //Step 7
        return data;
    });
}
exports.fastAuth = fastAuth;
function getLink() {
    return `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=2b2b6b35-33e2-4666-82b4-5937c583c3f0&response_type=code&redirect_uri=http://localhost:27356/auth/redirect&scope=XboxLive.signin%20offline_access&prompt=select_account `;
}
exports.getLink = getLink;
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
//# sourceMappingURL=auth.js.map