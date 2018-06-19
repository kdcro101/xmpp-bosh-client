interface TestCredentials {
    username: string;
    password: string;
    url: string;
}

import "jasmine";
import { BoshClient } from "../index";
// tslint:disable-next-line:no-var-requires
// const credentials: TestCredentials = require("../test.params.json");
// const credentials: TestCredentials = require("../test.params.json");
import credentials from "../test.params.json";

describe("connect", () => {

    const doneFn = jasmine.createSpy("success");
    let connection: BoshClient = null;
    BoshClient.setLogLevel("DEBUG");

    beforeEach(() => {
        return new Promise((resolve, reject) => {
            connection = new BoshClient(credentials.username, credentials.password, credentials.url);
            connection.on("error", (e) => {
                console.log("Error connecting");
                console.log(e);
                doneFn(false);
                resolve();
            });
            connection.on("online", () => {
                console.log("Connected successfully ");
                doneFn(true);
                resolve();
            });
            connection.on("offline", () => {
                console.log("Is OFFLINE");
                doneFn(false);
                resolve();
            });

        });
    });

    it("should connect", (done) => {
        expect(doneFn).toHaveBeenCalledWith(true);
        done();
    });

    afterAll(() => {
        if (!connection) {
            return;
        }
        connection.disconnect();
        console.log("--------------------");
        console.log("removing listeners");
        console.log("--------------------");

        connection.listeners("online").forEach((l: any) => connection.off("online", l));
        connection.listeners("offline").forEach((l: any) => connection.off("offline", l));
        connection.listeners("error").forEach((l: any) => connection.off("error", l));

    });

});
