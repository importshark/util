const authicon =  require("../images/auth.png")
const backicon = require("../images/back.png")
const checkicon = require("../images/check.png")
const erroricon = require("../images/error.png")
const logoicon = require("../images/logo.png")
const wifiicon = require("../images/wifi.png")

module.exports = { 
  states: {
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
        "src": authicon,
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
        "src": logoicon,
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
        "src": authicon,
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
        "src": logoicon,
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
        "src": wifiicon,
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
        "src": authicon,
        "alt": "Authorization image",
        "id": "shark"
      },
      "imagediv": {
        "class": [],
        "id": "imgholder"
      },
      "actions": [
      ]
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
        "src": logoicon,
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
        "src": logoicon,
        "alt": "Shark logo image",
        "id": "shark"
      },
      "imagediv": {
        "class": [
          "error"
        ],
        "id": "imgholder"
      },
      "actions": [
        {
          "action": "emit",
          "value": "auth-run"
        }
      ]
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
        "src": logoicon,
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
        "src": logoicon,
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
        "src": authicon,
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
        "src": logoicon,
        "alt": "Shark Image",
        "id": "shark"
      },
      "imagediv": {
        "class": [],
        "id": "imgholder"
      },
      "actions": [
        {
          "action": "emit",
          "value": "prep-mc",
          "extra": "username"
        }
      ]
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
        "src": authicon,
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
        "src": logoicon,
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
        "src": logoicon,
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
        "innerHtml": "No valid Minecraft: Java aubscription was found on that microsoft account. Please try again, or use a different account."
      },
      "image": {
        "div": false,
        "class": [
          "error"
        ],
        "src": erroricon,
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
        "src": authicon,
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
        "src": checkicon,
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
        "src": authicon,
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
        "innerHtml": "Please enter your Minecraft: Java username in full. This is case sensitive. When you are done, hit the button below. Unfortunately pressing and holding a key does not work, you must manually hit the key multiple times."
      },
      "image": {
        "div": false,
        "class": [
          "nonexistent"
        ],
        "src": logoicon,
        "alt": "Shark Image",
        "id": "shark"
      },
      "imagediv": {
        "class": [],
        "id": "imgholder"
      },
      "actions": [
        {"action": "set",
        "value": "initialtype",
        "extra": true
      }
      ]
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
        "innerHtml": "Retry"
      },
      "offhandicon": {
        "id": "helpericon",
        "div": false,
        "class": [
          "nonexistent"
        ],
        "src": logoicon,
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
        "innerHtml": "ohno oh my goodness this is such a problem what if- ahhhhhhhhhhhhhh help meeee. perfect."
      },
      "image": {
        "div": false,
        "class": [
          "error"
        ],
        "src": erroricon,
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
        "src": logoicon,
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
        "src": erroricon,
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
        "src": logoicon,
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
        "src": erroricon,
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
        "src": logoicon,
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
        "innerHtml": "Wi-Fi connectivity has been lost. This page will updated as soon as it is restored."
      },
      "image": {
        "div": false,
        "class": [
          "error"
        ],
        "src": erroricon,
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
        "src": authicon,
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
        "src": erroricon,
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
        "innerHtml": "Use this account "
      },
      "offhandicon": {
        "id": "helpericon",
        "div": false,
        "class": [
          "helpericon"
        ],
        "src": backicon,
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
        "innerHtml": "Currently using account: loading account..."
      },
      "image": {
        "div": false,
        "class": [
          "error"
        ],
        "src": authicon,
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

}