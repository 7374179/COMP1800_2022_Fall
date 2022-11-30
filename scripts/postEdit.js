var postID = localStorage.getItem("postID");

function populateInfo() {
  db.collection("posts").doc(postID).get().then(postDoc => {
    //get the data fields of the user
    var title = postDoc.data().title;
    var name = postDoc.data().nickname;
    var school = postDoc.data().school;
    var category = postDoc.data().category;
    var summary = postDoc.data().short_description;
    var content = postDoc.data().content;

    document.getElementById("title").value = title;
    document.getElementById("name").value = name;
    document.getElementById("school").value = school;
    document.getElementById("category").value = category;
    document.getElementById("short").value = summary;
    document.getElementById("content").value = content;
    
  })
}

//call the function to run it 
populateInfo();

function postEdit() {
  console.log("publishing post")
  let title = document.getElementById("title").value;
  let nickname = document.getElementById("name").value;
  let content = document.getElementById("content").value;
  let school = document.getElementById("school").value;
  let short_description = document.getElementById("short").value;
  let category = document.getElementById("category").value;
  

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid)

      currentUser.get()
        .then(() => {
          db.collection("posts").doc(postID).update({
            title: title,
            nickname: nickname,
            content: content,
            school: school,
            short_description: short_description,
            category: category,
          }).then(()=>{
            console.log("Post has been editted!");
            alert("Post has been editted!");
            history.back();
          })
        })
    } else {
      // No user is signed in.
      console.log("No one is logged in. This shouldn't be happening.");
      window.location.href = "login.html";
    }
  })
}

function confirmEdit() {
  let text = "Do you wish to change this post with its current edits?";
  if (confirm(text) == true) {
      postEdit(postID)
      return true;
  } else{
      return false;
  }
}