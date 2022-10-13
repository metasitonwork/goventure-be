var express = require("express");
var app = express();
let mysql = require("mysql");
var cors = require("cors");
var jwt = require("jsonwebtoken");
app.use(cors());

const Module = {
  ensureToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      jwt.verify(req.token, req.cookies.selt, function(err, data) {
        if (err) {
          console.log("FALSE");
          res.json({
            text: "Error",
            data: data
          });
        } else {
          console.log("True");
          next();
        }
      });
    } else {
      req.sendStatus(403);
    }
  }
};

module.exports = Module;
