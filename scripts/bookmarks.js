firebase.auth().onAuthStateChanged(user => {
  if (user) {
      getBookmarks(user)
  } else {
      console.log("No user is signed in");
  }
});

function getBookmarks(user) {
  db.collection("users").doc(user.uid).get()
    .then(userDoc => {
      var bookmarks = userDoc.data().bookmarks;
      console.log(bookmarks);

      let postBookmarkTemplate = document.getElementById("postBookmarkTemplate");
      let bookmarkCardGroup = document.getElementById("bookmarkCardGroup");
      bookmarks.forEach(thisPostID => {
        console.log(thisPostID);
        db.collection("posts").where("code", "==", thisPostID).get().then(snap => {
          size = snap.size;
          queryData = snap.docs;

          if (size == 1) {
            var doc = queryData[0].data();
            var postTitle = doc.title;
            var postID = doc.code;
            // var postUpload = doc.data().uploaded;
            var postAuthor = doc.nickname;
            var postcategory = doc.category;
            var postPreview = doc.short_description;
            let testPostCard = postBookmarkTemplate.content.cloneNode(true);
            console.log(postTitle, postID, postAuthor, postcategory, postPreview);
            testPostCard.querySelector('.card-title').innerHTML = postTitle;
            testPostCard.querySelector('.card-author').innerHTML = postAuthor;
            testPostCard.querySelector('.card-category').innerHTML = "category: " + postcategory;
            // testPostCard.querySelector('.card-uploaded').innerHTML = postUpload;
            testPostCard.querySelector('.card-preview').innerHTML = postPreview;
            testPostCard.querySelector('.sender').onclick = () => setPostInfoData(postID);
            bookmarkCardGroup.appendChild(testPostCard);
          } else {
            console.log("Query has more than one data")
          }
        })
      })
    })
}

function setPostInfoData(id){
  localStorage.setItem('postID', id);
}