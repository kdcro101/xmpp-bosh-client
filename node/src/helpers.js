"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ltx = __importStar(require("ltx"));
var types_1 = require("./types");
exports.XmlElement = types_1.XmlElement;
exports.ltxElement = ltx.Element;
exports.$build = function (xname, attrib) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    var _a;
    return new ((_a = ltx.Element).bind.apply(_a, [void 0, xname, attrib].concat(children)))();
};
exports.$msg = function (attrib) {
    return new ltx.Element("message", attrib);
};
exports.$iq = function (attrib) {
    return new ltx.Element("iq", attrib);
};
exports.$pres = function (attrib) {
    return new ltx.Element("presence", attrib);
};
//# sourceMappingURL=helpers.js.map