"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
var GeneralType;
(function (GeneralType) {
    GeneralType[GeneralType["MSA"] = 0] = "MSA";
})(GeneralType || (GeneralType = {}));
function isMSASuccess(input) {
    let object = input;
    return object["token_type"] !== undefined;
}
function isSuccess(input, type) {
    switch (type) {
        case GeneralType.MSA:
            return isMSASuccess(input);
            break;
    }
}
function getMSA(code) {
    return new Promise((resolve, reject) => {
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
                redirect_uri: "http://localhost:3000/auth/redirect"
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
                x.json().then(resolve).catch(reject);
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
                x.json().then(resolve).catch(reject);
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
                x.json().then(resolve).catch(reject);
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
                x.json().then(resolve).catch(reject);
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
                x.json().then(resolve).catch(reject);
            }
            else {
                reject("Unauthorized");
            }
        });
    });
}
async function authenticate(code, update) {
    let msa = await getMSA(code);
    if (!isMSASuccess(msa)) {
        return update({ status: "Failed", data: msa, progress: 0, event: "MSAuth failed" });
    }
    update({ status: "Running", data: msa, progress: 0, event: "MSAuth suceeded." });
    let xbox;
    try {
        xbox = await getXbox(msa.access_token);
    }
    catch (error) {
        return update({ status: "Failed", data: xbox, progress: 0, event: "Xbox auth failed" });
    }
    update({ status: "Running", data: xbox, progress: 0, event: "Xbox auth suceeded." });
    let xsts;
    try {
        xsts = await getXSTS(xbox.Token);
    }
    catch (error) {
        return update({ status: "Failed", data: xsts, progress: 0, event: "Xbox XSTS auth failed" });
    }
    update({ status: "Running", data: xsts, progress: 0, event: "Xbox XSTS auth suceeded." });
    let mcauth;
    try {
        mcauth = await getMinecraftLogin(xsts.Token, xsts.DisplayClaims.xui[0].uhs);
    }
    catch (error) {
        return update({ status: "Failed", data: mcauth, progress: 0, event: "Minecraft auth failed" });
    }
    update({ status: "Running", data: mcauth, progress: 0, event: "Minecraft auth suceeded." });
    update({ status: "Done", data: mcauth, progress: 100, event: "Auth suceeded!" });
}
async function fastAuth(code, update) {
    update({ status: "Running", data: undefined, progress: 0, event: "Fastauth starting." });
    let msa = await getMSA(code); //Step 1
    if (!isMSASuccess(msa)) {
        update({ status: "Failed", data: msa, progress: 0, event: "MSAuth failed" });
        let data = {
            ownsGame: false
        };
        return data;
    }
    update({ status: "Running", data: msa, progress: 14 / 100, event: "MSAuth suceeded." });
    let xbox;
    try {
        xbox = await getXbox(msa.access_token); //Step 2
    }
    catch (error) {
        update({ status: "Failed", data: xbox, progress: 0, event: "Xbox auth failed" });
        let data = {
            msrefesh_token: msa.refresh_token,
            access_token: msa.access_token
        };
        return data;
    }
    update({ status: "Running", data: xbox, progress: 28 / 100, event: "Xbox auth suceeded." });
    let xsts;
    try {
        xsts = await getXSTS(xbox.Token); //Step 3
    }
    catch (error) {
        update({ status: "Failed", data: xsts, progress: 0, event: "Xbox XSTS auth failed" });
        let data = {
            msrefesh_token: msa.refresh_token,
            access_token: msa.access_token
        };
        return data;
    }
    update({ status: "Running", data: xsts, progress: 42 / 100, event: "Xbox XSTS auth suceeded." });
    let mcauth;
    try {
        mcauth = await getMinecraftLogin(xsts.Token, xsts.DisplayClaims.xui[0].uhs); //Step 4
    }
    catch (error) {
        update({ status: "Failed", data: mcauth, progress: 0, event: "Minecraft auth failed" });
        let data = {
            msrefesh_token: msa.refresh_token,
            access_token: msa.access_token
        };
        return data;
    }
    update({ status: "Running", data: mcauth, progress: 56 / 100, event: "Minecraft auth suceeded." });
    let ownership;
    try {
        ownership = await getOwnership(mcauth.access_token); //Step 5
    }
    catch (error) {
        update({ status: "Failed", data: ownership, progress: 0, event: "Checking ownership failed" });
        let data = {
            msrefesh_token: msa.refresh_token,
            access_token: msa.access_token,
            ownsGame: false
        };
        return data;
    }
    update({ status: "Running", data: ownership, progress: 70 / 100, event: "Checking ownership suceeded." });
    let profileData;
    try {
        profileData = await getProfile(mcauth.access_token); //Step 6
    }
    catch (error) {
        update({ status: "Failed", data: profileData, progress: 0, event: "Getting profile information failed" });
        let data = {
            msrefesh_token: msa.refresh_token,
            access_token: msa.access_token,
            ownsGame: false
        };
        return data;
    }
    update({ status: "Running", data: profileData, progress: 84 / 100, event: "Getting profile information suceeded." });
    let ownsGame = (ownership.items.findIndex(x => x.name == "game_minecraft") > -1) ? true : false;
    if (!ownsGame) {
        let returnData = {
            access_token: msa.access_token,
            msrefesh_token: msa.refresh_token,
            ownsGame: false
        };
        return returnData;
    }
    let activeskin = profileData.skins.find(x => x.state === "ACTIVE");
    let profile = {
        activeskin,
        capes: profileData.capes,
        id: profileData.id,
        name: profileData.name,
        profileActions: profileData.profileActions,
        skins: profileData.skins
    };
    let data = {
        access_token: msa.access_token,
        msrefesh_token: msa.refresh_token,
        ownsGame,
        profile,
        uuid: profile.id,
        username: profile.name
    };
    update({ status: "Done", data: data, progress: 1, event: "Fastauth suceeded!" }); //Step 7
    return data;
}
fastAuth("M.R3_SN1.93686fca-a4dd-5799-9ca8-3d2f65c047c2", (event) => {
    process.stdout.write(`\r${event.progress * 100}%`);
}).then(x => {
    console.log(x);
}).catch(console.log);
//refresh post client_id=CLIENT_ID_HERE&client_secret=CLIENT_SECRET_HERE&refresh_token=REFRESH_TOKEN_HERE&grant_type=refresh_token&redirect_uri=REDIRECT_URI_HERE
let nowret = {
    "IssueInstant": "2021-02-07T21:41:03.6735105Z",
    "NotAfter": "2021-02-08T13:41:03.6735105Z",
    "Token": "SAVE_THIS_TOKEN",
    "DisplayClaims": {
        "xui": [{
                "uhs": "SAME_USER_HASH_AS_BEFORE"
            }]
    }
};
(0, node_fetch_1.default)("https://api.minecraftservices.com/authentication/login_with_xbox", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "identityToken": "XBL3.0 x=USER_HASH_HERE;XSTS_TOKEN_FROM_PREVIOUS_STEP",
        "ensureLegacyEnabled": true
    })
});
let last = {
    "username": "81463707-c286-4440-a189-d383fcd9b194",
    "roles": [],
    "metadata": {},
    "access_token": "eyJraWQiOiJhYzg0YSIsImFsZyI6IkhTMjU2In0.eyJ4dWlkIjoiMjUzNTQ2NjY0Njc1NzI1NyIsImFnZyI6IkFkdWx0Iiwic3ViIjoiODE0NjM3MDctYzI4Ni00NDQwLWExODktZDM4M2ZjZDliMTk0IiwiYXV0aCI6IlhCT1giLCJucyI6ImRlZmF1bHQiLCJyb2xlcyI6W10sImlzcyI6ImF1dGhlbnRpY2F0aW9uIiwicGxhdGZvcm0iOiJVTktOT1dOIiwieXVpZCI6ImFmZjcwZjRmZDc1NTcxM2EwYjc3YTJiMGQ1ZDRjZTYxIiwibmJmIjoxNjc3ODc1MDYwLCJleHAiOjE2Nzc5NjE0NjAsImlhdCI6MTY3Nzg3NTA2MH0.BFNE5ZfUtsQQDPYv7xbDRmOio5eTYs0A8FjDhnRKBYc",
    "expires_in": 86400,
    "token_type": "Bearer"
};
(0, node_fetch_1.default)("https://api.minecraftservices.com/entitlements/mcstore", {
    headers: {
        Authorization: `Bearer ${last.access_token}`
    }
});
(0, node_fetch_1.default)("https://api.minecraftservices.com/minecraft/profile", {
    headers: {
        Authorization: `Bearer ${last.access_token}`
    }
});
let profileData = {
    "id": "11178be5ebed45dfa473d770fd085c6d",
    "name": "ASharkInTheVoid",
    "skins": [{
            "id": "9bc4c627-bc9e-4783-8cf9-8ba8be2219b1",
            "state": "ACTIVE",
            "url": "http://textures.minecraft.net/texture/31f477eb1a7beee631c2ca64d06f8f68fa93a3386d04452ab27f43acdf1b60cb",
            "variant": "CLASSIC"
        }],
    "capes": [{
            "id": "5af20372-79e0-4e1f-80f8-6bd8e3135995",
            "state": "INACTIVE",
            "url": "http://textures.minecraft.net/texture/2340c0e03dd24a11b15a8b33c2a7e9e32abb2051b2481d0ba7defd635ca7a933",
            "alias": "Migrator"
        }],
    "profileActions": {}
};
