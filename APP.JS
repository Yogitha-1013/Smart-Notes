const notesContainer = document.getElementById('notes-container');
const addNoteBtn = document.getElementById('add-note');
const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');

const noteColors = ["#FFFAE3", "#E3FFF3", "#E3F0FF", "#FCE3FF", "#FFE3E3"];

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notesContainer.innerHTML = '';
    notes.forEach((note, index) => {
        createNoteElement(note.title, note.content, index);
    });
    makeNotesDraggable();
}

function saveNotes() {
    const notes = [];
    document.querySelectorAll('.note').forEach(note => {
        const titleEl = note.querySelector('.note-title');
        const contentEl = note.querySelector('.note-content');
        notes.push({
            title: titleEl.innerText || titleEl.value,
            content: contentEl.innerText || contentEl.value
        });
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}

function createNoteElement(title, content, index) {
    const noteEl = document.createElement('div');
    noteEl.className = 'note';
    noteEl.style.setProperty('--note-color', noteColors[index % noteColors.length]);

    const titleEl = document.createElement('div');
    titleEl.className = 'note-title';
    titleEl.innerText = title;

    const contentEl = document.createElement('div');
    contentEl.className = 'note-content';
    contentEl.innerText = content;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'note-buttons';

    const editBtn = document.createElement('button');
    editBtn.innerText = '✏️';
    editBtn.onclick = () => editNote(noteEl, index);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = '🗑️';
    deleteBtn.onclick = () => deleteNote(index);

    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(deleteBtn);

    noteEl.appendChild(buttonContainer);
    noteEl.appendChild(titleEl);
    noteEl.appendChild(contentEl);
    notesContainer.appendChild(noteEl);
}

addNoteBtn.addEventListener('click', () => {
    if (noteTitle.value.trim() && noteContent.value.trim()) {
        createNoteElement(noteTitle.value, noteContent.value);
        saveNotes();
        noteTitle.value = '';
        noteContent.value = '';
    } else {
        alert('Please fill in both the title and content.');
    }
    makeNotesDraggable();
});

function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
}

function editNote(noteEl, index) {
    const titleText = noteEl.querySelector('.note-title').innerText;
    const contentText = noteEl.querySelector('.note-content').innerText;

    noteEl.innerHTML = '';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = titleText;

    const contentInput = document.createElement('textarea');
    contentInput.value = contentText;

    const saveBtn = document.createElement('button');
    saveBtn.innerText = 'SAVE';
    saveBtn.onclick = () => {
        const updatedTitle = titleInput.value;
        const updatedContent = contentInput.value;
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes[index] = { title: updatedTitle, content: updatedContent };
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
    };

    noteEl.appendChild(titleInput);
    noteEl.appendChild(contentInput);
    noteEl.appendChild(saveBtn);
}

function makeNotesDraggable() {
    $(function() {
        $('#notes-container').sortable({
            items: '.note',
            update: function(event, ui) {
                const updatedNotes = [];
                document.querySelectorAll('.note').forEach(note => {
                    const titleEl = note.querySelector('.note-title');
                    const contentEl = note.querySelector('.note-content');
                    updatedNotes.push({
                        title: titleEl ? titleEl.innerText : note.querySelector('input').value,
                        content: contentEl ? contentEl.innerText : note.querySelector('textarea').value
                    });
                });
                localStorage.setItem('notes', JSON.stringify(updatedNotes));
            }
        });
    });
}

loadNotes();
