function DeleteNote(noteid){
  fetch("/delete-note", {
    method: "POST",
    body: JSON.stringify({ noteid: noteid }),
  }).then((_res) => {
    window.location.href = "/";
  });
}

function UpdateNote(noteid){
  const title = document.getElementById(`title-${noteid}`).value;
  const data = document.getElementById(`content-${noteid}`).value;
  
  fetch("/update-note", {
    method: "POST",
    body: JSON.stringify({ noteid: noteid, title: title, data: data }),
  }).then((_res) => {
    alert("Note updated successfully!");
  });
}
