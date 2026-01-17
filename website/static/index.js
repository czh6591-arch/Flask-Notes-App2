function DeleteNote(noteid){
  fetch("/delete-note", {
    method: "POST",
    body: JSON.stringify({ noteid: noteid }),
  }).then((_res) => {
    window.location.href = "/";
  });
}

function loadNote(noteId, noteTitle, noteData) {
  document.getElementById('noteId').value = noteId;
  document.getElementById('noteTitle').value = noteTitle;
  document.getElementById('note').value = noteData;
}
