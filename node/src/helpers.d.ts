import * as ltx from "ltx";
import { XmlElement } from "./types";
export { XmlElement } from "./types";
export declare const ltxElement: typeof ltx.Element;
export declare const $build: (xname: string, attrib: any, ...children: any[]) => XmlElement;
export declare const $msg: (attrib: any) => XmlElement;
export declare const $iq: (attrib: any) => XmlElement;
export declare const $pres: (attrib?: any) => XmlElement;
