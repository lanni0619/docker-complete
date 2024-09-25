// Course note
// A)
// Running with 3 kinds of data to demonstrate mananging data.
// Source code with environment, temporary data and permanent data
// dockerize this app & solving problem with tools that docker give us.

// B) Recording the command in course

// B-1)
// docker build -t feedback-node .
// docker run -p 3000:80 -d --rm --name feedback-app feedback-node
// docker run -p 3000:80 -d --name feedback-app feedback-node

// B-2)
// Adding VOLUMES instruction
// docker build -t feedback-node:volumes .
// docker run -p 3000:80 -d --rm --name feedback-app feedback-node:volumes
// Getting error when running container => Fixed the source code => fs.rename
// After fixed it => Still not working => why ???

const fs = require("fs").promises;
const exists = require("fs").exists;
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));
app.use("/feedback", express.static("feedback"));

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "pages", "feedback.html");
  res.sendFile(filePath);
});

app.get("/exists", (req, res) => {
  const filePath = path.join(__dirname, "pages", "exists.html");
  res.sendFile(filePath);
});

app.post("/create", async (req, res) => {
  const title = req.body.title;
  const content = req.body.text;

  const adjTitle = title.toLowerCase();

  // Temperary data => OK with loosing
  const tempFilePath = path.join(__dirname, "temp", adjTitle + ".txt");
  // Permanent data
  const finalFilePath = path.join(__dirname, "feedback", adjTitle + ".txt");

  await fs.writeFile(tempFilePath, content);
  exists(finalFilePath, async (exists) => {
    if (exists) {
      res.redirect("/exists");
    } else {
      // Crashed when adding "VOLUME" instruction in dockerfile
      // await fs.rename(tempFilePath, finalFilePath);
      await fs.copyFile(tempFilePath, finalFilePath);
      await fs.unlink(tempFilePath);
      res.redirect("/");
    }
  });
});

app.listen(80);

