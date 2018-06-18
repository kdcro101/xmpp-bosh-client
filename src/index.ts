import * as  events from "events";
import * as  http from "http";
import * as  ltx from "ltx";
import * as  url from "url";
import * as  util from "util";
import { encode64, jidParse, logIt, setLogLevel, xmlHttpRequest } from "./local-utils";
import { BoshJsLogLevel, BoshJsSessionAttributes, BoshJsXmlHttpRequestOptions } from "./types";
// import { Element } from "ltx";

const NS_CLIENT = "jabber:client";
const NS_XMPP_SASL = "urn:ietf:params:xml:ns:xmpp-sasl";
const NS_XMPP_BIND = "urn:ietf:params:xml:ns:xmpp-bind";
const NS_XMPP_SESSION = "urn:ietf:params:xml:ns:xmpp-session";
const NS_DEF = "http://jabber.org/protocol/httpbind";
const NS_STREAM = "http://etherx.jabber.org/streams";

const STATE_FIRST = 0;
const STATE_PREAUTH = 1;
const STATE_AUTH = 2;
const STATE_AUTHED = 3;
const STATE_BIND = 4;
const STATE_SESSION = 5;
const STATE_ONLINE = 6;
const STATE_TERM = 7;
const STATE_OVER = 8;

// tslint:disable-next-line:class-name
export interface xmlElement extends ltx.Element {
    cnode?: (element: any) => void;
}

