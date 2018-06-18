"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jasmine");
var index_1 = require("../index");
var username = "session.11e872ed3452fe30953218bc83d3a18ed5fa92c31937476aa67d117aa8d083cd@systest.club";
var password = "bfwlfPRhJw2Vp0kOnglao0";
var bosh = "https://www.systest.club:5280/http-bind/";
describe("connect", function () {
    var doneFn = jasmine.createSpy("success");
    var connection = null;
    index_1.setLogLevel("DEBUG");
    beforeEach(function () {
        return new Promise(function (resolve, reject) {
            connection = new index_1.BoshJSClient(username, password, bosh);
            connection.on("error", function (e) {
                console.log("Error connecting");
                console.log(e);
                doneFn(false);
                resolve();
            });
            connection.on("online", function () {
                console.log("Connected SUCCESSFULY ");
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
