const addNewNoteButton = document.getElementById('add-new-note');
const notesBody = document.getElementById('notes-body');
const notesHeader = document.getElementById('notes-header');   
const cancelNote = document.querySelector('.cancel-note')
const finishNote = document.querySelector('.finish-note');
const noteTitleInput = document.getElementById('note-title-input');

function addNewNote() {
    const notes = [];
    document.querySelectorAll('.note').forEach(note => {
        const noteTitle = note.querySelector('.note-title').innerText;
        const noteDate = note.querySelector('.note-date').innerText;
        const noteFirstLine = note.querySelector('.note-firstline').innerText;
        notes.push({ noteTitle: noteTitle, noteDate: noteDate, firstLine: noteFirstLine});
    });
    localStorage.setItem('notes', JSON.stringify(notes));

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

    /*notesBody.innerHTML += 
    `
    <div id="note1" class="note">
        <div class="note-title">
            Test Note
        </div>
        <div class="note-info-container">
            <div class="note-date">
                1-31-2025
            </div>
            <div class="note-firstline">
                This a test of the note preview...
            </div>
        </div>
    </div>
    `;*/
}

function cancelNoteFunc() {
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
    <div id="add-new-note">+</div>
    `;
}

notesHeader.addEventListener('click', function(event) {
    if(event.target.closest('.cancel-note')) {
        cancelNoteFunc();
    }
});

addNewNoteButton.addEventListener('click', () => addNewNote());
