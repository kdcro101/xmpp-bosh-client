import * as ltx from "ltx";
import * as url from "url";
import { BoshClientBase } from "./src/base";
import { BoshJsSessionAttributes, BoshJsXmlHttpRequestOptions, XmlElement } from "./src/types";

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

// export type BoshEvent = "online" | "offline" | "error" | "stanza";

// tslint:disable-next-line:class-name

/*
	xmpp-bosh-client
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
export class BoshClient extends BoshClientBase {
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

        super();

        this.sessionAttributes = {
            rid: Math.round(Math.random() * 10000),
            jid: this.jidParse(this.jid),
            password: this.password,
        };

        const u = url.parse(bosh);

        this.options = {
            host: u.hostname,
            port: u.port,
            path: u.pathname,
            method: "POST",
            agent: false,
            protocol: u.protocol,
        };

        // an array of pending xml stanzas to be sent
        // this.pending = [];

        // constructor definition
        const attr = {
            "content": "text/xml; charset=utf-8",
            "to": this.sessionAttributes.jid.domain,
            "rid": this.sessionAttributes.rid++,
            "hold": 1,
            "wait": 60,
            "ver": "1.6",
            "xml:lang": "en",
            "xmpp:version": "1.0",
            "xmlns": NS_DEF,
            "xmlns:xmpp": "urn:xmpp:xbosh",
            "route": null,
        };
        if (route) {
            attr.route = route;
        }
        const body = new ltx.Element("body", attr);

        this.sendHttp(body.toString());

    }

    public sendHttp(body: string) {
        const that = this;
        this.chold++;
        this.xmlHttpRequest(this.options, (err, response) => { that.handle(err, response); }, body);
    }
    private handle(err: any, response: string) {
        this.chold--;
        // some error in sending or receiving http request
        if (err) {
            this.log("ERROR", this.sessionAttributes.jid + " no response " + response);
            // emit offline event with condition
            this.emit("error", response);

            return;
        }

        // ltx.parse() throws exceptions if unable to parse
        let body: XmlElement = null;
        try {
            body = ltx.parse(response);
        } catch (err) {
            this.pError("xml parsing ERROR: " + response);
            return;
        }

        // check for stream error
        const serror = body.getChild("error", NS_STREAM);
        if (serror) {
            this.log("ERROR", "stream Error :  " + serror);
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
                this.log("INFO", "Session terminated By the Server " + body);
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
            this.log("DEBUG", "STATE_AUTH with body: " +
                body.getChild("success", "urn:ietf:params:xml:ns:xmpp-sasl") + " and NS_CLIENT: " + NS_CLIENT);
            const success = body.getChild("success", "urn:ietf:params:xml:ns:xmpp-sasl");
            const failure = body.getChild("failure", NS_CLIENT);
            if (success) {
                this.log("DEBUG", "Authentication Success:  " + this.sessionAttributes.jid);
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
            this.log("INFO", "client terminating : " + this.sessionAttributes.jid);
            this.state = STATE_OVER;
            return;
        }

        if (this.state === STATE_OVER) {
            // extra held responses objects coming back do nothing :P
            return;
        }
    }
    private pError(error: string) {
        this.log("ERROR", error);
        this.emit("error", error);
        this.terminate();
        return;
    }
    private getOnline() {
        this.log("INFO", "Session Created :  " + this.sessionAttributes.jid);
        // now u r online
        this.state = STATE_ONLINE;
        this.emit("online");

        // send any pending stanza's
        this.sendPending();

        return;
    }

    // what to do on response arrival after online
    private handleOnline(body: XmlElement) {
        // process body and emit "stanza" event
        body.children.forEach((stanza: XmlElement) => {

            if (stanza.name === "iq" && stanza.children.length > 0 && stanza.children[0].name === "ping") {
                this.sendPong(stanza);
                return;
            }

            this.emit("stanza", stanza);
        });

        // send any pending stanzas
        this.sendPending();

        return;
    }
    private sendPong(iqStanza: XmlElement) {
        const to = iqStanza.attrs.to;
        const from = iqStanza.attrs.from;
        const id = iqStanza.attrs.id;

        const s = $iq({ from: to, to: from, type: "result", id });
        this.send(s);
        this.emit("ping");
    }
    // start plain sasl authentication
    private startSasl(features: XmlElement) {
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
        return this.encode64(authzid + "\u0000" + authcid + "\u0000" + password);
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
        const bind: XmlElement = new ltx.Element("bind", { xmlns: NS_XMPP_BIND });
        bind.cnode(resource);
        const iq: XmlElement = new ltx.Element("iq", { id: "bind_1", type: "set", xmlns: NS_CLIENT });
        iq.cnode(bind);
        this.sendXml(iq);
    }
    // sends an ltx-xml element by wrapping it into body element[change it to array thing]
    private sendXml(ltxe?: XmlElement) {
        const body: XmlElement = new ltx.Element("body", {
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
        const message: XmlElement = new ltx.Element("message", {
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
    public send(stanza: XmlElement) {
        stanza = stanza.tree();

        if (this.state !== STATE_ONLINE) {
            this.emit("error", "can send something only when u are ONLINE!!!");
            return;
        }
        if (stanza) {
            this.pending.push(stanza);
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
            const body: XmlElement = new ltx.Element("body", {
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
    public destroy() {
        this.listeners("online").forEach((l: any) => this.off("online", l));
        this.listeners("offline").forEach((l: any) => this.off("offline", l));
        this.listeners("error").forEach((l: any) => this.off("error", l));
    }
}

// stanza builders

// ltx Element object to create stanzas
export const ltxElement = ltx.Element;

// generic packet building helper function
export const $build = (xname: string, attrib: any): XmlElement => {
    return new ltx.Element(xname, attrib);
};

// packet builder helper function for message stanza
export const $msg = (attrib: any): XmlElement => {
    return new ltx.Element("message", attrib);
};

// packet builder helper function for iq stanza
export const $iq = (attrib: any): XmlElement => {
    return new ltx.Element("iq", attrib);
};

// packet builder helper function for iq stanza
export const $pres = (attrib: any): XmlElement => {
    return new ltx.Element("presence", attrib);
};
