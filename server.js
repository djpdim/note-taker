const express = require("express")
const fs = require("fs")
const path = require("path")

const PORT = process.env.PORT || 3001

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))

const { notes } = require("./data/db.json")

function createNewNote(body, notesArray) {
    const note = body
    notesArray.push(note)

    fs.writeFileSync(path.join(__dirname, "./data/db.json"), JSON.stringify({ notes: notesArray }, null, 2))
    return note
}

function validateNote(note) {
    if (!note.title || typeof note.title !== "string") {
        return false
    }
    if (!note.text || typeof note.text !== "string") {
        return false
    }
    return true
}

app.get("/api/notes", (req, res) => {
    res.json(notes)
})

app.post("/api/notes", (req, res) => {
    req.body.id = notes.length.toString()

    if (!validateNote(req.body)) {
        res.status(400).send("The note is not properly formatted.")
    } else {
        const note = createNewNote(req.body, notes)

        res.json(note)
    }
})

app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id
    let note

    notes.map((element, index) => {
        if (element.id == id) {
            note = element
            notes.splice(index, 1)
            return res.json(note)
        }
    })
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
})
