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
    // res.end("TEST");
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
      console.log(url, "url");

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
      console.log(mailOptions, "mailOptions");
      console.log(url, "url");

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          res.end(error.toString());
          console.log(error, "error");
        } else {
          res.status(200).json({
            status: 200,
            message: "กรุณาตรวจสอบ Email"
          });
          // res.end("FALSE");
          // console.log("Email sent: " + info.response);
        }
      });

      // res.cookie("forgot", random, { maxAge: 10 * 60 * 1000 });

      return;
    }
    console.log(data.length, "data.length");
  },
  async reset_password(req, res) {
    let { id, password } = req.body;
    let sqlReset = `  UPDATE user set password = '${password}' WHERE id_user =${id} `;

    let data = await db.con_db(sqlReset);
    console.log(data, "data");
    if (data) {
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
    // res.end(JSON.stringify(ssn).toString());
    jwt.verify(token, ssn.seltForgot, function(err, data) {
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

  exit(req, res) {
    console.log("exit");
    console.log(req.cookies, "before");
    res.clearCookie("selt");
    console.log(req.cookies, "after");
    res.end("");
  },
  async save_member(req, res) {
    // console.log(req.body,'body');
    res.json({
      data: req.body
    });
  }
};
module.exports = forgotPassword;
