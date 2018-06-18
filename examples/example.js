var lib = require("xmpp-bosh-client");
var USERNAME = "session.11e872ed3452fe30953218bc83d3a18ed5fa92c31937476aa67d117aa8d083cd@systest.club";
var PASSWORD = "bfwlfPRhJw2Vp0kOnglao0";
var URL = "https://www.systest.club:5280/http-bind/";

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
