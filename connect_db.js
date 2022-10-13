var express = require("express");
var app = express();
let mysql = require("mysql");
// const mysql = require("serverless-mysql");
var cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
app.use(cors());
let pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DB_DATABASE
});

let db = {
  async con_db(str) {
    return await new Promise((resolve, reject) => {
      pool.query(str, (error, elements) => {
        if (error) {
          resolve(false);
          console.log("ERROR");
        }
        return resolve(elements);
      });
    });
  }
};
module.exports = db;
