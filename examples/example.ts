import { BoshJSClient } from "xmpp-bosh-client";

const USERNAME = "session.11e872ed3452fe30953218bc83d3a18ed5fa92c31937476aa67d117aa8d083cd@systest.club";
const PASSWORD = "bfwlfPRhJw2Vp0kOnglao0";
const URL = "https://www.systest.club:5280/http-bind/";

function main() {

    console.log("starting...");

    const connection = new BoshJSClient(USERNAME, PASSWORD, URL);
    connection.on("error", (e) => {
        console.log("Error connecting");
        console.log(e);
    });
    connection.on("online", () => {
        console.log("Connected successfully ");
    });
    connection.on("offline", () => {
        console.log("Is OFFLINE");
    });
}

main();
