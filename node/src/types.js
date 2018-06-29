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
require("../types/ltx");
exports.BoshJsLogLevel = {
    FATAL: 0,
    ERROR: 1,
    INFO: 2,
    DEBUG: 3,
};
var BoshClientErrorEnum;
(function (BoshClientErrorEnum) {
    BoshClientErrorEnum["auth_error"] = "auth_error";
    BoshClientErrorEnum["xml_parsing_error"] = "xml_parsing_error";
    BoshClientErrorEnum["binding_error"] = "binding_error";
    BoshClientErrorEnum["session_create_error"] = "session_create_error";
    BoshClientErrorEnum["start_sasl_error"] = "start_sasl_error";
    BoshClientErrorEnum["plain_sasl_unavailable_error"] = "plain_sasl_unavailable_error";
})(BoshClientErrorEnum = exports.BoshClientErrorEnum || (exports.BoshClientErrorEnum = {}));
//# sourceMappingURL=types.js.map