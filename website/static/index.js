function DeleteNote(noteid){
  fetch("/delete-note", {
    method: "POST",
    body: JSON.stringify({ noteid: noteid }),
  }).then((_res) => {
    window.location.href = "/";
  });
}

function getNoteElement(noteid) {
  return document.querySelector(`.note-item[data-note-id="${noteid}"]`);
}

function StartEdit(noteid) {
  const noteEl = getNoteElement(noteid);
  if (!noteEl) return;
  
  const noteView = noteEl.querySelector('.note-view');
  const noteEdit = noteEl.querySelector('.note-edit');
  const titleInput = noteEl.querySelector('.note-title-input');
  const contentInput = noteEl.querySelector('.note-content-input');
  
  const currentTitle = noteEl.querySelector('.note-title').textContent.trim();
  const currentContent = noteEl.querySelector('.note-content').textContent.trim();
  
  titleInput.value = currentTitle === '无标题' ? '' : currentTitle;
  contentInput.value = currentContent;
  
  noteView.style.display = 'none';
  noteEdit.style.display = 'block';
  
  titleInput.focus();
}

function CancelEdit(noteid) {
  const noteEl = getNoteElement(noteid);
  if (!noteEl) return;
  
  const noteView = noteEl.querySelector('.note-view');
  const noteEdit = noteEl.querySelector('.note-edit');
  
  noteView.style.display = 'block';
  noteEdit.style.display = 'none';
}

function SaveNote(noteid) {
  const noteEl = getNoteElement(noteid);
  if (!noteEl) return;
  
  const titleInput = noteEl.querySelector('.note-title-input');
  const contentInput = noteEl.querySelector('.note-content-input');
  
  const newTitle = titleInput.value.trim();
  const newContent = contentInput.value.trim();
  
  if (newContent.length < 1) {
    alert('笔记内容不能为空');
    return;
  }
  
  fetch("/update-note", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      noteid: noteid,
      title: newTitle,
      data: newContent
    }),
  }).then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const noteTitle = noteEl.querySelector('.note-title');
        const noteContent = noteEl.querySelector('.note-content');
        
        noteTitle.textContent = newTitle || '无标题';
        noteContent.textContent = newContent;
        
        CancelEdit(noteid);
      } else {
        alert('保存失败，请重试');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('保存失败，请重试');
    });
}

function ExportNotes() {
  fetch("/export-notes")
    .then(response => response.text())
    .then(content => {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'notes.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('Export failed:', error);
      alert('导出笔记失败，请重试');
    });
}
