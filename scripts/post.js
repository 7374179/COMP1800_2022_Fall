function populateInfo() {
  firebase.auth().onAuthStateChanged(user => {
      // Check if user is signed in:
      if (user) {

          //go to the correct user document by referencing to the user uid
          currentUser = db.collection("users").doc(user.uid)
          //get the document for current user.
          currentUser.get()
              .then(userDoc => {
                  //get the data fields of the user
                  var userName = userDoc.data().name;
                  var userSchool = userDoc.data().school;

                  //if the data fields are not empty, then write them in to the form.
                  if (userName != null) {
                      document.getElementById("name").value = userName;
                  }
                  if (userSchool != null) {
                      document.getElementById("school").value = userSchool;
                  }
              })
      } else {
          // No user is signed in.
          console.log ("No user is signed in");
      }
  });
}

//call the function to run it 
populateInfo();

function postPost() {
  console.log("publishing post")
  let title = document.getElementById("title").value;
  let nickname = document.getElementById("name").value;
  let content = document.getElementById("content").value;
  let school = document.getElementById("school").value;
  let short_description = document.getElementById("short").value;
  let catagory = document.getElementById("catagory").value;

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid)

      currentUser.get()
        .then(userDoc => {
          db.collection("posts").add({
            code: "POST" + Math.floor(Math.random() * 100000000),
            title: title,
            nickname: nickname,
            content: content,
            school: school,
            short_description: short_description,
            catagory: catagory,
          }).then(()=>{
            console.log("Post has been posted!");
            alert("Post has been posted!");
            window.location = "board.html";
          })
        })
    } else {
      // No user is signed in.
      console.log("No one is logged in. This shouldn't be happening.")
    }
  })
}

function confirmPost() {
  let text = "Are you sure you want to post this?";
  if (confirm(text) == true) {
      postPost()
      return true;
  } else{
      return false;
  }
}