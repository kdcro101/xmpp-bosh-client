declare module "ltx" {
    function clone(el: any): any;
    function createElement(name: string, attrs: any): Element;
    function nameEqual(a: any, b: any): boolean;
    function attrsEqual(a: any, b: any): boolean;
    function childrenEqual(a: any, b: any): boolean;
    function equal(a: any, b: any): boolean;
    function escapeXML(s: string): string;
    function unescapeXML(s: string): string;
    function escapeXMLText(s: string): string;
    function unescapeXMLText(s: string): string;
    function isNode(el: any): boolean;
    function isElement(el: any): boolean;
    function isText(el: any): boolean;
    function parse(data: any, options?: any): any;
    function stringify(el: any, indent: any, level: any): string;
    function tag(d: any): any;
    function tagString(d: any): string;
    class Parser {
        constructor(options?: any);
    }
    class Element {
        name: string;
        parent: Element;
        children: Element[];
        attrs: any;
        constructor(name: string, attrs?: any, ...children: any[]);
        is(name: string, xmlns?: any): boolean;
        getName(): string;
        getNS(): any;
        findNS(prefix: string): any;
        getXmlns(): any;
        setAttrs(attrs: any): void;
        getAttr(name: string, xmlns?: any): any;
        getChild(name: string, xmlns?: any): Element;
        getChildren(name: string, xmlns?: any): Element[];
        getChildByAttr(attr: any, val: any, xmlns?: any, recursive?: any): Element;
        getChildrenByAttr(attr: any, val: any, xmlns?: any, recursive?: any): Element[];
        getText(): string;
        getChildText(name: string, xmlns?: any): string;
        getChildElements(): Element[];
        root(): Element;
        tree(): Element;
        up(): Element;
        c(name: string, attrs?: any): Element;
        t(text: string): Element;
        remove(el: Element, xmlns?: any): Element;
        clone(): Element;
        text(val: string): string;
        attr(attr: any, val: any): any;
        toString(): string;
        toJSON(): any;
        write(writer: any): void;
        nameEquals(el: Element): boolean;
        attrsEquals(el: Element): boolean;
        childrenEquals(el: Element): boolean;
        equals(el: Element): boolean;
    }
}
