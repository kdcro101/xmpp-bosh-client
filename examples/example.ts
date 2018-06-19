import { BoshClient } from "xmpp-bosh-client";

const USERNAME = "<<CHANGE_THIS>>";
const PASSWORD = "<<CHANGE_THIS>>";
const URL = "<<CHANGE_THIS>>";

function main() {

    console.log("starting...");

    const connection = new BoshClient(USERNAME, PASSWORD, URL);
    connection.on("error", (e) => {
        console.log("Error connecting");
        console.log(e);
    });
    connection.on("online", () => {
        console.log("Connected successfully ");
    });
    connection.on("ping", () => {
        console.log(`Ping received at ${new Date()}`);
    });
    connection.on("offline", () => {
        console.log("Is OFFLINE");
    });
}


ma