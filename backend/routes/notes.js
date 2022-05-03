const express = require('express')
const router = express.Router();
const Note = require('../models/Note')
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator'); //For validating email, password(length of password)
const User = require('../models/User')

// Route 1 : Add a new note using: POST "/api/auth/addnote". (Login require**)
router.post('/addnote', fetchuser, [
    //Validating name,email and password field.
    body('title', "Invalid Title, Title must be atleast 4 character").isLength({ min: 4 }),
    body('description', "Invalid Description, Description must be atleast 5 character").isLength({ min: 5 })
], async (req, res) => {
    //If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, tag } = req.body;  //Destructuring title,description and tag from body
        const note = new Note({ title, description, tag, user: req.user.id })  //Creating a new note here
        const savedNote = await note.save()  //Saving the note
        res.json(savedNote)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})

// Route 2 : Get all notes of corresponding user using: GET "/api/auth/fetchallnotes". (Login require**)
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })  //Find notes of corresponding user
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})

// Route 3 : Update an existing note using: PUT "/api/auth/updatenote/:id". (Login require**)
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;  //Destructuring title,description and tag from body
    try {//Finding a note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") };

        //Creating a new (updated) note object
        const newNote = {}  
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }
        
        note=await Note.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true})
        res.json({ "Success": "Note has been successfully updated", note: note })

        //Allow deletion only if user owns this note (***Important)
        if (note.user.toString() !== req.user.id) {      //Matching the exisiting user id with loggid in user id
            return res.status(401).send("Not Allowed");
        }
    }catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})

// Route 4 : Deleting an existing note using: Delete "/api/auth/deletenote/:id". (Login require**)
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //Finding a note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") };
        note = await Note.findByIdAndDelete(req.params.id)  //Find and delete note by findByIdAndDelete() method.
        res.json({ "Success": "Note has been successfully deleted", note: note })

        //Allow deletion only if user owns this note (***Important)
        if (note.user.toString() !== req.user.id) {  //Matching the exisiting user id with loggid in user id
            return res.status(401).send("Not Allowed");
        }
    }catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})


module.exports = router