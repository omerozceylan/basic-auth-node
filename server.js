const express = require("express");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

const PORT = 3000;

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).send(users);
  } catch {
    res.status(500).send();
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.name == req.body.name);
  if (!user) return res.status(400).send("cannot find user");
  const isSuccess = await bcrypt.compare(req.body.password, user.password);
  try {
    if (isSuccess) {
      res.send({ isSuccess: true, message: "Success" });
    } else {
      res.send({ isSuccess: false, message: "Wrong Password" });
    }
  } catch {
    res.status(500).send();
  }
});

app.listen(PORT, () => {
  console.log(`listening ${PORT}`);
});
