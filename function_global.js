var express = require("express");
var app = express();
let mysql = require("mysql");
var cors = require("cors");
var jwt = require("jsonwebtoken");
app.use(cors());

const Module = {
  ensureToken(req, res, next) {
    if (!ssn) {
      res.json({
        status: 400,
        message: "No Page"
      });
      return;
    }
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      jwt.verify(ssn.token, ssn.selt, function(err, data) {
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
