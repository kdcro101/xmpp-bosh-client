/// <reference types="node" />
import { EventEmitter } from "events";
import { BoshClientEventMap, BoshJsJidParsed, BoshJsXmlHttpRequestCallback, BoshJsXmlHttpRequestOptions } from "./types";
export declare type BoshClientLogLevel = "FATAL" | "ERROR" | "INFO" | "DEBUG";
export declare class BoshClientBase extends EventEmitter {
    static LOG_LEVEL: BoshClientLogLevel;
    constructor();
    protected jidParse(jid: string): BoshJsJidParsed;
    protected decode64(encoded: string): string;
    protected encode64(decoded: string): string;
    protected xmlHttpRequest(options: BoshJsXmlHttpRequestOptions, callback: BoshJsXmlHttpRequestCallback, body: string): void;
    static setLogLevel(ss: BoshClientLogLevel): void;
    protected log(type: BoshClientLogLevel, output: string): void;
    emit<K extends keyof BoshClientEventMap>(event: K, data?: BoshClientEventMap[K]): boolean;
    on<K extends keyof BoshClientEventMap>(event: K, listener: (data: BoshClientEventMap[K]) => void): this;
    listeners<K extends keyof BoshClientEventMap>(event: K): Function[];
    unregisterListeners(): void;
    off<K extends keyof BoshClientEventMap>(event: K, listener: any): any;
}
