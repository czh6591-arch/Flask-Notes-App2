function DeleteNote(noteid){
  fetch("/delete-note", {
    method: "POST",
    body: JSON.stringify({ noteid: noteid }),
  }).then((_res) => {
    window.location.href = "/";
  });
}

function SaveNote(noteid){
  var noteItem = document.querySelector(`li[data-note-id="${noteid}"]`);
  var title = noteItem.querySelector('.note-title-input').value;
  var content = noteItem.querySelector('.note-content-input').value;
  
  fetch("/update-note", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ 
      noteid: noteid,
      title: title,
      content: content
    }),
  })
  .then(response => response.json())
  .then(data => {
    if(data.success){
      alert('笔记保存成功！');
    } else {
      alert('保存失败：' + data.message);
    }
  })
  .catch(error => {
    alert('保存出错：' + error);
  });
}
