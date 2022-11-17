var currentUser;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid);   //global
        console.log(currentUser);

        // the following functions are always called when someone is logged in
        populateCardsDynamically();
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
});

function populateCardsDynamically() {
  let postCardTemplate = document.getElementById("postCardTemplate");
  let postCardGroup = document.getElementById("postCardGroup");

  db.collection("posts").get()
    .then(allPosts => {
      allPosts.forEach(doc => {
        var postTitle = doc.data().title;
        var postID = doc.data().code;
        // var postUpload = doc.data().uploaded;
        var postAuthor = doc.data().nickname;
        var postPreview = doc.data().short_description;
        let testPostCard = postCardTemplate.content.cloneNode(true);
        testPostCard.querySelector('.card-title').innerHTML = postTitle;
        testPostCard.querySelector('.card-author').innerHTML = postAuthor;
        // testPostCard.querySelector('.card-uploaded').innerHTML = postUpload;
        testPostCard.querySelector('.card-preview').innerHTML = postPreview;
        testPostCard.getElementById("post-sender").onclick = () => setPostInfoData(postID);
        testPostCard.querySelector('i').id = 'save-' + postID;
        testPostCard.querySelector('i').onclick = () => saveBookmark(postID);
        postCardGroup.appendChild(testPostCard);
      })

    })
}


function setPostInfoData(id){
  localStorage.setItem('postID', id);
}

function saveBookmark(postID) {
  currentUser.set({
          bookmarks: firebase.firestore.FieldValue.arrayUnion(postID)
      }, {
          merge: true
      })
      .then(function () {
          console.log("bookmark has been saved for: " + currentUser);
          var iconID = 'save-' + postID;
          //console.log(iconID);
          document.getElementById(iconID).innerText = 'bookmark';
      });
}