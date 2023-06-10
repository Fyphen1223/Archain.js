const express = require("express");
const EventEmitter = require("stream");
const search = require("@yimura/scraper");
const wait = require("node:timers").setTimeout;
const ytdl = require("ytdl-core");
const bodyParser = require("body-parser");
const expressSession = require("express-session");

export class archain {
    constructor(port, ram, settings) {
        this.port = port;
        this.settings = settings;
        this.serverStatus = false;
        this._events = {};
        this.ram = ram;
    }
    on(name, listener) {
        if (!this._events[name]) {
          this._events[name] = [];
        }
        this._events[name].push(listener);
        return;
    }
    emit(name, data) {
        if (!this._events[name]) {
          throw new Error(`Cannot emit an event. Event "${name}" doesn't exit`);
        }
        const fireCallbacks = (callback) => {
          callback(data);
        };
        this._events[name].forEach(fireCallbacks);
        return;
    }
    removeListener(name, listenerToRemove) {
        if (!this._events[name]) {
          throw new Error(`Cannot remove a listener. Event "${name}" does not exist`);
        }
        const filterListeners = (listener) => listener !== listenerToRemove;
        this._events[name] = this._events[name].filter(filterListeners);
        return;
    }
    async start() {
        const server = express();
        this.server = server;
        if(typeof(this.port) !== Number) { 
            throw new AssignError("Unauthorized port number. Assign Int");
            return;
        }
        try {
            await server.listen(this.port, function() {
                this.serverStatus = true;
                this.emit("start", 200);
                return;
            });
        } catch(err) {
            throw new NetworkError("Requested port is not available");
            return;
        }
        server.get("/", async function(req, res) {
            res.send("The server is wake up");
        });
        server.get("/search", async function(req, res) {
            
        });
        server.get("/download", async function(req, res) {
            const query = req.query || "";
            if(!query || !ytdl.validateURL(query.id)) {
                res.send('{"status": 404,"message": "Error: Unknown URL"}');
                return;
            }
            try {
                const stream = ytdl(ytdl.getURLVideoID(url), {
                    filter: format => format.audioCodec === 'opus' && format.container === 'webm',
                    quality: 'highest',
                    highWaterMark: this.ram * 1024 * 1024,
                });
                res.set({
                    "Content-Type": "audio/webm"
                });
                res.send(stream);
            } catch(err) {
                res.send('{"status": 404,"message": "Error: Unknown URL"}');
                console.log(err.stack);
                return;
            }
        });
        return;
    }
    async stop(time) {
        if(!this.server || !this.serverStatus) {
            throw new Error("The Server is not wake up");
        }
        if(time) {
            await wait(time);
        }
        try {
            await this.server.close();
        } catch(err) {
            throw new Error("Cannot close the server");
        }
        return;
    }
}