const express = require('express')
const { v4: uuidv4 } = require("uuid");
const app = express()
const path = require('path');
const { isEmpty } = require("./function.js");
const bcrypt = require("bcrypt")
const sessions = require('express-session');

var bodyParser = require('body-parser');
const cors = require("cors");
var jwt = require("jsonwebtoken");
app.use(bodyParser.json())
app.use(cors());

var session;

const User = require("./Schema/userSchema.js");
const db = require("./db.js");

db.init();

app.get('/', (req, res) => {
    res.send('Welcome to the User API!');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

app.post('/users', (req, res) => {
    const { name, email, password } = req.body;
    if (isEmpty(email) || isEmpty(password)) {
        return res.status(400).json({ error: "Please fill all the fields" });
      } else {
        bcrypt
        .hash(password, '$2b$10$t7oxiwchWGHa/B9w0AzrYO')
        .then(async password => {
            const userId = uuidv4();
            await db.insertOne("users", {userId: userId, email: email, name: name, password: password});
            return res.status(201).json({ message: "User Register Successfull" });
        })
        .catch(err => console.error(err.message))
    }
});

app.post("/users/login", async (req, res) => {
    const { email, password } = req.body;
    if (isEmpty(email) || isEmpty(password)) {
      return res.status(400).json({ error: "Please fill all the fields" });
    } else {
      const userExist = await db.findOne("users", { email: email });
      console.log(userExist);
      if (userExist) {
        bcrypt
        .hash(password, '$2b$10$t7oxiwchWGHa/B9w0AzrYO')
        .then(async hash => {
            if (userExist.password == hash) {
                const token = jwt.sign(
                  {
                    userId: userExist.userId,
                    name: userExist.name,
                    email: userExist.email,
                  },
                  "secret",
                  { expiresIn: "1h" }
                );
                await db.updateOne("users", userExist.userId, {token: token});
                session = req.session;
                return res.status(200).json({
                  message: "Login successfully",
                  token: token,
                  userId: userExist.userId,
                });
              } else {
                return res.status(400).json({ error: "Invalid Credentials" });
              }
        })
        .catch(err => console.error(err.message))
      } else {
        return res.status(400).json({ error: "User not exists" });
      }
    }
  });

app.get('/users/:id', async (req, res) => {
    const user = await db.findOne("users", { userId: req.params.id });
    if (!user) {
        return res.status(400).json({ error: "User not found" });
    } else {
        return res.status(200).json(user);
    }
});

app.put('/users/:id', async (req, res) => {
    let userId = req.params.id;
    const user = await db.findOne("users", { userId: userId });
    if (!user) {
        return res.status(400).json({ error: "User not found" });
    } else {
        const { name, email, password } = req.body;
        bcrypt
        .hash(password, '$2b$10$t7oxiwchWGHa/B9w0AzrYO')
        .then(async hash => {
            await db.updateOne("users", user.userId, {name: name, email: email, password: hash});
        })
        .catch(err => console.error(err.message))
        return res.status(201).json({ message: "User Update Sucessfully" });
    }
});

app.delete('/users/:id', async (req, res) => {
    let userId = req.params.id;
    const user = await db.findOne("users", {userId : userId});
    if (!user) {
        return res.status(400).json({ error: "User not found" });
    } else {
        await db.deleteOne("users", userId);
        return res.status(200).json({ message: "User Delete Sucessfully" });
    }
});