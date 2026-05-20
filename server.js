import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

let notes = [
    {
        id: uuidv4(),
        title: "Learn Express",
        description: "Practice REST CRUD routes."
    },
    {
        id: uuidv4(),
        title: "Mini Notes Project",
        description: "Build notes app step by step."
    }
];

app.get("/", (req, res) => {
    res.redirect("/notes");
});

app.get("/notes", (req, res) => {
    res.render("index", { notes });
});

app.get("/notes/new", (req, res) => {
    res.render("new");
});

app.post("/notes", (req, res) => {
    let { title, description } = req.body;

    let newNote = {
        id: uuidv4(),
        title,
        description
    };

    notes.push(newNote);

    res.redirect("/notes");
});

app.get("/notes/:id", (req, res) => {
    let { id } = req.params;
    let note = notes.find((note) => id === note.id);

    res.render("show", { note });
});

app.get("/notes/:id/edit", (req, res) => {
    let { id } = req.params;
    let note = notes.find((note) => id === note.id);

    res.render("edit", { note });
});

app.patch("/notes/:id", (req, res) => {
    let { id } = req.params;
    let { title, description } = req.body;

    let note = notes.find((note) => id === note.id);

    note.title = title;
    note.description = description;

    res.redirect(`/notes/${id}`);
});

app.delete("/notes/:id", (req, res) => {
    let { id } = req.params;

    notes = notes.filter((note) => id !== note.id);

    res.redirect("/notes");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});