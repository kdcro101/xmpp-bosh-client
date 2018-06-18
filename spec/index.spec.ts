import "jasmine";
import { BoshJSClient, setLogLevel } from "../index";

const username = "session.11e872ed3452fe30953218bc83d3a18ed5fa92c31937476aa67d117aa8d083cd@systest.club";
const password = "bfwlfPRhJw2Vp0kOnglao0";
const bosh = "https://www.systest.club:5280/http-bind/";

describe("connect", () => {

    const doneFn = jasmine.createSpy("success");
    let connection: BoshJSClient = null;
    setLogLevel("DEBUG");

    beforeEach(() => {
        return new Promise((resolve, reject) => {
            connection = new BoshJSClient(username, password, bosh);
            connection.on("error", (e) => {
                console.log("Error connecting");
                console.log(e);
                doneFn(false);
                resolve();
            });
            connection.on("online", () => {
                console.log("Connected SUCCESSFULY ");
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