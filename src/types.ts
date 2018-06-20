import * as ltx from "ltx";

export interface BoshJsJidParsed {
    username: string;
    domain: string;
    resource: string;
    toString: () => string;
}
export interface BoshJsAnyHash {
    [key: string]: any;
}
export interface BoshJsSessionAttributes extends BoshJsAnyHash {
    rid: number;
    jid: BoshJsJidParsed;
    password: string;
    from?: string;
    sid?: string;
    stream?: any;
}
export interface BoshJsXmlHttpRequestOptions {
    host: string;
    protocol?: string;
    port: string;
    path: string;
    method: string;
    agent: boolean;
}
export type BoshJsXmlHttpRequestCallback = (error: boolean, response: string) => void;
export declare class XmlElement extends ltx.Element {
    public cnode?: (element: any) => void;
}

// key: "FATAL" | "ERROR" | "INFO" | "DEBUG"
export const BoshJsLogLevel: { [key: string]: number } = {
    FATAL: 0,
    ERROR: 1,
    INFO: 2,
    DEBUG: 3,
};

export interface BoshClientEventMap {
    "online": any;
    "offline": string;
    "error": string;
    "stanza": XmlElement;
    "ping": XmlElement;
}
export enum BoshClientErrorEnum {
    auth_error = "auth_error",
    xml_parsing_error = "xml_parsing_error",
    binding_error = "binding_error",
    session_create_error = "session_create_error",
    start_sasl_error = "start_sasl_error",
    plain_sasl_unavailable_error = "plain_sasl_unavailable_error",
}
