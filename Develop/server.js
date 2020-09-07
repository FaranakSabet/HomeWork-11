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
app.get("/api/notes/:id", function (err, res) {
  notes = JSON.parse(
    fs.readFile(path.join(__dirnamem, "/db/db.json"), "utf8"),
    function (err, data) {
      if (err) throw err;
    }
  );
  res.json(notes[Number(req.params.id)]);
});
app.get("*", function (req, res) {
  res.send(path.join(__dirname, "/public/index.html"));
});

app.post("/api/notes", function (req, res) {
  notes = JSON.parse(
    fs.readFileSunc(path.join(__dirname, "/db/db.json"), "utf8")
  );
  newNote = req.body;
  // req.body.id = notes.length +1;
  arrayId = notes.length.toString();
  newNote.id = arrayId;
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

app.delete("/api/notes/:id", function (req, res) {
  notes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8")
  );

  noteId = req.params.id;
  notes = notes.filter((selectNote) => {
    return selectNote.id != noteId;
  });

  fs.writFileSync(
    path.join(__dirname, "/db/db.json"),
    JSON.stringify(notes),
    "utf8",
    function (err) {
      if (err) throw err;
    }
  );
  res.json(notes);
});

app.listen(PORT, () => {
  console.log(`SERVER ISLISTENING port:{PORT}`);
});
