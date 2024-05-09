const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "/views"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'ParasMERN@12'
});
/*
const {faker} = require('@faker-js/faker');

let getRandomUser = () => {
  return [
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password()
  ];
};

let q = "INSERT INTO user ( username, email, password) VALUES ?";

let data = [];

for (let i = 1; i <= 100; i++) {
  data.push(getRandomUser());
}

try {
  connection.query(q, [data], (err, result) => {
    if (err) throw err;
    console.log(result);
  });
} catch (err) {
  console.log(err);
}
connection.end();
*/

app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("some Error in DATABASE");
  }
});

app.get("/user", (req, res) => {
  let q = `SELECT * FROM USER`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.render("showusers.ejs", { result });
    });
  } catch (err) {
    console.log(err);
    res.send("some Error in DATABASE");
  }
});

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `select * from user where email = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch {
    console, log(err);
    res.send("Some Error IN DB");
  }
});

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  let q = `select * from user where email = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("Wrong Pass");
      } else {
        let q2 = `update user set username=
        '${newUsername}' WHERE email='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch {
    console, log(err);
    res.send("Some Error IN DB");
  }
});

app.get("/addnew", (req, res) => {
  res.render("addNew.ejs");
});

app.post("/addnew", (req, res) => {
  let { username: Username, email: Email, password: Password } = req.body;
  let q3 = `insert into user values ('${Username}','${Email}','${Password}')`;
  connection.query(q3, (err, result) => {
    try {
      if (err) throw err;
      res.redirect("/");
    } catch {
      console.log(err);
      res.send("some Error");
    }
  });
});

app.listen("8080", () => {
  console.log("server is listening to port : 8080")
});

