const express = require("express");
const path = require("path");
const uuid = require("uuid");
const fs = require("fs");

const notes = require("./db/db.json");

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// GET  route for homepage

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// GET route for notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// GET request for notes - move this to notes.js in /routes
app.get("/api/notes", (req, res) => {
  res.status(200).json(notes);
});

// Function for reading and appending
// const readAndAppend = (content, file) => {
//   fs.readFile(file, 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//     } else {
//       const parsedData = JSON.parse(data);
//       parsedData.push(content);
//       writeToFile(file, parsedData);
//     }
//   });
// };

// POST request
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a review`);
  console.info(`${req.body}`);
  console.info(res.json(req.body));

  // const { title, text } = req.body;
  //
  //   if (req.body) {
  //     const newJot = {
  //       title,
  //       text,
  //       jot_id: uuid(),
  //     };
  //   }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
