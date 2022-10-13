var express = require("express");
var app = express();
var cors = require("cors");
var db = require("../connect_db");
var md5 = require("md5");
app.use(cors());
const User = {
  test(req, res) {
    res.json({ status: "success" });
  },
  async get_user(req, res) {
    let list_sql = await db.con_db(` SELECT * FROM user ORDER BY id_user DESC `);
    res.json({ data: list_sql });
  },
  async check_user(req, res) {
    let { username } = req.body;
    let sql_check = `SELECT * FROM user WHERE username = '${username}' `;
    let list_sql = await db.con_db(sql_check);
    if (list_sql.length > 0) {
      res.json({
        status: 400,
        message: "มี Username อยู่ในระบบแล้ว"
      });
    } else {
      res.json({
        status: 200,
        message: "User Success"
      });
    }
  },
  async add_user(req, res) {
    let { username, password, name, surname, email } = req.body;
    let sql_insert = `
        INSERT INTO user (id_user, username, password, name, surname, email, created_date, update_date) VALUES
        (NULL, '${username}', '${password}', '${name}', '${surname}', '${email}' , current_timestamp(), current_timestamp())
    `;

    let data = await db.con_db(sql_insert);
    if (data.affectedRows > 0) {
      res.json({
        status: 200,
        message: "เพิ่มข้อมูลสำเร็จ"
      });
    } else {
      res.send("Error");
      // res.end("Error");
    }
  },
  async update_user(req, res) {
    let { username, password, name, surname, email, id_user } = req.body;
    let sql_insert = `
    UPDATE user SET username = '${username}', password ='${password}',name = '${name}', surname = '${surname}' ,email = '${email}' WHERE id_user = '${id_user}'
    `;

    let data = await db.con_db(sql_insert);
    if (data.affectedRows > 0) {
      res.json({
        status: 200,
        message: "Update ข้อมูลสำเร็จ"
      });
    } else {
      res.json({
        status: 400,
        message: "Update Error"
      });

      // res.send("Error");
      // res.end("Error");
    }
  },
  async delete_user(req, res) {
    let { id_user } = req.body;
    let sql_insert = `DELETE  FROM user  WHERE id_user = '${id_user}'`;

    let data = await db.con_db(sql_insert);
    if (data.affectedRows > 0) {
      res.json({
        status: 200,
        message: "Delete ข้อมูลสำเร็จ"
      });
    } else {
      res.json({
        status: 400,
        message: "Delete Error"
      });
    }
  },

  async search_user(req, res) {
    let { search } = req.body;
    let sql_search = `SELECT * FROM user WHERE 
    username LIKE '%${search}%' OR
    name LIKE '%${search}%' OR
    surname LIKE '%${search}%' OR 
    email LIKE '%${search}%' 
    `;
    let list_sql = await db.con_db(sql_search);
    res.json({ data: list_sql });
  }
};
module.exports = User;
