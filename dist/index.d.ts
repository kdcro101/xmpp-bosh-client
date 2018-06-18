/// <reference types="node" />
import * as events from "events";
import * as ltx from "ltx";
export interface xmlElement extends ltx.Element {
    cnode?: (element: any) => void;
}
export declare class BoshJSClient extends events.EventEmitter {
    private jid;
    private password;
    private bosh;
    private route?;
    private sessionAttributes;
    private chold;
    private hasNextTick;
    private state;
    private options;
    private pending;
    private sessionSupport;
    constructor(jid: string, password: string, bosh: string, route?: string);
    emit(event: string | symbol, ...args: any[]): boolean;
    sendHttp(body: string): void;
    private handle;
    private pError;
    private getOnline;
    private handleOnline;
    private startSasl;
    private getPlain;
    private terminate;
    private restartStream;
    private bindResource;
    private sendXml;
    sendMessage(to: string, mbody: string, type?: string): void;
    send(ltxe: xmlElement): void;
    private sendPending;
    disconnect(): void;
}
export declare const Element: typeof ltx.Element;
export declare const $build: (xname: string, attrib: any) => ltx.Element;
export declare const $msg: (attrib: any) => ltx.Element;
export declare const $iq: (attrib: any) => ltx.Element;
export declare const $pres: (attrib: any) => ltx.Element;
export { setLogLevel } from "./src/local-utils";
