function DeleteNote(noteid){
  fetch("/delete-note", {
    method: "POST",
    body: JSON.stringify({ noteid: noteid }),
  }).then((_res) => {
    window.location.href = "/";
  });
}

function EditNote(noteId) {
    const noteItem = document.querySelector(`.note-item[data-note-id="${noteId}"]`);
    if (!noteItem) return;
    
    const noteView = noteItem.querySelector('.note-view');
    const noteEdit = noteItem.querySelector('.note-edit');
    
    noteView.style.display = 'none';
    noteEdit.style.display = 'block';
}

function CancelEdit(noteId) {
    const noteItem = document.querySelector(`.note-item[data-note-id="${noteId}"]`);
    if (!noteItem) return;
    
    const noteView = noteItem.querySelector('.note-view');
    const noteEdit = noteItem.querySelector('.note-edit');
    
    noteView.style.display = 'block';
    noteEdit.style.display = 'none';
}

function SaveNote(noteId) {
    const noteItem = document.querySelector(`.note-item[data-note-id="${noteId}"]`);
    if (!noteItem) return;
    
    const titleInput = noteItem.querySelector('.note-title-input');
    const dataInput = noteItem.querySelector('.note-data-input');
    
    const newTitle = titleInput.value;
    const newData = dataInput.value;
    
    if (newData.trim() === '') {
        alert('Note content cannot be empty');
        return;
    }
    
    fetch("/update-note", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            noteId: noteId, 
            newTitle: newTitle,
            newData: newData 
        }),
    }).then((_res) => {
        window.location.href = "/";
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            window.location.href = '/export-notes';
        });
    }
});
