const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3001;
const notesRouter = require("./routes/notes");
const app = express();

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/notes", notesRouter);

app.use(express.static("public"));

// GET  route for homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// GET route for notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
