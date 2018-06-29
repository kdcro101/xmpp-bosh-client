
import * as ltx from "ltx";

import { XmlElement } from "./types";
export { XmlElement } from "./types";
// stanza builders
// ltx Element object to create stanzas
export const ltxElement = ltx.Element;

// generic packet building helper function
export const $build = (xname: string, attrib: any, ...children: any[]): XmlElement => {
    return new ltx.Element(xname, attrib, ...children);
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
export const $pres = (attrib?: any): XmlElement => {

    return new ltx.Element("presence", attrib);
};
