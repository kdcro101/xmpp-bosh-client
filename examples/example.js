var lib = require("xmpp-bosh-client");
var USERNAME = "<<CHANGE_THIS>>";
var PASSWORD = "<<CHANGE_THIS>>";
var URL = "<<CHANGE_THIS>>";

function main() {
    console.log("starting...");
    var connection = new lib.BoshJSClient(USERNAME, PASSWORD, URL);
    connection.on("error", function (e) {
        console.log("Error connecting");
        console.log(e);
    });
    connection.on("online", function () {
        console.log("Connected successfully ");
    });
    connection.on("offline", function () {
        console.log("Is OFFLINE");
    });
}
main();
