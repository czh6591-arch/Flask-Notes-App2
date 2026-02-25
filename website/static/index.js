function DeleteNote(noteid){
  fetch("/delete-note", {
    method: "POST",
    body: JSON.stringify({ noteid: noteid }),
  }).then((_res) => {
    window.location.href = "/";
  });
}

function toggleEdit(noteid) {
  const titleView = document.getElementById('title-view-' + noteid);
  const titleInput = document.getElementById('title-input-' + noteid);
  const contentView = document.getElementById('content-view-' + noteid);
  const contentInput = document.getElementById('content-input-' + noteid);
  const editBtn = document.getElementById('edit-btn-' + noteid);
  const saveBtn = document.getElementById('save-btn-' + noteid);

  titleView.classList.toggle('d-none');
  titleInput.classList.toggle('d-none');
  contentView.classList.toggle('d-none');
  contentInput.classList.toggle('d-none');
  editBtn.classList.toggle('d-none');
  saveBtn.classList.toggle('d-none');
}

function saveNote(noteid) {
  const newTitle = document.getElementById('title-input-' + noteid).value;
  const newData = document.getElementById('content-input-' + noteid).value;

  fetch("/update-note", {
    method: "POST",
    body: JSON.stringify({ 
      noteid: noteid,
      title: newTitle,
      data: newData 
    }),
  }).then((res) => res.json()).then((data) => {
    if (data.success) {
      document.getElementById('title-view-' + noteid).innerText = newTitle;
      document.getElementById('content-view-' + noteid).innerText = newData;
      toggleEdit(noteid);
      window.location.href = "/";
    }
  });
}

function exportNotes() {
  window.location.href = "/export-notes";
}
