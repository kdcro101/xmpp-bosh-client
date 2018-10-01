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

1) Import BoshClient

When using with node.js

```js
import { BoshClient, $build } from "xmpp-bosh-client/node";
```
When using with typescript framework running in browser (angular/react/etc)
```
import { BoshClient, $build } from "xmpp-bosh-client/browser";
```

2) construct BoshClient object

```js
const connection = new BoshClient(USERNAME, PASSWORD, URL);
```

3) setup event listeners

```js
 connection.on("error", errorListener);
 connection.on("stanza", stanzaListener);
 connection.on("online", onlineListener);
 connection.on("offline", offlineListener);
```

4) start connecting procedure

```js
connection.connect()
```


### Typescript
```ts
// when using with Node.js
import { BoshClient } from "xmpp-bosh-client/node"; 
// when using with angular/react (execution in browser)
import { BoshClient } from "xmpp-bosh-client/browser"; 

const USERNAME = "username@example.com";
const PASSWORD = "somePassword";
const URL = "https://www.example.com:5280/http-bind/";

    const client = new BoshClient(USERNAME, PASSWORD, URL);

    client.on("error", (e) => {
        console.log("Error event");
        console.log(e);
    });
    client.on("online", () => {
        console.log("Connected successfully");
    });
    
    client.on("ping", () => {
        console.log(`Ping received at ${new Date()}`);
    });
    
    client.on("stanza", (stanza) => {
        console.log(`Stanza received at ${new Date()}`);
        console.log(stanza);
    });

    client.on("offline", () => {
        console.log("Disconnected/Offline");
    });

    connection.connect();

```

### Javascript
```js
var lib = require("xmpp-bosh-client/node");
// when using with Node.js
var lib = require("xmpp-bosh-client/browser");
// when using with angular/react (execution in browser)

var USERNAME = "username@example.com";
var PASSWORD = "somePassword";
var URL = "https://www.example.com:5280/http-bind/";

    var client = new lib.BoshClient(USERNAME, PASSWORD, URL);
    client.on("error", function (e) {
        console.log("Error event");
        console.log(e);
    });
    client.on("online", function () {
        console.log("Connected successfully");
    });
    client.on("ping", function () {
        console.log("Ping received at " + new Date());
    });
    client.on("stanza", function (stanza) {
        console.log("Stanza received at %s",new Date());
        console.log(stanza);
    });
    client.on("offline", function () {
        console.log("Disconnected/Offline");
    });
    
    client.connect();

```

### Browser (classic)

Include script tag, for example:

```html
<script src="./node_modules/xmpp-bosh-client/browser-bundle/index.js"></script>
```

exports will be accessible via `BoshXMPP` wrapper:

```js
    var client =  BoshXMPP.BoshClient(USERNAME, PASSWORD, URL);
    
    client.on("error", (e) => {
        console.log("Error event");
        console.log(e);
    });
    client.on("online", () => {
        console.log("Connected successfully");
    });
    
    client.on("ping", () => {
        console.log(`Ping received at ${new Date()}`);
    });
    
    client.on("stanza", (stanza) => {
        console.log(`Stanza received at ${new Date()}`);
        console.log(stanza);
    });

    client.on("offline", () => {
        console.log("Disconnected/Offline");
    });

    connection.connect();

```

Copy `index.js` file in location of your convenience and update src attribute.


 
### Browser (angular or other typescript based framwork)

See typescript example above.

# Stanza building
```js
    const root: XmlElement = $build('message', { to: "username@example.com" });
    const child1 = root.cnode($build("header", {
        id: "123",
        jid: "user@example.com"
    }));
    child1.cnode($build("some-element", {
        a: "1",
        b: 2
    }));
```
Would generate:
```xml
<message to="username@example.com">
        <header id="123" jid="user@example.com">
            <some-element a="1" b="2"/>
        </header>
        <body>
            some inner text
        </body>
</message>

```


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

## errors
- *auth_error* :  invalid credentials. Error while authenticating
- *xml_parsing_error* :  error parsing incoming stanza string 
- *binding_error* : error while binding to resource
- *session_create_error* : error while creating session
- *start_sasl_error* : no sasl mechanism available
- *plain_sasl_unavailable_error*: on plain sasl mechanism available


## ltxElement

Reference to ltx.Element constructor. See [this](https://github.com/xmppjs/ltx).
Use to construct XML element.

returns `XmlElement`

```js
 const e = new ltxElement("element",{
    attr1: "some_value",
    attr2: "some_other_value"
}) 
```

## $build(name, attrs)
alias for `new ltxElement(name, attrs)`

returns `XmlElement`

```js
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
