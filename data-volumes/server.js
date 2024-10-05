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

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT:${process.env.PORT}`);
});

// docker run -p 3000:8000 --env PORT=8000 -d --rm --name feedback-app -v feedback:/app/feedback -v "D:\coding\docker-complete\data-volumes:/app:ro" -v /app/temp -v /app/node_modules feedback-node:ENV

