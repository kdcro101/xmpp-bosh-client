# xmpp-bosh-client

XMPP [BOSH](https://en.wikipedia.org/wiki/BOSH_(protocol)) client for Javascript/Typescript.


Jump to module [interface](#interface)

## Features

- works in browser
- works in Web worker
- strictly typed
- includes implementation of [XEP-0199: XMPP Ping](https://xmpp.org/extensions/xep-0199.html)


## Installation

`npm install xmpp-bosh-client`

## Usage

1. construct BoshClient object

```
const connection = new BoshClient(USERNAME, PASSWORD, URL);
```

2. setup event listeners

```
 connection.on("error", errorListener);
 connection.on("stanza", stanzaListener);
 connection.on("online", onlineListener);
 connection.on("offline", offlineListener);
```

3. start connecting procedure

```
connection.connect()
```


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

    connection.connect();

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
    
    connection.connect();

```

### Browser (classic)

Include script tag, for example:

```
<script src="./node_modules/xmpp-bosh-client/dist/bundle.js"></script>
```

Copy `bundle.js` file in location of your convenience and update src attribute.
 
### Browser (angular or other typescript based framwork)

See typescript example above.

# <a name="interface"></a> Interface

## Constructor(jid, password, boshUrl, route)
Constructs BoshClient instance
```
jid      [string] : XMPP username to connect with
password [string] : password to connect with
boshUrl  [string] : URL to connect to (example: https://www.example.com:5280/http-bind/)
route    [string] : optional. routing server for connection. see https://xmpp.org/extensions/xep-0124.html#session-request
```
## on(event_name, listener)
Register event listener
```
event_name [string]   : event name. One of: online,offline,stanza,error,ping
listener   [function] : event listener function

Data type for event callbacks:

online   -> void
offline  -> string
error    -> string
stanza   -> XmlElement
ping     -> XmlElement

```


## off(event_name, listener)
Unregister event listener
```
event_name [string]   : event name. One of: online,offline,stanza,error,ping
listener   [function] : event listener function
```

## connect()
Start connecting procedure

## send(stanza)
Sends XML stanza to server
```
stanza [XmlElement] : Stanza to send
```
## sendMessage(to, mbody, type)
Sends chat message 
```
to    [string] : destination XMPP username (user@domain)
mbody [string] : Message body
type  [string] : optional. type attribute, defaults to "chat"
```
## disconnect()
Sends any pending stanzas and terminates connection.

## unregisterListeners()
Unregister all registred listeners. Useful when you don't want to trigger any events after disconnect.

## ltxElement

Reference to ltx.Element constructor. See [this](https://github.com/xmppjs/ltx).
Use to construct XML element.

returns `XmlElement`

```
 const e = new ltxElement("element",{
    attr1: "some_value",
    attr2: "some_other_value"
}) 
```

## $build(name, attrs)
alias for `new ltxElement(name, attrs)`

returns `XmlElement`

```
 const e = $build("element",{
    attr1: "some_value",
    attr2: "some_other_value"
}) 
```

## $msg(attrs)
Helper to construct message stanza. Alias for `$build("message",attrs)`

returns `XmlElement`

## $iq(attrs)
Helper to construct `iq` stanza. Alias for `$build("iq",attrs)`

returns `XmlElement`

## $pres(attrs)
Helper to construct `presence` stanza. Alias for `$build("presence",attrs)`

returns `XmlElement`


# Additional reading

Read [this](https://metajack.im/2008/07/02/xmpp-is-better-with-bosh/) article.

# Credits 

Thanks to https://github.com/eelcocramer and his [work](https://github.com/eelcocramer/node-bosh-xmpp-client)
