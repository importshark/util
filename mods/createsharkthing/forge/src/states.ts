import {
    statesobject,
    icon
} from "./types/states.types"

const states: statesobject = {
    "beforestart": {
        "div": {
            "type": "p",
            "inttype": "p",
            "class": []
        },
        "child": {
            "div": true,
            "class": [
                "text",
                "autobus",
                "size-standard"
            ],
            "id": "statustext",
            "innerHtml": "Setting things up..."
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "nonexistent"
            ],
            "src": icon.authicon,
            "alt": "Authorization image"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "info",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": ""
        },
        "image": {
            "div": false,
            "class": [
                "child",
                "pulsate-fwd"
            ],
            "src": icon.logoicon,
            "alt": "Shark Image",
            "id": "shark"
        },
        "imagediv": {
            "class": [],
            "id": "imgholder"
        },
        "actions": []
    },
    "start": {
        "div": {
            "type": "p",
            "inttype": "p",
            "class": []
        },
        "child": {
            "div": true,
            "class": [
                "text",
                "autobus",
                "size-standard"
            ],
            "id": "statustext",
            "innerHtml": "Setting things up..."
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "nonexistent"
            ],
            "src": icon.authicon,
            "alt": "Authorization image"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "info",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": ""
        },
        "image": {
            "div": false,
            "class": [
                "child",
                "pulsate-fwd"
            ],
            "src": icon.logoicon,
            "alt": "Shark Image",
            "id": "shark"
        },
        "imagediv": {
            "class": [],
            "id": "imgholder"
        },
        "actions": [{
            "action": "emit",
            "value": "proc-begin"
        }]
    },
    "preauthinfo": {
        "div": {
            "type": "p",
            "inttype": "button",
            "class": [
                "round"
            ]
        },
        "child": {
            "div": true,
            "class": [
                "text",
                "autobus",
                "errorbutton",
                "size-standard"
            ],
            "id": "statustext",
            "innerHtml": "Click to authorize."
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "helpericon",
                "pulsate-fwd"
            ],
            "src": icon.wifiicon,
            "alt": "Authorization image"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "info",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": "Authentication is required to play on servers and connect with other players. If for any reason you would rather not authenticate with Microsoft, please click the pulsing wifi icon for offline mode. Note: Offline mode still requires an internet connection."
        },
        "image": {
            "div": false,
            "class": [
                "error"
            ],
            "src": icon.authicon,
            "alt": "Authorization image",
            "id": "shark"
        },
        "imagediv": {
            "class": [],
            "id": "imgholder"
        },
        "actions": []
    },
    "preauth": {
        "div": {
            "type": "p",
            "inttype": "p",
            "class": []
        },
        "child": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "size-standard"
            ],
            "id": "statustext",
            "innerHtml": "Authentication window loading..."
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "nonexistent"
            ],
            "src": icon.logoicon,
            "alt": "Authorization image"
        },
        "info": {
            "div": true,
            "class": [
                "nonexistent"
            ],
            "id": "infotext",
            "innerHtml": ""
        },
        "image": {
            "div": false,
            "class": [
                "child",
                "pulsate-fwd"
            ],
            "src": icon.logoicon,
            "alt": "Shark logo image",
            "id": "shark"
        },
        "imagediv": {
            "class": [
                "error"
            ],
            "id": "imgholder"
        },
        "actions": [{
            "action": "emit",
            "value": "auth-run"
        }]
    },
    "postauth": {
        "div": {
            "type": "p",
            "inttype": "p",
            "class": []
        },
        "child": {
            "div": true,
            "class": [
                "text",
                "autobus",
                "size-standard"
            ],
            "id": "statustext",
            "innerHtml": "Processing authentication information..."
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "nonexistent"
            ],
            "src": icon.logoicon,
            "alt": "Authorization image"
        },
        "info": {
            "div": true,
            "class": [
                "nonexistent"
            ],
            "id": "infotext",
            "innerHtml": ""
        },
        "image": {
            "div": false,
            "class": [
                "child",
                "pulsate-fwd"
            ],
            "src": icon.logoicon,
            "alt": "Shark image",
            "id": "shark"
        },
        "imagediv": {
            "class": [],
            "id": "imgholder"
        },
        "actions": [{
            "action": "emit",
            "value": "auth-handle"
        }]
    },
    "prepmc": {
        "div": {
            "type": "p",
            "inttype": "p",
            "class": []
        },
        "child": {
            "div": true,
            "class": [
                "text",
                "autobus",
                "size-standard"
            ],
            "id": "statustext",
            "innerHtml": "Getting Minecraft ready..."
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "nonexistent"
            ],
            "src": icon.authicon,
            "alt": "Authorization image"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "info",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": ""
        },
        "image": {
            "div": false,
            "class": [
                "child",
                "pulsate-fwd"
            ],
            "src": icon.logoicon,
            "alt": "Shark Image",
            "id": "shark"
        },
        "imagediv": {
            "class": [],
            "id": "imgholder"
        },
        "actions": [{
            "action": "emit",
            "value": "prep-mc",
            "extra": "username"
        }]
    },
    "launchmc": {
        "div": {
            "type": "p",
            "inttype": "button",
            "class": []
        },
        "child": {
            "div": true,
            "class": [
                "text",
                "autobus",
                "size-standard"
            ],
            "id": "statustext",
            "innerHtml": "Launch"
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "nonexistent"
            ],
            "src": icon.authicon,
            "alt": "Authorization image"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "info",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": ""
        },
        "image": {
            "div": false,
            "class": [
                "child",
                "pulsate-fwd"
            ],
            "src": icon.logoicon,
            "alt": "Shark Image",
            "id": "shark"
        },
        "imagediv": {
            "class": [],
            "id": "imgholder"
        },
        "actions": []
    },
    "autherror404": {
        "div": {
            "type": "p",
            "inttype": "button",
            "class": [
                "round"
            ]
        },
        "child": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "errorbutton",
                "size-standard"
            ],
            "id": "statustext",
            "innerHtml": "Try again"
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "nonexistent"
            ],
            "src": icon.logoicon,
            "alt": "Authorization image"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": "No valid Minecraft: Java subscription was found on that Microsoft account. Please try again, or use a different account."
        },
        "image": {
            "div": false,
            "class": [
                "error"
            ],
            "src": icon.erroricon,
            "alt": "Shark Image",
            "id": "hide"
        },
        "imagediv": {
            "class": [
                "errorholder"
            ],
            "id": "imgholder"
        },
        "actions": []
    },
    "launching": {
        "div": {
            "type": "p",
            "inttype": "p",
            "class": ["nonexistent"]
        },
        "child": {
            "div": true,
            "class": [
                "nonexistent"
            ],
            "id": "statustext",
            "innerHtml": ""
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "nonexistent"
            ],
            "src": icon.authicon,
            "alt": "Authorization image"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "info",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": "Launching Minecraft. This might take a little bit."
        },
        "image": {
            "div": false,
            "class": [
                "error",
                "pulsate-fwd"
            ],
            "src": icon.logoicon,
            "alt": "Checkmark",
            "id": "shark"
        },
        "imagediv": {
            "class": ["errorholder"],
            "id": "imgholder"
        },
        "actions": [{
            "action": "emit",
            value: "launch-mc"
        }]
    },
    "launched": {
        "div": {
            "type": "p",
            "inttype": "p",
            "class": ["nonexistent"]
        },
        "child": {
            "div": true,
            "class": [
                "nonexistent"
            ],
            "id": "statustext",
            "innerHtml": ""
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "nonexistent"
            ],
            "src": icon.authicon,
            "alt": "Authorization image"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "info",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": "Minecraft is launching. You should see the window soon."
        },
        "image": {
            "div": false,
            "class": [
                "error"
            ],
            "src": icon.checkicon,
            "alt": "Checkmark",
            "id": "shark"
        },
        "imagediv": {
            "class": ["errorholder"],
            "id": "imgholder"
        },
        "actions": []
    },
    "typetime": {
        "div": {
            "type": "p",
            "inttype": "button",
            "class": []
        },
        "child": {
            "div": true,
            "class": [
                "text",
                "autobus",
                "size-standard"
            ],
            "id": "statustext",
            "innerHtml": "-><-"
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "helpericon"
            ],
            "src": icon.backicon,
            "alt": "Back button"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "info",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": "Please enter your Minecraft: Java username in full. This is case sensitive. When you are done, hit the button below."
        },
        "image": {
            "div": false,
            "class": [
                "error",
                "pulsate-fwd"
            ],
            "src": icon.logoicon,
            "alt": "Shark Image",
            "id": "shark"
        },
        "imagediv": {
            "class": [],
            "id": "imgholder"
        },
        "actions": [{
            "action": "set",
            "value": "initialtype",
            "extra": true
        }]
    },
    "error": {
        "div": {
            "type": "p",
            "inttype": "button",
            "class": [
                "round"
            ]
        },
        "child": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "errorbutton",
                "size-standard"
            ],
            "id": "statustext",
            "innerHtml": "View log"
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "nonexistent"
            ],
            "src": icon.logoicon,
            "alt": "Authorization image"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": "An error occured. You can view the log by clicking the button below. Please also upload the log to dropbox via the following link: "
        },
        "image": {
            "div": false,
            "class": [
                "error"
            ],
            "src": icon.erroricon,
            "alt": "Shark Image",
            "id": "hide"
        },
        "imagediv": {
            "class": [
                "errorholder"
            ],
            "id": "imgholder"
        },
        "actions": []
    },
    "report-creating": {
        "div": {
            "type": "p",
            "inttype": "p",
            "class": [
                "round"
            ]
        },
        "child": {
            "div": true,
            "class": [
                "noneistent"
            ],
            "id": "statustext",
            "innerHtml": "View log"
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "nonexistent"
            ],
            "src": icon.logoicon,
            "alt": "Authorization image"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": "A report is automatically being generated. If all goes well, this page should soon update. If nothing happens, or you get impatient, you can click the button below to do it manually."
        },
        "image": {
            "div": false,
            "class": [
                "error"
            ],
            "src": icon.loader,
            "alt": "Loader gif",
            "id": "hide"
        },
        "imagediv": {
            "class": [
                "errorholder"
            ],
            "id": "imgholder"
        },
        "actions": []
    },
    "report-finish": {
        "div": {
            "type": "p",
            "inttype": "button",
            "class": [
                "round"
            ]
        },
        "child": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "errorbutton",
                "size-standard"
            ],
            "id": "statustext",
            "innerHtml": "Open upload link"
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "nonexistent"
            ],
            "src": icon.logoicon,
            "alt": "Authorization image"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": "The error report is done! You should see a window pop up to reveal the file. You can upload it by clicking the button below."
        },
        "image": {
            "div": false,
            "class": [
                "error"
            ],
            "src": icon.erroricon,
            "alt": "Shark Image",
            "id": "hide"
        },
        "imagediv": {
            "class": [
                "errorholder"
            ],
            "id": "imgholder"
        },
        "actions": []
    },
    "report-fail": {
        "div": {
            "type": "p",
            "inttype": "button",
            "class": [
                "round"
            ]
        },
        "child": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "errorbutton",
                "size-standard"
            ],
            "id": "statustext",
            "innerHtml": "Get instructions"
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "nonexistent"
            ],
            "src": icon.logoicon,
            "alt": "Authorization image"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": "Building the log report failed! The button below should get you there, but here's the link to the instructions to manually get the logs: https://github.com/importshark/util/launcher/log.md"
        },
        "image": {
            "div": false,
            "class": [
                "error"
            ],
            "src": icon.erroricon,
            "alt": "Shark Image",
            "id": "hide"
        },
        "imagediv": {
            "class": [
                "errorholder"
            ],
            "id": "imgholder"
        },
        "actions": []
    },
    "typeerror500": {
        "div": {
            "type": "p",
            "inttype": "button",
            "class": [
                "round"
            ]
        },
        "child": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "errorbutton",
                "size-standard"
            ],
            "id": "statustext",
            "innerHtml": "Go back"
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "nonexistent"
            ],
            "src": icon.logoicon,
            "alt": "Authorization image"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": "Please enter a valid username."
        },
        "image": {
            "div": false,
            "class": [
                "error"
            ],
            "src": icon.erroricon,
            "alt": "Shark Image",
            "id": "hide"
        },
        "imagediv": {
            "class": [
                "errorholder"
            ],
            "id": "imgholder"
        },
        "actions": []
    },
    "typeerror404": {
        "div": {
            "type": "p",
            "inttype": "button",
            "class": [
                "round"
            ]
        },
        "child": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "errorbutton",
                "size-standard"
            ],
            "id": "statustext",
            "innerHtml": "Try again"
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "nonexistent"
            ],
            "src": icon.logoicon,
            "alt": "Authorization image"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": "The user you entered was not found! Please try reenteering your username."
        },
        "image": {
            "div": false,
            "class": [
                "error"
            ],
            "src": icon.erroricon,
            "alt": "Shark Image",
            "id": "hide"
        },
        "imagediv": {
            "class": [
                "errorholder"
            ],
            "id": "imgholder"
        },
        "actions": []
    },
    "wifilost": {
        "div": {
            "type": "p",
            "inttype": "button",
            "class": [
                "nonexistent"
            ]
        },
        "child": {
            "div": true,
            "class": [
                "nonexistent"
            ],
            "id": "statustext",
            "innerHtml": "Retry"
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "nonexistent"
            ],
            "src": icon.logoicon,
            "alt": "Authorization image"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": "Wi-Fi connectivity has been lost. This page will update as soon as it is restored."
        },
        "image": {
            "div": false,
            "class": [
                "error"
            ],
            "src": icon.erroricon,
            "alt": "Shark Image",
            "id": "hide"
        },
        "imagediv": {
            "class": [
                "errorholder"
            ],
            "id": "imgholder"
        },
        "actions": []
    },
    "loadfail": {
        "div": {
            "type": "p",
            "inttype": "button",
            "class": [
                "round"
            ]
        },
        "child": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "size-standard"
            ],
            "id": "statustext",
            "innerHtml": "Retry"
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "helpericon"
            ],
            "src": icon.backicon,
            "alt": "Authorization image"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": "Loading the authorization page failed. The error is:"
        },
        "image": {
            "div": false,
            "class": [
                "error"
            ],
            "src": icon.erroricon,
            "alt": "Shark Image",
            "id": "hide"
        },
        "imagediv": {
            "class": [
                "errorholder"
            ],
            "id": "imgholder"
        },
        "actions": []
    },
    "confirmacc": {
        "div": {
            "type": "p",
            "inttype": "p",
            "class": [
                "round"
            ]
        },
        "child": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "size-standard"
            ],
            "id": "statustext",
            "innerHtml": "Loading account..."
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "nonexistent"
            ],
            "src": icon.backicon,
            "alt": "Back icon"
        },
        "info": {
            "div": true,
            "class": [
                "nonexistent"
            ],
            "id": "infotext",
            "innerHtml": ""
        },
        "image": {
            "div": false,
            "class": [
                "error"
            ],
            "src": icon.loader,
            "alt": "Loader gif",
            "id": "hide"
        },
        "imagediv": {
            "class": [
                "errorholder"
            ],
            "id": "imgholder"
        },
        "actions": []
    },
    "confirmfail": {
        "div": {
            "type": "p",
            "inttype": "button",
            "class": [
                "round"
            ]
        },
        "child": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "size-standard"
            ],
            "id": "statustext",
            "innerHtml": "Continue"
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "helpericon"
            ],
            "src": icon.fileicon,
            "alt": "Back icon"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": "The account info failed to load, after three failed retries! You can log in without the saved account by clicking the button below, or you can submit an error report by hitting the file icon."
        },
        "image": {
            "div": false,
            "class": [
                "error"
            ],
            "src": icon.erroricon,
            "alt": "Error Image",
            "id": "hide"
        },
        "imagediv": {
            "class": [
                "errorholder"
            ],
            "id": "imgholder"
        },
        "actions": []
    },
    "confirmfinish": {
        "div": {
            "type": "p",
            "inttype": "button",
            "class": [
                "round"
            ]
        },
        "child": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "size-standard"
            ],
            "id": "statustext",
            "innerHtml": "Retry"
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "nonexistent"
            ],
            "src": icon.backicon,
            "alt": "Back icon"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": "The account data was loaded, but wasn't properly sent to the screen! :( Please hit the button below to retry"
        },
        "image": {
            "div": false,
            "class": [
                "error"
            ],
            "src": icon.erroricon,
            "alt": "Error Image",
            "id": "hide"
        },
        "imagediv": {
            "class": [
                "errorholder"
            ],
            "id": "imgholder"
        },
        "actions": []
    },
    "mcfail": {
        "div": {
            "type": "p",
            "inttype": "button",
            "class": [
                "round"
            ]
        },
        "child": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "size-standard"
            ],
            "id": "statustext",
            "innerHtml": "Retry"
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "helpericon"
            ],
            "src": icon.question,
            "alt": "Question icon"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": "Minecraft crashed or failed to setup! This might be solvable by retrying, or you can hit the question icon for other options."
        },
        "image": {
            "div": false,
            "class": [
                "error"
            ],
            "src": icon.erroricon,
            "alt": "Error Image",
            "id": "hide"
        },
        "imagediv": {
            "class": [
                "errorholder"
            ],
            "id": "imgholder"
        },
        "actions": []
    },
    "checksave": {
        "div": {
            "type": "p",
            "inttype": "button",
            "class": [
                "round"
            ]
        },
        "child": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "size-standard"
            ],
            "id": "statustext",
            "innerHtml": "Save account"
        },
        "offhandicon": {
            "id": "helpericon",
            "div": false,
            "class": [
                "helpericon"
            ],
            "src": icon.xicon,
            "alt": "Back icon"
        },
        "info": {
            "div": true,
            "class": [
                "autobus",
                "text",
                "size-small"
            ],
            "id": "infotext",
            "innerHtml": "Would you like to save your account for next time? If you are on a public computer please click the X icon. note: add x icon"
        },
        "image": {
            "div": false,
            "class": [
                "error"
            ],
            "src": icon.question,
            "alt": "Auth Image",
            "id": "hide"
        },
        "imagediv": {
            "class": [
                "errorholder"
            ],
            "id": "imgholder"
        },
        "actions": []
    }

}



export {
    states
}