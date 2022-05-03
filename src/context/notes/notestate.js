import Notecontext from "./notecontext";
import { useState } from "react";

const Notestate = (props) => {
    const host = "http://localhost:5000"
    //hard coded notes from api
    const initialnotes = []

    const [notes, setNotes] = useState(initialnotes)

    //Get all Notes
    const getNotes = async () => {

        //Api Call
        const url = `${host}/api/notes/fetchallnotes`
        const response = await fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIyZjRlZWYxZmZlZDc0NDc1NDJjZTZmIn0sImlhdCI6MTY0NzI3OTkyNX0.jRsoeUTsiNvXank75FhDqAPs2AgfkpbBYpa-Vtpk-vE'
            }
        });
        const json = await response.json();
        // console.log(json);
        setNotes(json)
    }

    //Add a Note
    const addNote = async (title, description, tag) => {

        //Api Call
        const url = `${host}/api/notes/addnote`
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIyZjRlZWYxZmZlZDc0NDc1NDJjZTZmIn0sImlhdCI6MTY0NzI3OTkyNX0.jRsoeUTsiNvXank75FhDqAPs2AgfkpbBYpa-Vtpk-vE'
            },
            body: JSON.stringify({ title, description, tag }) // body data type must match "Content-Type" header
        });
        // const json = response.json();

        console.log("Adding a new note");
        const note = {
            "title": title,
            "description": description,
            "tag": tag
        }
        setNotes(notes.concat(note))
    }

    //Edit a note
    const editNote = async (id, title, description, tag) => {

        //Api Call
        const url = `${host}/api/notes/updatenote/${id}`
        const response = await fetch(url, {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIyZjRlZWYxZmZlZDc0NDc1NDJjZTZmIn0sImlhdCI6MTY0NzI3OTkyNX0.jRsoeUTsiNvXank75FhDqAPs2AgfkpbBYpa-Vtpk-vE'
            },
            body: JSON.stringify({ title, description, tag }) // body data type must match "Content-Type" header
        });
        // const json = response.json();

        //Logic to edit note in client side
        for (let index = 0; index < notes.length; index++) {
            const element = notes[index];
            if (element._id === id) {
                element.title = title;
                element.description = description;
                element.tag = tag;
            }
        }

    }

    //Delete a Note
    const deleteNote = async (id) => {
        //Api call
        const url = `${host}/api/notes/deletenote/${id}`
        const response = await fetch(url, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIyZjRlZWYxZmZlZDc0NDc1NDJjZTZmIn0sImlhdCI6MTY0NzI3OTkyNX0.jRsoeUTsiNvXank75FhDqAPs2AgfkpbBYpa-Vtpk-vE'
            },
        });
        const json = response.json(); // parses JSON response into native JavaScript objects

        //Logic to delete note
        console.log("Deleting a node with id : " + id);
        const newNotes = notes.filter((note) => { return note._id !== id })
        setNotes(newNotes);
    }
    return (
        <Notecontext.Provider value={{ notes, addNote, editNote, deleteNote, getNotes }}>
            {props.children}
        </Notecontext.Provider>
    )
}

export default Notestate