import * as ltx from "ltx";
import "../types/ltx";

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
    public cnode?: (element: any) => XmlElement;
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

// declare module "ltx" {
//     export function clone(el: any): any;
//     export function createElement(name: string, attrs: any): Element;
//     export function nameEqual(a: any, b: any): boolean;
//     export function attrsEqual(a: any, b: any): boolean;
//     export function childrenEqual(a: any, b: any): boolean;
//     export function equal(a: any, b: any): boolean;
//     export function escapeXML(s: string): string;
//     export function unescapeXML(s: string): string;
//     export function escapeXMLText(s: string): string;
//     export function unescapeXMLText(s: string): string;
//     export function isNode(el: any): boolean;
//     export function isElement(el: any): boolean;
//     export function isText(el: any): boolean;
//     export function parse(data: any, options?: any): any;
//     export function stringify(el: any, indent: any, level: any): string;
//     export function tag(d: any): any;
//     export function tagString(d: any): string;

//     // tslint:disable-next-line:max-classes-per-file
//     export class Parser {
//         constructor(options?: any);
//     }

//     // tslint:disable-next-line:max-classes-per-file
//     export class Element {
//         public name: string;
//         public parent: Element;
//         public children: Element[];
//         public attrs: any;

//         constructor(name: string, attrs?: any, ...children: any[]);

//         /**
//          * if (element.is('message', 'jabber:client')) ...
//          */
//         public is(name: string, xmlns?: any): boolean;

//         /**
//          * without prefix.
//          */
//         public getName(): string;

//         /**
//          * retrieves the namespace of the current element, upwards recursively
//          */
//         public getNS(): any;

//         /**
//          * find the namespace to the given prefix, upwards recursively
//          */
//         public findNS(prefix: string): any;

//         /**
//          * Recursiverly gets all xmlns defined, in the form of {url:prefix}
//          */
//         public getXmlns(): any;

//         public setAttrs(attrs: any): void;

//         /**
//          * xmlns can be null, returns the matching attribute.
//          */
//         public getAttr(name: string, xmlns?: any): any;

//         /**
//          * xmlns can be null
//          */
//         public getChild(name: string, xmlns?: any): Element;

//         /**
//          * xmlns can be null
//          */
//         public getChildren(name: string, xmlns?: any): Element[];

//         /**
//          * xmlns and recursive can be null
//          */
//         public getChildByAttr(attr: any, val: any, xmlns?: any, recursive?: any): Element;

//         /**
//          * xmlns and recursive can be null
//          */
//         public getChildrenByAttr(attr: any, val: any, xmlns?: any, recursive?: any): Element[];

//         public getText(): string;

//         public getChildText(name: string, xmlns?: any): string;

//         /**
//          * Return all direct descendents that are Elements.
//          * This differs from `getChildren` in that it will exclude text nodes,
//          * processing instructions, etc.
//          */
//         public getChildElements(): Element[];

//         /** returns uppermost parent */
//         public root(): Element;

//         public tree(): Element;

//         /** just parent or itself */
//         public up(): Element;

//         /** create child node and return it */
//         public c(name: string, attrs?: any): Element;

//         /** add text node and return element */
//         public t(text: string): Element;

//         /**
//          * Either:
//          *   el.remove(childEl)
//          *   el.remove('author', 'urn:...')
//          */
//         public remove(el: Element, xmlns?: any): Element;

//         public clone(): Element;

//         public text(val: string): string;

//         public attr(attr: any, val: any): any;

//         public toString(): string;

//         public toJSON(): any;

//         public write(writer: any): void;

//         public nameEquals(el: Element): boolean;

//         public attrsEquals(el: Element): boolean;

//         public childrenEquals(el: Element): boolean;

//         public equals(el: Element): boolean;
//     }
// }
