import express = require("express");
import path = require("path");
import ioModule = require("socket.io");
import http = require("http");
import JSONStreamModule = require("JSONStream");

import routes from "./routes/index";
import users from "./routes/user";
import { Request, NextFunction } from "express-serve-static-core";
import { Response } from "express";

let app: express.Express = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/users", users);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction):void {
    let err: Error = new Error("Not Found");
    // tslint:disable-next-line:no-string-literal
    err["status"] = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use((err: any, req, res, next) => {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req, res, next) => {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {}
    });
});

app.set("port", process.env.PORT || 3000);

let server: http.Server = app.listen(app.get("port"), function ():void {
    // console.info("Express server listening on port " + server.address().port);
});

let io: any = ioModule(server);

io.on("connection", function (socket: any):void {
    socket.on("chat message", function (msg: any):void {
        io.emit("chat message", msg);
    });
});