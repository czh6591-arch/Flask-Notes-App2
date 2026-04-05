function DeleteNote(noteid){
  fetch("/delete-note", {
    method: "POST",
    body: JSON.stringify({ noteid: noteid }),
  }).then((_res) => {
    window.location.href = "/";
  });
}

function UpdateNote(noteid, title, data){
  fetch("/update-note", {
    method: "POST",
    body: JSON.stringify({ noteid: noteid, title: title, data: data }),
  }).then((_res) => {
    // 不需要刷新页面，因为我们已经实时更新了UI
  });
}
