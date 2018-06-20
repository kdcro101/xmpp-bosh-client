# xmpp-bosh-client

XMPP [BOSH](https://en.wikipedia.org/wiki/BOSH_(protocol)) client for Javascript/Typescript


## Features

- works in browser
- works in Web worker
- strictly typed
- includes implementation of [XEP-0199: XMPP Ping](https://xmpp.org/extensions/xep-0199.html)


## Installation

`npm install xmpp-bosh-client`

## Usage

### Typescript
```
import { BoshClient } from "xmpp-bosh-client";

const USERNAME = "username@example.com";
const PASSWORD = "somePassword";
const URL = "https://www.example.com:5280/http-bind/";

    const connection = new BoshClient(USERNAME, PASSWORD, URL);

    connection.on("error", (e) => {
        console.log("Error event");
        console.log(e);
    });
    connection.on("online", () => {
        console.log("Connected successfully");
    });
    
    connection.on("ping", () => {
        console.log(`Ping received at ${new Date()}`);
    });
    
    connection.on("stanza", (stanza) => {
        console.log(`Stanza received at ${new Date()}`);
        console.log(stanza);
    });

    connection.on("offline", () => {
        console.log("Disconnected/Offline");
    });

```

### Javascript
```
var lib = require("xmpp-bosh-client");

var USERNAME = "username@example.com";
var PASSWORD = "somePassword";
var URL = "https://www.example.com:5280/http-bind/";

    var connection = new lib.BoshClient(USERNAME, PASSWORD, URL);
    connection.on("error", function (e) {
        console.log("Error event");
        console.log(e);
    });
    connection.on("online", function () {
        console.log("Connected successfully");
    });
    connection.on("ping", function () {
        console.log("Ping received at " + new Date());
    });
    connection.on("stanza", function (stanza) {
        console.log("Stanza received at %s",new Date());
        console.log(stanza);
    });
    connection.on("offline", function () {
        console.log("Disconnected/Offline");
    });

```

### Browser (classic)

Include script tag, for example:

`<script src="./node_modules/xmpp-bosh-client/dist/bundle.js"></script>`

Copy `bundle.js` file in location of your convenience and update src attribute.
 
### Browser (angular or other typescript based framwork)

See typescript example above.

# Additional reading

Please read [this](https://metajack.im/2008/07/02/xmpp-is-better-with-bosh/) article.

# Credits 

Thanks to https://github.com/eelcocramer and his [work](https://github.com/eelcocramer/node-bosh-xmpp-client)
