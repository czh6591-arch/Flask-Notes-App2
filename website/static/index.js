function DeleteNote(noteid){
  fetch("/delete-note", {
    method: "POST",
    body: JSON.stringify({ noteid: noteid }),
  }).then((_res) => {
    window.location.href = "/";
  });
}

function UpdateNote(noteid){
  const noteItem = document.querySelector(`[data-note-id="${noteid}"]`);
  const title = noteItem.querySelector('.note-title').value;
  const noteContent = noteItem.querySelector('.note-content').value;
  
  fetch("/update-note", {
    method: "POST",
    body: JSON.stringify({ 
      noteid: noteid,
      title: title,
      note_content: noteContent
    }),
  }).then((_res) => {
    console.log("Note updated successfully");
  });
}
