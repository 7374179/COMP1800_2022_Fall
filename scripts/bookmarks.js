// Checks whether the user is signed in
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

// Grabs the users bookmarks and populates the cards
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
            testPostCard.querySelector('.editSender').onclick = () => setPostInfoDataToEdit(postID);
            testPostCard.querySelector('.editSender').id = 'edit-' + postID;
            testPostCard.querySelector('.deleter').id = 'delete-' + postID;    
            testPostCard.querySelector('i').id = 'save-' + postID;
            testPostCard.querySelector('i').onclick = () => saveBookmark(postID);
            // If the post is in the user's bookmark or the user made the post, allow them to edit and delete
            currentUser.get().then( userDoc => {
              var bookmarks = userDoc.data().bookmarks;
              if ( bookmarks.includes(postID) ) {
                document.getElementById('save-' + postID).innerText = 'bookmark';
              }
              var postCodes = userDoc.data().posts;
              if (postCodes.includes(postID)) {
                console.log(postID + " is changeable");
                document.getElementById('delete-' + postID).disabled = false;
                document.getElementById('delete-' + postID).innerHTML = "Delete";
                document.getElementById('delete-' + postID).onclick = () => deletePost(postID);
                document.getElementById('edit-' + postID).disabled = false;
                document.getElementById('edit-' + postID).innerHTML = "Edit";
              }
            } )
            bookmarkCardGroup.appendChild(testPostCard);
          } else {
            console.log("Query either has none or has more than one data")
          }
        })
      })
    })
}

// Stores the current postID to the browser
function setPostInfoData(id){
  localStorage.setItem('postID', id);
}

// Stores the current postID to the browser, then goes to the edit page
function setPostInfoDataToEdit(id){
  localStorage.setItem('postID', id);
  window.location.href = "postEdit.html";
}

// Function that checks whether the bookmark is saved to the user and changes the icon if it is
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

// Allows the user to delete a post, usually their own
function deletePost(id) {
  let text = "Are you sure you want to delete this?";
  if (confirm(text) == true) {
    deleteBookmark(id);
    currentUser.update({
      posts: firebase.firestore.FieldValue.arrayRemove(id),
    }).then(function () {
      db.collection("posts").doc(id).delete();
      alert("Post has been deleted");
      console.log(id + " has been deleted");
      window.location.reload();
    });
  }
}

function deleteBookmark(id) {
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
        });
    }
  });
}