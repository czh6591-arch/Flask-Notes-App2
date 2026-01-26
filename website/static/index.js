function DeleteSelectedNotes(){
  const checkboxes = document.querySelectorAll('.note-checkbox:checked');
  const selectedNoteIds = Array.from(checkboxes).map(cb => cb.value);
  
  if (selectedNoteIds.length === 0) {
    // 二次确认是否删除全部
    if (confirm('Are you sure you want to delete all notes?')) {
      fetch("/delete-notes", {
        method: "POST",
        body: JSON.stringify({ noteids: [], deleteAll: true }),
      }).then((_res) => {
        window.location.href = "/";
      });
    }
  } else {
    // 删除选中的笔记
    fetch("/delete-notes", {
      method: "POST",
      body: JSON.stringify({ noteids: selectedNoteIds, deleteAll: false }),
    }).then((_res) => {
      window.location.href = "/";
    });
  }
}
