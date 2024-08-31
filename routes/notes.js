const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// Route 1: Get All the Notes using: GET "/api/notes/fetchallnotes"
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 2: Add a new Note using: POST "/api/notes/addnote"
router.post('/addnote', fetchUser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('content', 'Content must be at least 5 characters').isLength({ min: 5 }),
    body('tag', 'Tag must be a string').optional().isString()
], async (req, res) => {
    try {
        const { title, content, tag } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title,
            content,
            tag,
            userId: req.user.id
        });
        const savedNote = await note.save();

        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 3: Update an existing Note using: PUT "/api/notes/updatenote/:id"
router.put('/updatenote/:id', fetchUser, [
    body('title', 'Enter a valid title').optional().isLength({ min: 3 }),
    body('content', 'Content must be at least 5 characters').optional().isLength({ min: 5 }),
    body('tag', 'Tag must be a string').optional().isString()
], async (req, res) => {
    const { title, content, tag } = req.body;

    try {
        let newNote = {};
        if (title) newNote.title = title;
        if (content) newNote.content = content;
        if (tag) newNote.tag = tag;

        let note = await Note.findById(req.params.id);
        if (!note) return res.status(404).send("Not Found");

        if (note.userId.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 4: Delete an existing Note using: DELETE "/api/notes/deletenote/:id"
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note) return res.status(404).send("Not Found");

        if (note.userId.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
