function DeleteNote(noteid){
  fetch("/delete-note", {
    method: "POST",
    body: JSON.stringify({ noteid: noteid }),
  }).then((_res) => {
    window.location.href = "/";
  });
}

function UpdateNote(noteId, title, data){
  fetch("/update-note", {
    method: "POST",
    body: JSON.stringify({ note_id: noteId, title: title, data: data }),
  }).then((_res) => {
    window.location.href = "/";
  });
}