/*
	node-xmpp-bosh-client
	[A]: Client()
		1. Event-emitter for the following events
			a: "online"
			b: "error"
			c: "offline"
			d: "stanza"	[just for now, may be later split it into seperate presence, iq, message stanza events]
		2. send(ltxe) to send stanzas
		3. sendMessage(to,body,type="chat") to send messages
		4. disconnect() to disconnect
    [B]:	Element() alias to ltx.Element
    [C]: $build(xname,attrs)	returns an instance of corresponding xml object
	[D]: $msg(attrs)	returns an instance of message xml object
	[E]: $iq(attrs)	returns an instance of iq xml object
	[F]: $pres(attrs)	returns an instance of presence xml object
	[G]: setLogLevel(logLevel) sets the loglevel[use only when extremely necessary]
*/
export class BoshJSClient extends events.EventEmitter {
    private sessionAttributes: BoshJsSessionAttributes = null;
    private chold: number = 0;
    private hasNextTick: boolean = false; // bool to check whether sendPending is scheduled on nextTick to send pending stenzas
    private state: number = STATE_FIRST;
    private options: BoshJsXmlHttpRequestOptions;
    private pending: any[] = [];
    private sessionSupport: boolean = false;
    /*
        jid 		: [String] jabber id of user (e.g. 'user@example.com/office')
        password	: [String] password
        bosh		: [String] url of the bosh-server (e.g. 'http://localhost:5280/http-bind/')
        route		: [String] (optional) route attribute [if used] for connecting to xmpp server
     */
    constructor(private jid: string, private password: string, private bosh: string, private route?: string) {
        // events.EventEmitter.call(this);

        super();

        this.sessionAttributes = {
            rid: Math.round(Math.random() * 10000),
            jid: jidParse(this.jid),
            password: this.password,
        };

        // this.chold = 0;
        // this.hasNextTick = false;
        // this.state = STATE_FIRST;

        const u = url.parse(bosh);

        this.options = {
            host: u.hostname,
            port: u.port,
            path: u.pathname,
            method: "POST",
            agent: false,
        };

        // an array of pending xml stanzas to be sent
        // this.pending = [];

    }
    public sendHttp(body: string) {
        const that = this;
        this.chold++;
        xmlHttpRequest(this.options, (err, response) => { that.handle(err, response); }, body);
    }
    private handle(err: any, response: string) {
        this.chold--;

        // some error in sending or receiving http request
        if (err) {
            logIt("ERROR", this.sessionAttributes.jid + " no response " + response);

            // emit offline event with condition
            this.emit("error", response);

            return;
        }

        // ltx.parse() throws exceptions if unable to parse
        let body = null;
        try {
            body = ltx.parse(response);
        } catch (err) {
            this.pError("xml parsing ERROR: " + response);
            return;
        }

        // check for stream error
        const serror = body.getChild("error", NS_STREAM);
        if (serror) {
            logIt("ERROR", "stream Error :  " + serror);
            /*
                No need to terminate as stream already closed by xmppserver and hence bosh-server
                but to inform other asynch methods not to send messages any more change the state
            */
            this.state = STATE_TERM;
            this.emit("offline", "stream-error " + body.toString());
            return;
        }

        // session termination by bosh server
        if (body.attrs.type && body.attrs.type === "terminate") {
            if (this.state !== STATE_TERM) {
                logIt("INFO", "Session terminated By the Server " + body);
                this.state = STATE_TERM;
                this.emit("offline", "Session termination by server " + body.toString());
                return;
            }
        }

        if (this.state === STATE_FIRST) {
            this.state = STATE_PREAUTH;
            for (const i in body.attrs) {
                this.sessionAttributes[i] = body.attrs[i];
            }
        }

        if (this.state === STATE_PREAUTH) {
            const features = body.getChild("features", NS_STREAM);
            if (features) {
                this.startSasl(features);
                this.state = STATE_AUTH;
            } else {
                this.sendXml();
            }
            return;
        }

        if (this.state === STATE_AUTH) {
            logIt("DEBUG", "STATE_AUTH with body: " +
                body.getChild("success", "urn:ietf:params:xml:ns:xmpp-sasl") + " and NS_CLIENT: " + NS_CLIENT);
            const success = body.getChild("success", "urn:ietf:params:xml:ns:xmpp-sasl");
            const failure = body.getChild("failure", NS_CLIENT);
            if (success) {
                logIt("DEBUG", "Authentication Success:  " + this.sessionAttributes.jid);
                this.state = STATE_AUTHED;
                this.restartStream();		// restart stream
            } else if (failure) {
                this.pError("Authentication Failure: " + this.sessionAttributes.jid + body);
            } else {
                this.sendXml();			// sending empty request
            }
            return;
        }

        if (this.state === STATE_AUTHED) {
            // stream already restarted
            const features = body.getChild("features", NS_STREAM);
            if (features) {
                // checking for session support from xmpp
                if (features.getChild("session", NS_XMPP_SESSION)) {
                    this.sessionSupport = true;
                } else {
                    this.sessionSupport = false;
                }

                // resource binding
                if (features.getChild("bind", NS_XMPP_BIND)) {
                    this.state = STATE_BIND;
                    this.bindResource(this.sessionAttributes.jid.resource);		// bind resource
                } else {
                    this.pError("Resource binding not supported");
                }
            } else {
                this.sendXml();
            }
            return;
        }

        if (this.state === STATE_BIND) {
            const iq = body.getChild("iq", NS_CLIENT);
            if (iq) {
                if (iq.attrs.id === "bind_1" && iq.attrs.type === "result") {
                    const cjid = iq.getChild("bind", NS_XMPP_BIND).getChild("jid", NS_XMPP_BIND).getText();
                    this.sessionAttributes.jid.resource = cjid.substr(cjid.indexOf("/") + 1);

                    if (this.sessionSupport) {
                        const iqi = new ltx.Element("iq", { to: this.sessionAttributes.jid.domain, type: "set", id: "sess_1" });
                        iqi.c("session", { xmlns: NS_XMPP_SESSION });
                        this.sendXml(iqi);
                        this.state = STATE_SESSION;
                    } else {
                        this.getOnline();
                    }
                } else {
                    // stanza error to be handled properly
                    this.pError("iq stanza error resource binding :  " + iq);
                }
            } else {
                this.sendXml();
            }
            return;
        }

        if (this.state === STATE_SESSION) {
            const iq = body.getChild("iq");
            if (iq) {
                if (iq.attrs.id === "sess_1" && iq.attrs.type === "result") {
                    this.getOnline();
                } else {
                    this.pError("iq stanza error session establishment : " + iq);
                }
            } else {
                this.sendXml();
            }
            return;
        }

        if (this.state === STATE_ONLINE) {
            this.handleOnline(body);
            return;
        }

        if (this.state === STATE_TERM) {
            logIt("INFO", "client terminating : " + this.sessionAttributes.jid);
            this.state = STATE_OVER;
            return;
        }

        if (this.state === STATE_OVER) {
            // extra held responses objects coming back do nothing :P
            return;
        }
    }
    private pError(ss: string) {
        logIt("ERROR", ss);
        // emit "error" event
        this.emit("error", ss);

        this.terminate();
        return;
    }
    private getOnline() {
        logIt("INFO", "Session Created :  " + this.sessionAttributes.jid);
        // now u r online
        this.state = STATE_ONLINE;
        this.emit("online");

        // send any pending stanza's
        this.sendPending();

        return;
    }

    // what to do on response arrival after online
    private handleOnline(body: any) {
        // process body and emit "stanza" event
        body.children.forEach((ltxe: any) => {
            this.emit("stanza", ltxe);
        });

        // send any pending stanzas
        this.sendPending();

        return;
    }

