function DeleteNote(noteid) {
  fetch("/delete-note", {
    method: "POST",
    body: JSON.stringify({ noteid: noteid }),
  }).then((_res) => {
    window.location.href = "/";
  });
}

function EditNote(noteid) {
  document.getElementById(`note-display-${noteid}`).style.display = "none";
  document.getElementById(`note-edit-${noteid}`).style.display = "block";
}

function CancelEdit(noteid) {
  document.getElementById(`note-display-${noteid}`).style.display = "block";
  document.getElementById(`note-edit-${noteid}`).style.display = "none";
}

function SaveNote(noteid) {
  const title = document.getElementById(`edit-title-${noteid}`).value;
  const content = document.getElementById(`edit-content-${noteid}`).value;

  fetch("/update-note", {
    method: "POST",
    body: JSON.stringify({ noteid: noteid, title: title, data: content }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((_res) => {
    window.location.href = "/";
  });
}

function ExportNotes() {
  window.location.href = "/export-notes";
}
