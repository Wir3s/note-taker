const express = require("express");
const path = require("path");
// const uuid = require("uuid");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const util = require("util");

// Should this be used? It doesn't work currently
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
// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

app.get("/api/notes", (req, res) =>
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)))
);

// Function for reading and appending - this will move to helper folder
const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

// POST request - this will move to routes
app.post("/api/notes", (req, res) => {
  // Destructing assignment for items in req.body
  const { title, text } = req.body;

  // If all required properties are present
  if (title && text) {
    // Variable for the object, a new note
    const newJot = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newJot, "./db/db.json");

    const response = {
      status: "success",
      body: newJot,
    };

    res.json(response);
  } else {
    res.json("Error in posting note");
  }
});

// DELETE route for notes
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id !== noteId);

      writeToFile("./db/db.json", result);

      res.json(`Note has been deleted`);
    });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
