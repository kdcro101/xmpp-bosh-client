import * as  http from "http";
import * as  https from "https";
import { BoshJsJidParsed, BoshJsLogLevel, BoshJsXmlHttpRequestCallback, BoshJsXmlHttpRequestOptions } from "./types";

let LOG_LEVEL = "FATAL";

// tslint:disable-next-line:variable-name
export const jidParse = (jid: string): BoshJsJidParsed => {

    /* Parses a full JID and returns an object containing 3 fields:
	 *
	 * username: The part before the @ sign
	 * domain  : The domain part of the JID (between @ and /)
	 * resource: The resource of the JID. May be undefined if not set
	 *
	 */
    const parts = jid.match(/^([^@]+)@([^\/]+)(\/([\S]+))?$/);
    if (!parts || !(parts instanceof Array) || parts.length < 5) {
        return null;
    }

    return {
        username: parts[1],
        domain: parts[2],
        resource: parts[4],
        toString: () => {
            // return this.username + "@" + this.domain + "/" + this.resource;
            return `${parts[1]}@${parts[2]}/${parts[4]}`;
        },
    };
};

export const decode64 = (encoded: string): string => {
    return (new Buffer(encoded, "base64")).toString("utf8");
};

export const encode64 = (decoded: string): string => {
    return (new Buffer(decoded, "utf8")).toString("base64");
};

export const randomstring = (): string => {
    const l = 5 + Math.floor(Math.random() * 5);
    const chars = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    let str = "";
    for (let i = 0; i < l; i++) {
        const n = Math.floor(Math.random() * chars.length);
        str += chars.substr(n, 1);
    }
    return str;
};

export const xmlHttpRequest = (options: BoshJsXmlHttpRequestOptions, cb: BoshJsXmlHttpRequestCallback, body: string) => {

    const responseCallback = (response: http.IncomingMessage) => {
        let xdata = "";
        response.on("data", (chunk) => {
            xdata += chunk.toString();
        });
        response.on("end", () => {
            logIt("DEBUG", "response: " + xdata);
            cb(false, xdata);
        });
        response.on("error", (ee) => {
            cb(true, ee.toString());
        });
    };

    let hr: http.ClientRequest = null;

    if (options.protocol === "https:") {
        hr = https.request(options, responseCallback);
    } else {
        hr = http.request(options, responseCallback);
    }
    hr.setHeader("Connection", "Keep-Alive");

    hr.on("error", (ee) => {
        cb(true, ee.toString());
    });
    logIt("DEBUG", "request: " + body);
    if (body) {
        hr.setHeader("Content-Type", "text/xml; charset=utf-8");
        hr.setHeader("Content-Length", body.length.toString());
        hr.write(body);
    }
    hr.end();
};

export const setLogLevel = (ss: string) => {
    console.log(`New log level: ${ss}`);

    ss = ss.toUpperCase();
    if (!BoshJsLogLevel[ss]) {
        console.log(`nonexisting log level: ${ss}`);
        ss = "FATAL";
    }
    LOG_LEVEL = ss;
};

export const logIt = (type: "FATAL" | "ERROR" | "INFO" | "DEBUG", quote: string): void => {
    // handle logging levels
    if (BoshJsLogLevel[type]) {
        if (BoshJsLogLevel[type] <= BoshJsLogLevel[LOG_LEVEL]) {
            console.log(type + ": " + quote);
        }
    }
};
