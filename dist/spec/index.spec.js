"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jasmine");
var index_1 = require("../index");
var test_params_json_1 = __importDefault(require("../test.params.json"));
describe("connect", function () {
    var doneFn = jasmine.createSpy("success");
    var connection = null;
    index_1.setLogLevel("DEBUG");
    beforeEach(function () {
        return new Promise(function (resolve, reject) {
            connection = new index_1.BoshJSClient(test_params_json_1.default.username, test_params_json_1.default.password, test_params_json_1.default.url);
            connection.on("error", function (e) {
                console.log("Error connecting");
                console.log(e);
                doneFn(false);
                resolve();
            });
            connection.on("online", function () {
                console.log("Connected successfully ");
                doneFn(true);
                resolve();
            });
            connection.on("offline", function () {
                console.log("Is OFFLINE");
                doneFn(false);
                resolve();
            });
        });
    });
    it("should connect", function (done) {
        expect(doneFn).toHaveBeenCalledWith(true);
        done();
    });
    afterAll(function () {
        if (!connection) {
            return;
        }
        connection.disconnect();
        console.log("--------------------");
        console.log("removing listeners");
        console.log("--------------------");
        connection.listeners("online").forEach(function (l) { return connection.off("online", l); });
        connection.listeners("offline").forEach(function (l) { return connection.off("offline", l); });
        connection.listeners("error").forEach(function (l) { return connection.off("error", l); });
    });
});
//# sourceMappingURL=index.spec.js.map