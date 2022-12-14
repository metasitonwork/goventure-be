var express = require("express");
var app = express();
var cors = require("cors");
var jwt = require("jsonwebtoken");
var db = require("../connect_db");
const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

const login = {
  async login(req, res) {
    let { username, password } = req.body;
    ssn = req.session;
    let data = await db.con_db(`SELECT * FROM user WHERE username = '${username}' AND  password =   '${password}'  `);
    if (data == false) {
      res.status(400).json({
        status: "400",
        message: "ข้อมูลไม่ถูกต้อง"
      });
    }
    if (data.length == 0) {
      res.status(200).json({
        status: "400",
        list: "ไม่พบข้อมูล"
      });
      return;
    }
    function makeid(length) {
      var result = [];
      var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
      }
      return result.join("");
    }
    let id = data[0]["id_user"];
    let random = makeid(5);
    try {
    } catch (e) {}
    const user = { id: id };
    const token = await jwt.sign({ user }, random);
    ssn.token = token;
    ssn.selt = random;
    res.json({
      data: data,
      token: token
    });
  },
  exit(req, res) {
    delete ssn.selt;
    res.end("");
  },

  async protected(req, res) {
    const { token } = req.body;
    jwt.verify(token, ssn.selt, function(err, data) {
      if (err) {
        res.json({
          text: "Error",
          data: data
        });
      } else {
        res.json({
          status: true,
          text: "this is protected",
          data: data
        });
      }
    });
  },
  async save_member(req, res) {
    res.json({
      data: req.body
    });
  },
  async test_api(req, res) {
    res.json({
      text: "my api!"
    });
  }
};
module.exports = login;
