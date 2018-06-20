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

            connection.connect();

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
        connection.removeAllListeners();

    });

});
