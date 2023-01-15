const notes = require('express').Router();
const { v4: uuidv4 } = require("uuid");

const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require("../helpers/fsUtils");

// GET request for notes
notes.get("/notes", (req, res) =>
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)))
);

// POST request - this will move to routes
notes.post("/notes", (req, res) => {
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
notes.delete("/notes/:id", (req, res) => {
  const noteId = req.params.id;
  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id !== noteId);

      writeToFile("./db/db.json", result);

      res.json(`Note has been deleted`);
    });
});

module.exports = notes;
