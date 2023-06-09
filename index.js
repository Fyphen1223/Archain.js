const express = require("express");

export class archain {
    constructor(port, settings) {
        this.port = port;
        this.settings = settings;
    }
    start() {
        const server = express();
        if(typeof(this.port) !== Number) { 
            throw new AssignError("Unauthorized port number. Assign Int.");
            return;
        }
        server.listen(this.port);
        server.get("/", async function(req, res) {
            res.send("The server is wake up");
        });
        server.get("/search", async function(req, res) {
            
        });
    }
}