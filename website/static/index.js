function DeleteNote(noteid){
  fetch("/delete-note", {
    method: "POST",
    body: JSON.stringify({ noteid: noteid }),
  }).then((_res) => {
    window.location.href = "/";
  });
}

function editNote(noteid) {
  document.getElementById('note-content-' + noteid).style.display = 'none';
  document.getElementById('note-edit-' + noteid).style.display = 'block';
}

function cancelEdit(noteid) {
  document.getElementById('note-content-' + noteid).style.display = 'block';
  document.getElementById('note-edit-' + noteid).style.display = 'none';
}

function saveNote(noteid) {
  var title = document.getElementById('edit-title-' + noteid).value;
  var data = document.getElementById('edit-data-' + noteid).value;
  
  fetch("/update-note", {
    method: "POST",
    body: JSON.stringify({ 
      noteid: noteid,
      title: title,
      data: data 
    }),
  }).then((_res) => {
    window.location.href = "/";
  });
}

function exportNotes() {
  window.location.href = "/export-notes";
}
