
import { EventEmitter } from "events";
import * as  http from "http";
import * as  https from "https";
import { BoshClientEventMap, BoshJsJidParsed, BoshJsLogLevel, BoshJsXmlHttpRequestCallback, BoshJsXmlHttpRequestOptions } from "./types";

export type BoshClientLogLevel = "FATAL" | "ERROR" | "INFO" | "DEBUG";

// let LOG_LEVEL = "FATAL";
export class BoshClientBase extends EventEmitter {
    public static LOG_LEVEL: BoshClientLogLevel = "FATAL";
    constructor() {
        super();
    }
    protected jidParse(jid: string): BoshJsJidParsed {

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
    }
    protected decode64(encoded: string): string {
        return (Buffer.from(encoded, "base64")).toString("utf8");
    }

    protected encode64(decoded: string): string {
        return (Buffer.from(decoded, "utf8")).toString("base64");
    }
    protected xmlHttpRequest(options: BoshJsXmlHttpRequestOptions, callback: BoshJsXmlHttpRequestCallback, body: string) {

        const responseCallback = (response: http.IncomingMessage) => {
            let xdata = "";
            response.on("data", (chunk) => {
                xdata += chunk.toString();
            });
            response.on("end", () => {
                this.log("DEBUG", "response: " + xdata);
                callback(false, xdata);
            });
            response.on("error", (ee) => {
                callback(true, ee.toString());
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
            callback(true, ee.toString());
        });
        this.log("DEBUG", "request: " + body);
        if (body) {
            hr.setHeader("Content-Type", "text/xml; charset=utf-8");
            hr.setHeader("Content-Length", body.length.toString());
            hr.write(body);
        }
        hr.end();
    }
    public static setLogLevel(ss: BoshClientLogLevel) {
        console.log(`New log level: ${ss}`);

        // ss = ss.toUpperCase();
        if (!BoshJsLogLevel[ss]) {
            console.log(`nonexisting log level: ${ss}`);
            ss = "FATAL";
        }
        BoshClientBase.LOG_LEVEL = ss;
    }

    protected log(type: BoshClientLogLevel, output: string): void {
        // handle logging levels
        if (BoshJsLogLevel[type]) {
            if (BoshJsLogLevel[type] <= BoshJsLogLevel[BoshClientBase.LOG_LEVEL]) {
                console.log(type + ": " + output);
            }
        }
    }
    public emit<K extends keyof BoshClientEventMap>(event: K, data?: BoshClientEventMap[K]): boolean {
        return super.emit(event, data);
    }
    public on<K extends keyof BoshClientEventMap>(event: K, listener: (data: BoshClientEventMap[K]) => void) {
        return super.on(event, listener);
    }
    public listeners<K extends keyof BoshClientEventMap>(event: K) {
        return super.listeners(event);
    }
    public unregisterListeners() {
        this.listeners("online").forEach((l: any) => this.removeListener("online", l));
        this.listeners("offline").forEach((l: any) => this.removeListener("offline", l));
        this.listeners("error").forEach((l: any) => this.removeListener("error", l));
        this.listeners("ping").forEach((l: any) => this.removeListener("ping", l));
    }
    public off<K extends keyof BoshClientEventMap>(event: K, listener: any): any {
        this.removeListener(event, listener);
        return this;
    }
}
