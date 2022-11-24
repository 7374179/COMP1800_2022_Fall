var currentUser;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid);   //global
        console.log(currentUser);

        // the following functions are always called when someone is logged in
        getBookmarks(user);
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
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
            testPostCard.querySelector('.card-category').innerHTML = "Category: " + postcategory;
            // testPostCard.querySelector('.card-uploaded').innerHTML = postUpload;
            testPostCard.querySelector('.card-preview').innerHTML = postPreview;
            testPostCard.querySelector('.sender').onclick = () => setPostInfoData(postID);
            testPostCard.querySelector('i').id = 'save-' + postID;
            testPostCard.querySelector('i').onclick = () => saveBookmark(postID);
            currentUser.get().then( userDoc => {
              var bookmarks = userDoc.data().bookmarks;
              if ( bookmarks.includes(postID) ) {
                document.getElementById('save-' + postID).innerText = 'bookmark';
              }
            } )
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

function saveBookmark(id) {
  currentUser.get().then((userDoc) => {
    bookmarksNow = userDoc.data().bookmarks;
    // console.log(bookmarksNow)

//check if this bookmark already existed in firestore:
    if (bookmarksNow.includes(id)) {
      console.log(id);
//if it does exist, then remove it
      currentUser
        .update({
          bookmarks: firebase.firestore.FieldValue.arrayRemove(id),
        })
        .then(function () {
          console.log("This bookmark is removed for" + currentUser);
          var iconID = "save-" + id;
          console.log(iconID);
          document.getElementById(iconID).innerText = "bookmark_border";
        });
    } else {
//if it does not exist, then add it
      currentUser
        .set(
          {
            bookmarks: firebase.firestore.FieldValue.arrayUnion(id),
          },
          {
            merge: true,
          }
        )
        .then(function () {
          console.log("This bookmark is for" + currentUser);
          var iconID = "save-" + id;
          console.log(iconID);
          document.getElementById(iconID).innerText = "bookmark";
        });
    }
  });
}