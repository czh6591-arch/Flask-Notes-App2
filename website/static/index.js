function DeleteNote(noteid){
  fetch("/delete-note", {
    method: "POST",
    body: JSON.stringify({ noteid: noteid }),
  }).then((_res) => {
    window.location.href = "/";
  });
}

// Edit note functionality
document.addEventListener('DOMContentLoaded', function() {
  // Handle edit button clicks
  const editButtons = document.querySelectorAll('.edit-btn');
  editButtons.forEach(button => {
    button.addEventListener('click', function() {
      const noteId = this.getAttribute('data-note-id');
      const noteItem = document.querySelector(`.note-item[data-note-id="${noteId}"]`);
      const editForm = noteItem.querySelector('.edit-form');
      const noteContent = noteItem.querySelector('.note-content');
      const noteHeader = noteItem.querySelector('.note-header');
      
      // Toggle visibility
      if (editForm.style.display === 'none') {
        editForm.style.display = 'block';
        noteContent.style.display = 'none';
        this.textContent = '取消编辑';
      } else {
        editForm.style.display = 'none';
        noteContent.style.display = 'block';
        this.textContent = '编辑';
      }
    });
  });
  
  // Handle save button clicks
  const saveButtons = document.querySelectorAll('.save-btn');
  saveButtons.forEach(button => {
    button.addEventListener('click', function() {
      const noteId = this.getAttribute('data-note-id');
      const noteItem = document.querySelector(`.note-item[data-note-id="${noteId}"]`);
      const titleInput = noteItem.querySelector('.edit-title');
      const contentInput = noteItem.querySelector('.edit-content');
      
      const title = titleInput.value;
      const content = contentInput.value;
      
      fetch("/edit-note", {
        method: "POST",
        body: JSON.stringify({ 
          noteid: noteId,
          title: title,
          data: content
        }),
      }).then((_res) => {
        window.location.href = "/";
      });
    });
  });
  
  // Handle cancel button clicks
  const cancelButtons = document.querySelectorAll('.cancel-btn');
  cancelButtons.forEach(button => {
    button.addEventListener('click', function() {
      const noteItem = this.closest('.note-item');
      const editForm = noteItem.querySelector('.edit-form');
      const noteContent = noteItem.querySelector('.note-content');
      const editButton = noteItem.querySelector('.edit-btn');
      
      editForm.style.display = 'none';
      noteContent.style.display = 'block';
      editButton.textContent = '编辑';
    });
  });
  
  // Handle export button click
  const exportButton = document.getElementById('exportBtn');
  if (exportButton) {
    exportButton.addEventListener('click', function() {
      window.location.href = "/export-notes";
    });
  }
});
