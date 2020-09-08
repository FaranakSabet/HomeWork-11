var express = require("express"),
  app = express(),
  path = require("path"),
  fs = require("fs"),
  PORT = process.env.PORT || 3000,
  notes = require("./db/db.json");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});
app.get("/api/notes/:id", function (req, res) {
  notes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8")
  );

  console.log("notes", notes);

  const note = notes.find((note) => note.id === Number(req.params.id));

  if (note != null) {
    res.json(note);
  } else {
    res.sendStatus(404).render("Not found");
  }
});

app.get("*", function (req, res) {
  res.send(path.join(__dirname, "/public/index.html"));
});

//  CREATE NEW NOTE

app.post("/api/notes", function (req, res) {
  notes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8")
  );
  newNote = req.body;
  console.log("new note", req.body);
  newNote.id = notes.length + 1;
  notes.push(newNote);

  fs.writeFileSync(
    path.join(__dirname, "/db/db.json"),
    JSON.stringify(notes),
    "utf8",
    function (err) {
      if (err) throw err;
    }
  );
  res.json(notes);
});

// Update Note Information
app.post("/api/notes/:id", function (req, res) {
  notes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8")
  );

  let i = notes.findIndex((note) => note.id === Number(req.params.id));

  if (i != null) {
    notes[i].title = req.body.title;
    notes[i].text = req.body.text;

    updateNotesDB(notes);

    res.json(notes);
  } else {
    res.status(404).render("Note not found");
  }
});

app.delete("/api/notes/:id", function (req, res) {
  notes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8")
  );

  noteId = req.params.id;
  notes = notes.filter((selectNote) => {
    return selectNote.id != noteId;
  });

  console.log(notes);
  updateNotesDB(notes);

  res.json(notes);
});

app.listen(PORT, () => {
  console.log(`SERVER IS LISTENING port: ${PORT}`);
});

function updateNotesDB(notes) {
  fs.writeFileSync(
    path.join(__dirname, "/db/db.json"),
    JSON.stringify(notes),
    "utf8",
    function (err) {
      if (err) throw err;
    }
  );
}
