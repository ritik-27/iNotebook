import React, { useContext } from 'react'
import Notecontext from '../context/notes/notecontext'

const Noteitem = (props) => {
    const context = useContext(Notecontext);
    const { deleteNote } = context;

    const { note, updateNote } = props;
    return (
        <>
            <div className="col-md-3">
                <div className="card my-3">
                    <div className="card-body">
                        <div className="d-flex justify-content-between">
                            <h5 className="card-title">{note.title}</h5>
                            <div>
                                <i className="fa-solid fa-file-pen mx-1 my-2 fa-xl" onClick={() => { updateNote(note) }}></i>
                                <i className="fa-solid fa-trash mx-1 my-2 fa-lg" onClick={() => { deleteNote(note._id) }}></i>
                            </div>
                        </div>
                        <p className="card-text">{note.description}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Noteitem