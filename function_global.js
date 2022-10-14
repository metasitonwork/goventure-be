var express = require("express");
var app = express();
var cors = require("cors");
var jwt = require("jsonwebtoken");
app.use(cors());

const Module = {
  ensureToken(req, res, next) {
    try {
      if (!Object.keys(ssn).some(value => value === "token" || value === "selt")) {
        res.json({
          status: 400,
          message: "No Page"
        });
        return;
      }
    } catch (e) {
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
          res.json({
            text: "Error",
            data: data
          });
        } else {
          next();
        }
      });
    } else {
      req.sendStatus(403);
    }
  }
};

module.exports = Module;
