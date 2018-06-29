
declare module "ltx" {

    export function clone(el: any): any;
    export function createElement(name: string, attrs: any): Element;
    export function nameEqual(a: any, b: any): boolean;
    export function attrsEqual(a: any, b: any): boolean;
    export function childrenEqual(a: any, b: any): boolean;
    export function equal(a: any, b: any): boolean;
    export function escapeXML(s: string): string;
    export function unescapeXML(s: string): string;
    export function escapeXMLText(s: string): string;
    export function unescapeXMLText(s: string): string;
    export function isNode(el: any): boolean;
    export function isElement(el: any): boolean;
    export function isText(el: any): boolean;
    export function parse(data: any, options?: any): any;
    export function stringify(el: any, indent: any, level: any): string;
    export function tag(d: any): any;
    export function tagString(d: any): string;

    // tslint:disable-next-line:max-classes-per-file
    export class Parser {
        constructor(options?: any);
    }

    // tslint:disable-next-line:max-classes-per-file
    export class Element {
        public name: string;
        public parent: Element;
        public children: Element[];
        public attrs: any;

        constructor(name: string, attrs?: any, ...children: any[]);

        /**
         * if (element.is('message', 'jabber:client')) ...
         */
        public is(name: string, xmlns?: any): boolean;

        /**
         * without prefix.
         */
        public getName(): string;

        /**
         * retrieves the namespace of the current element, upwards recursively
         */
        public getNS(): any;

        /**
         * find the namespace to the given prefix, upwards recursively
         */
        public findNS(prefix: string): any;

        /**
         * Recursiverly gets all xmlns defined, in the form of {url:prefix}
         */
        public getXmlns(): any;

        public setAttrs(attrs: any): void;

        /**
         * xmlns can be null, returns the matching attribute.
         */
        public getAttr(name: string, xmlns?: any): any;

        /**
         * xmlns can be null
         */
        public getChild(name: string, xmlns?: any): Element;

        /**
         * xmlns can be null
         */
        public getChildren(name: string, xmlns?: any): Element[];

        /**
         * xmlns and recursive can be null
         */
        public getChildByAttr(attr: any, val: any, xmlns?: any, recursive?: any): Element;

        /**
         * xmlns and recursive can be null
         */
        public getChildrenByAttr(attr: any, val: any, xmlns?: any, recursive?: any): Element[];

        public getText(): string;

        public getChildText(name: string, xmlns?: any): string;

        /**
         * Return all direct descendents that are Elements.
         * This differs from `getChildren` in that it will exclude text nodes,
         * processing instructions, etc.
         */
        public getChildElements(): Element[];

        /** returns uppermost parent */
        public root(): Element;

        public tree(): Element;

        /** just parent or itself */
        public up(): Element;

        /** create child node and return it */
        public c(name: string, attrs?: any): Element;

        /** add text node and return element */
        public t(text: string): Element;

        /**
         * Either:
         *   el.remove(childEl)
         *   el.remove('author', 'urn:...')
         */
        public remove(el: Element, xmlns?: any): Element;

        public clone(): Element;

        public text(val: string): string;

        public attr(attr: any, val: any): any;

        public toString(): string;

        public toJSON(): any;

        public write(writer: any): void;

        public nameEquals(el: Element): boolean;

        public attrsEquals(el: Element): boolean;

        public childrenEquals(el: Element): boolean;

        public equals(el: Element): boolean;
    }
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

//     export class Parser {
//         constructor(options?: any);
//     }

//     export class Element {
//         name: string;
//         parent: Element;
//         children: Element[];
//         attrs: any;

//         constructor(name: string, attrs?: any, ...children: any[]);

//         /**
//          * if (element.is('message', 'jabber:client')) ...
//          **/
//         is(name: string, xmlns?: any): boolean;

//         /**
//          * without prefix.
//          */
//         getName(): string;

//         /**
//          * retrieves the namespace of the current element, upwards recursively
//          **/
//         getNS(): any;

//         /**
//          * find the namespace to the given prefix, upwards recursively
//          **/
//         findNS(prefix: string): any;

//         /**
//          * Recursiverly gets all xmlns defined, in the form of {url:prefix}
//          **/
//         getXmlns(): any;

//         setAttrs(attrs: any): void;

//         /**
//          * xmlns can be null, returns the matching attribute.
//          **/
//         getAttr(name: string, xmlns?: any): any;

//         /**
//          * xmlns can be null
//          **/
//         getChild(name: string, xmlns?: any): Element;

//         /**
//          * xmlns can be null
//          **/
//         getChildren(name: string, xmlns?: any): Element[];

//         /**
//          * xmlns and recursive can be null
//          **/
//         getChildByAttr(attr: any, val: any, xmlns?: any, recursive?: any): Element;

//         /**
//          * xmlns and recursive can be null
//          **/
//         getChildrenByAttr(attr: any, val: any, xmlns?: any, recursive?: any): Element[];

//         getText(): string;

//         getChildText(name: string, xmlns?: any): string;

//         /**
//          * Return all direct descendents that are Elements.
//          * This differs from `getChildren` in that it will exclude text nodes,
//          * processing instructions, etc.
//          */
//         getChildElements(): Element[];

//         /** returns uppermost parent */
//         root(): Element;

//         tree(): Element;

//         /** just parent or itself */
//         up(): Element;

//         /** create child node and return it */
//         c(name: string, attrs?: any): Element;

//         /** add text node and return element */
//         t(text: string): Element;

//         /**
//          * Either:
//          *   el.remove(childEl)
//          *   el.remove('author', 'urn:...')
//          */
//         remove(el: Element, xmlns?: any): Element;

//         clone(): Element;

//         text(val: string): string;

//         attr(attr: any, val: any): any;

//         toString(): string;

//         toJSON(): any;

//         write(writer: any): void;

//         nameEquals(el: Element): boolean;

//         attrsEquals(el: Element): boolean;

//         childrenEquals(el: Element): boolean;

//         equals(el: Element): boolean;
//     }
// }
