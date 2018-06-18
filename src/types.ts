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

// key: "FATAL" | "ERROR" | "INFO" | "DEBUG"
export const BoshJsLogLevel: { [key: string]: number } = {
    FATAL: 0,
    ERROR: 1,
    INFO: 2,
    DEBUG: 3,
};
