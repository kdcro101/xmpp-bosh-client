import { BoshJsJidParsed, BoshJsXmlHttpRequestCallback, BoshJsXmlHttpRequestOptions } from "./types";
export declare const jidParse: (jid: string) => BoshJsJidParsed;
export declare const decode64: (encoded: string) => string;
export declare const encode64: (decoded: string) => string;
export declare const randomstring: () => string;
export declare const xmlHttpRequest: (options: BoshJsXmlHttpRequestOptions, cb: BoshJsXmlHttpRequestCallback, body: string) => void;
export declare const setLogLevel: (ss: string) => void;
export declare const logIt: (type: "FATAL" | "ERROR" | "INFO" | "DEBUG", quote: string) => void;
