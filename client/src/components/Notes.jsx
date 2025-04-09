import React, { useState } from 'react';
import './Notes.css';

function Notes() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Data Structures Notes',
      content: 'Key concepts about arrays and linked lists...',
      date: '2024-01-04'
    }
  ]);
  const [activeNote, setActiveNote] = useState(null);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const handleNewNote = () => {
    if (newNote.title && newNote.content) {
      const note = {
        id: Date.now(),
        title: newNote.title,
        content: newNote.content,
        date: new Date().toISOString().split('T')[0]
      };
      setNotes([note, ...notes]);
      setNewNote({ title: '', content: '' });
    }
  };

  return (
    <div className="notes-container">
      <div className="notes-sidebar">
        <div className="notes-header">
          <h2>My Notes</h2>
          <button className="new-note-btn" onClick={() => setActiveNote(null)}>
            New Note
          </button>
        </div>
        <div className="notes-list">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`note-item ${activeNote?.id === note.id ? 'active' : ''}`}
              onClick={() => setActiveNote(note)}
            >
              <h3>{note.title}</h3>
              <p className="note-date">{note.date}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="note-editor">
        {activeNote ? (
          <div className="view-note">
            <h2>{activeNote.title}</h2>
            <p className="note-date">{activeNote.date}</p>
            <p className="note-content">{activeNote.content}</p>
          </div>
        ) : (
          <div className="new-note">
            <input
              type="text"
              placeholder="Note Title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <textarea
              placeholder="Write your note here..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            />
            <button onClick={handleNewNote}>Save Note</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notes;
