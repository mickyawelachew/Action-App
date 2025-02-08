const addNewNoteButton = document.getElementById('add-new-note');
const notesBody = document.getElementById('notes-body');
const notesHeader = document.getElementById('notes-header');   
const cancelNote = document.querySelector('.cancel-note')
const finishNote = document.querySelector('.finish-note');

var editing = false;
var currentNote = -1;


function addNewNote() {
    notesBody.innerHTML = 
    `
        <input type="text" placeholder="Title" id="note-title-input">
        <textarea id="note-contents">

    `;

    notesHeader.innerHTML = 
    `
    <div class="cancel-note"> 
        Cancel
    </div>
    <div></div>
    <div class="finish-note">
        Done
    </div>
    `;
}

function getFirstLine(noteContent) {
    const text = noteContent.value;
    const lines = text.split('\n');
    return `${lines[0].substring(0,30)}...`;
}

function cancelNoteFunc() {
    repopulateNotes();
}

function repopulateNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notesBody.innerHTML = '';
    notes.forEach((note, index) => {
        const noteHtml = 
        `
        <div id="note-${index}" class="note">
            <div class="note-title">
                ${note.noteTitle}
            </div>
            <div class="note-info-container">
                <div class="note-date">
                    ${note.noteDate}
                </div>
                <div class="note-firstline">
                    ${note.firstLine}
                </div>
            </div>
        </div>
        `;
    notesBody.innerHTML += noteHtml;
    });

    notesHeader.innerHTML = 
    `
    <div></div>
    <div>Notes</div>
    <div id="add-new-note" class="add-new-note">+</div>
    `;
}

function finishNoteFunc() {
    const noteTitleInput = document.getElementById('note-title-input');
    const noteContent = document.getElementById('note-contents');
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteTitle = noteTitleInput.value;
    const noteDate = correctDate;
    const noteFirstLine = getFirstLine(noteContent);
    const content = noteContent.value;
    notes.push({ noteTitle: noteTitle, noteDate: noteDate, firstLine: noteFirstLine, content: content});
    localStorage.setItem('notes', JSON.stringify(notes));
    repopulateNotes();
}

function saveNote() {
    const noteTitleInput = document.getElementById('note-title-input');
    const noteContent = document.getElementById('note-contents');
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteTitle = noteTitleInput.value;
    const noteDate = correctDate;
    const noteFirstLine = getFirstLine(noteContent);
    const content = noteContent.value;
    notes[currentNote] = ({noteTitle: noteTitle, noteDate: noteDate, firstLine: noteFirstLine, content: content});
    localStorage.setItem('notes', JSON.stringify(notes));
    repopulateNotes();
    editing = false;
}

function openNote(event) {
    editing = true;
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const index = event.target.getAttribute('id').replace('note-', '');
    currentNote = index;
    addNewNote();
    notesHeader.innerHTML = 
    `
    <div class="delete-note"> 
        Delete
    </div>
    <div></div>
    <div class="finish-note">
        Done
    </div>
    `;
    const noteTitleInput = document.getElementById('note-title-input');
    const noteContent = document.getElementById('note-contents');
    noteContent.value = notes[index].content;
    noteTitleInput.value = notes[index].noteTitle;
}

function deleteNote() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(currentNote, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    repopulateNotes();
    editing = false;
}
notesHeader.addEventListener('click', function(event) {
    if(event.target.closest('.cancel-note')) {
        cancelNoteFunc();
    }
    if(event.target.closest('.add-new-note')) {
        addNewNote();
    }
    if(event.target.closest('.finish-note')) {
        if(!editing) {
            finishNoteFunc();
        } else {
            saveNote();
        }
    }
    if(event.target.closest('.delete-note')) {
        deleteNote();
    }
});

notesBody.addEventListener('click', function(event) {
    if(event.target.closest('.note')) {
        openNote(event);
    }
});

repopulateNotes();