    // start plain sasl authentication
    private startSasl(features: any) {
        const mechanisms = features.getChild("mechanisms", NS_XMPP_SASL);
        if (!mechanisms) {
            this.pError("No features-startSasl");
            return;
        }
        for (let i = 0; i < mechanisms.children.length; i++) {
            if (mechanisms.children[i].getText() === "PLAIN") {
                const e = new ltx.Element("auth", { xmlns: NS_XMPP_SASL, mechanism: "PLAIN" });
                e.t(this.getPlain());
                this.sendXml(e);
                return;
            }
        }
        this.pError("Plain SASL authentication unavailable!!!");
    }
    // get plain auth data
    private getPlain() {
        const authzid = this.sessionAttributes.jid.username + "@" + this.sessionAttributes.jid.domain;
        const authcid = this.sessionAttributes.jid.username;
        const password = this.sessionAttributes.password;
        return encode64(authzid + "\u0000" + authcid + "\u0000" + password);
    }
    // send terminate packet
    private terminate() {
        const body = new ltx.Element("body", {
            sid: this.sessionAttributes.sid,
            rid: this.sessionAttributes.rid++,
            type: "terminate", xmlns: NS_DEF,
        });

        body.c("presence", { type: "unavailable", xmlns: NS_CLIENT });
        this.sendHttp(body.toString());
        this.state = STATE_TERM;
    }
    // sends restart stream packet
    private restartStream() {
        const attr = {
            "rid": this.sessionAttributes.rid++,
            "sid": this.sessionAttributes.sid,
            "xmpp:restart": "true",
            "to": this.sessionAttributes.from,
            "xml:lang": "en",
            "xmlns": NS_DEF,
            "xmlns:xmpp": "urn:xmpp:xbosh",
        };
        const body = new ltx.Element("body", attr);
        this.sendHttp(body.toString());
    }
    // sends resource bind packet
    private bindResource(resName: string) {
        const resource = new ltx.Element("resource");
        resource.t(resName);
        const bind: xmlElement = new ltx.Element("bind", { xmlns: NS_XMPP_BIND });
        bind.cnode(resource);
        const iq: xmlElement = new ltx.Element("iq", { id: "bind_1", type: "set", xmlns: NS_CLIENT });
        iq.cnode(bind);
        this.sendXml(iq);
    }
    // sends an ltx-xml element by wrapping it into body element[change it to array thing]
    private sendXml(ltxe?: xmlElement) {
        const body: xmlElement = new ltx.Element("body", {
            sid: this.sessionAttributes.sid,
            rid: this.sessionAttributes.rid++,
            xmlns: NS_DEF,
            stream: this.sessionAttributes.stream,
        });
        if (ltxe) {
            body.cnode(ltxe);
        }
        this.sendHttp(body.toString());
    }
    // sends a single message packet
    public sendMessage(to: string, mbody: string, type?: string) {
        const message: xmlElement = new ltx.Element("message", {
            "to": to,
            "from": this.sessionAttributes.jid.toString(),
            "type": type || "chat",
            "xml:lang": "en",
        });
        const body = new ltx.Element("body").t(mbody);
        message.cnode(body);
        this.send(message);
    }
    // puts ltx-element into pending[] to be sent later
    public send(ltxe: xmlElement) {
        ltxe = ltxe.tree();

        if (this.state !== STATE_ONLINE) {
            this.emit("error", "can send something only when u are ONLINE!!!");
            return;
        }
        if (ltxe) {
            this.pending.push(ltxe);
        }
        if (!this.hasNextTick) {
            this.hasNextTick = true;
            const that = this;
            process.nextTick(() => {
                if (that.hasNextTick && that.state === STATE_ONLINE) {
                    that.sendPending();
                }
            });
        }
    }
    private sendPending() {
        // send only if u have something to send or u need to poll the bosh-server
        if (this.pending.length > 0 || this.chold < 1) {
            const body: xmlElement = new ltx.Element("body", {
                sid: this.sessionAttributes.sid,
                rid: this.sessionAttributes.rid++,
                xmlns: NS_DEF,
                stream: this.sessionAttributes.stream,
            });
            while (this.pending.length > 0) {
                body.cnode(this.pending.shift());
            }
            this.sendHttp(body.toString());
            this.hasNextTick = false;
        }
    }
    // disconnect the connection
    public disconnect() {
        // before terminating, send any pending stanzas
        this.sendPending();
        this.terminate();
        // should emit 'offline' event or not??
        // [yes, because if i am calling disconnect() and i dont care whatever comes to me afterwards ]
        this.emit("offline", "session termination by user");
        return;
    }
}

// util.inherits(nxbClient, events.EventEmitter);


// stanza builders

// ltx Element object to create stanzas
exports.Element = ltx.Element;

// generic packet building helper function
exports.$build = function (xname: string, attrib: any) {
    return new ltx.Element(xname, attrib);
};

// packet builder helper function for message stanza
exports.$msg = function (attrib: any) {
    return new ltx.Element("message", attrib);
};

// packet builder helper function for iq stanza
exports.$iq = function (attrib: any) {
    return new ltx.Element("iq", attrib);
};

// packet builder helper function for iq stanza
exports.$pres = function (attrib: any) {
    return new ltx.Element("presence", attrib);
};

exports.setLogLevel = setLogLevel;
