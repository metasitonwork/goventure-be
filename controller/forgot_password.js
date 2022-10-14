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
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 587,
  auth: {
    user: "metasitstar@gmail.com",
    pass: "gruhjaewzjtidqbr"
  }
});
const forgotPassword = {
  async forgot(req, res) {
    ssn = req.session;
    let { email } = req.body;
    let data = await db.con_db(`SELECT * FROM user WHERE email = '${email}'  `);
    if (data.length === 0) {
      res.status(200).json({
        status: 400,
        message: "ไม่พบข้อมูล"
      });
      return;
    } else if (data.length === 1) {
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
      const user = { id: id };
      let random = makeid(5);
      const token = await jwt.sign({ user }, random);
      ssn.seltForgot = random;
      ssn.tokenForgot = token;
      const url = `http://localhost:3000/reset_password?id=${id}&code=${token}`;
      var mailOptions = {
        from: "metasitstar@gmail.com",
        to: email,
        subject: "Sending Email using Node.js",
        html: `
        <h2>กรุณาสร้างรหัสผ่านใหม่</h2>
        <div>
          <a href='${url}'>${url}</a> 
        </div>
        `
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          res.end(error.toString());
        } else {
          res.status(200).json({
            status: 200,
            message: "กรุณาตรวจสอบ Email"
          });
        }
      });
      return;
    }
  },
  async reset_password(req, res) {
    let { id, password } = req.body;
    let sqlReset = `  UPDATE user set password = '${password}' WHERE id_user =${id} `;

    let data = await db.con_db(sqlReset);
    if (data) {
      delete ssn.seltForgot;
      delete ssn.tokenForgot;
      res.json({
        status: 200,
        message: "change password success"
      });
    } else {
      res.json({
        status: 400,
        message: "change not success"
      });
    }
  },

  async protectedForgot(req, res) {
    const { token, id } = req.body;
    jwt.verify(token, ssn.seltForgot, function(err, data) {
      if (err) {
        res.json({
          text: "Error",
          data: data,
          status: 400
        });
      } else {
        res.json({
          status: true,
          text: "this is protected",
          data: data,
          status: 200
        });
      }
    });
  },

  exit(req, res) {
    res.clearCookie("selt");
    res.end("");
  },
  async save_member(req, res) {
    res.json({
      data: req.body
    });
  }
};
module.exports = forgotPassword;
