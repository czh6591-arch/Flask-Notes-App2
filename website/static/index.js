function DeleteNote(noteid){
  fetch("/delete-note", {
    method: "POST",
    body: JSON.stringify({ noteid: noteid }),
  }).then((_res) => {
    window.location.href = "/";
  });
}

function EditNote(noteid) {
  const noteItem = document.querySelector(`[data-note-id="${noteid}"]`);
  const titleElement = noteItem.querySelector('.note-title');
  const contentElement = noteItem.querySelector('.note-content');
  const editButton = noteItem.querySelector('.note-actions button');
  
  if (editButton.textContent === 'Edit') {
    const currentTitle = titleElement.textContent;
    const currentContent = contentElement.textContent;
    
    titleElement.innerHTML = `<input type="text" class="form-control" value="${currentTitle}" />`;
    contentElement.innerHTML = `<textarea class="form-control" rows="3">${currentContent}</textarea>`;
    editButton.textContent = 'Save';
    editButton.classList.remove('btn-secondary');
    editButton.classList.add('btn-success');
  } else {
    const newTitle = titleElement.querySelector('input').value;
    const newContent = contentElement.querySelector('textarea').value;
    
    fetch("/edit-note", {
      method: "POST",
      body: JSON.stringify({ 
        noteid: noteid,
        title: newTitle,
        note_content: newContent
      }),
    }).then((_res) => {
      window.location.href = "/";
    });
  }
}
