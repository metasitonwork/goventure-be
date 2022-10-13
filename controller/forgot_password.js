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
  service: "gmail",
  auth: {
    user: "metasitstar@gmail.com",
    pass: "pkchigg81zx"
  }
});
const forgotPassword = {
  async forgot(req, res) {
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
      const url = `http://localhost:3000/forgot?id=${id}&code=${token}`;
      console.log(url, "url");

      var mailOptions = {
        from: "metasitstar@gmail.com",
        to: email,
        subject: "Sending Email using Node.js",
        text: "That was easy!"
      };
      console.log(mailOptions, "mailOptions");

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error, "error");
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      console.log(url, "url");
      res.cookie("forgot", random, { maxAge: 10 * 60 * 1000 });
      res.status(200).json({
        status: 200,
        message: "กรุณาตรวจสอบ Email"
      });
      return;
    }
    console.log(data.length, "data.length");
    // function makeid(length) {
    //   var result = [];
    //   var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    //   var charactersLength = characters.length;
    //   for (var i = 0; i < length; i++) {
    //     result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    //   }
    //   return result.join("");
    // }
    // let id = data[0]["id_user"];
    // let random = makeid(5);
    // try {
    // } catch (e) {}
    // const user = { id: id };
    // const token = await jwt.sign({ user }, random);
    // res.cookie("token", token);
    // res.cookie("selt", random);
    // console.log(req.cookies.selt, "selt");
    // res.json({
    //   data: data,
    //   token: token
    // });
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
