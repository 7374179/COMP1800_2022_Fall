var filter = localStorage.getItem("filter");
var currentUser;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid);   //global
        console.log(currentUser);

        // the following functions are always called when someone is logged in
        populateCardsDynamically(filter);
        setFilterButton(filter);
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
});

function populateCardsDynamically(filter) {
  let postCardTemplate = document.getElementById("postCardTemplate");
  let postCardGroup = document.getElementById("postCardGroup");

  if (filter == 'all') {
    db.collection("posts").get()
    .then(allPosts => {
      allPosts.forEach(doc => {
        var postTitle = doc.data().title;
        var postID = doc.data().code;
        // var postUpload = doc.data().uploaded;
        var postAuthor = doc.data().nickname;
        var postcategory = doc.data().category;
        var postPreview = doc.data().short_description;
        console.log(postTitle, postID, postAuthor, postcategory, postPreview);
        let testPostCard = postCardTemplate.content.cloneNode(true);
        testPostCard.querySelector('.card-title').innerHTML = postTitle;
        testPostCard.querySelector('.card-author').innerHTML = postAuthor;
        testPostCard.querySelector('.card-category').innerHTML = "Category: " + postcategory;
        // testPostCard.querySelector('.card-uploaded').innerHTML = postUpload;
        testPostCard.querySelector('.card-preview').innerHTML = postPreview;
        testPostCard.querySelector('.sender').onclick = () => setPostInfoData(postID);
        testPostCard.querySelector('.sender2').onclick = () => setPostInfoData(postID);
        testPostCard.querySelector('i').id = 'save-' + postID;
        testPostCard.querySelector('i').onclick = () => saveBookmark(postID);
        currentUser.get().then( userDoc => {
          var bookmarks = userDoc.data().bookmarks;
          if ( bookmarks.includes(postID) ) {
            document.getElementById('save-' + postID).innerText = 'bookmark';
          }
          var postCodes = userDoc.data().posts;
          if (postCodes.includes(postID)) {
            document.getElementById('delete-button').disabled = false;
            document.getElementById('delete-button').innerHTML = "Delete";
            document.getElementById('delete-button').onclick = () => deletePost(postID);
            document.getElementById('edit-button').disabled = false;
            document.getElementById('edit-button').innerHTML = "Edit";
          }
        } )
        postCardGroup.appendChild(testPostCard);
      })

    })
  } else {
    db.collection("posts").where("category", "==", filter).get()
    .then(allFilteredPosts => {
      allFilteredPosts.forEach(doc => {
        var postTitle = doc.data().title;
        var postID = doc.data().code;
        // var postUpload = doc.data().uploaded;
        var postAuthor = doc.data().nickname;
        var postcategory = doc.data().category;
        var postPreview = doc.data().short_description;
        console.log(postTitle, postID, postAuthor, postcategory, postPreview);
        let testPostCard = postCardTemplate.content.cloneNode(true);
        testPostCard.querySelector('.card-title').innerHTML = postTitle;
        testPostCard.querySelector('.card-author').innerHTML = postAuthor;
        testPostCard.querySelector('.card-category').innerHTML = "Category: " + postcategory;
        // testPostCard.querySelector('.card-uploaded').innerHTML = postUpload;
        testPostCard.querySelector('.card-preview').innerHTML = postPreview;
        testPostCard.querySelector('.sender').onclick = () => setPostInfoData(postID);
        testPostCard.querySelector('.sender2').onclick = () => setPostInfoData(postID);
        testPostCard.querySelector('i').id = 'save-' + postID;
        testPostCard.querySelector('i').onclick = () => saveBookmark(postID);
        currentUser.get().then(userDoc => {
          var bookmarks = userDoc.data().bookmarks;
          if ( bookmarks.includes(postID) ) {
            document.getElementById('save-' + postID).innerText = 'bookmark';
          }
          var postCodes = userDoc.data().posts;
          if (postCodes.includes(postID)) {
            document.getElementById('delete-button').disabled = false;
            document.getElementById('delete-button').innerHTML = "Delete";
            document.getElementById('delete-button').onclick = () => deletePost(postID);
            document.getElementById('edit-button').disabled = false;
            document.getElementById('edit-button').innerHTML = "Edit";
          }
        } )
        postCardGroup.appendChild(testPostCard);
      })

    })
  }
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

function setFilterButton(filter) {
  if (filter == 'Studying') {
    document.querySelector('.current-option').innerHTML = "Studying";
  } else if (filter == 'Professors') {
    document.querySelector('.current-option').innerHTML = "Professors";
  } else if (filter == 'Classes') {
    document.querySelector('.current-option').innerHTML = "Classes";
  } else if (filter == 'Life') {
    document.querySelector('.current-option').innerHTML = "Life";
  } else if (filter == 'Other') {
    document.querySelector('.current-option').innerHTML = "Other";
  }
}

function deletePost(id) {
  let text = "Are you sure you want to delete this?";
  if (confirm(text) == true) {
    currentUser.update({
      posts: firebase.firestore.FieldValue.arrayRemove(id),
    }).then(function () {
      db.collection("posts").doc(id).delete();
      alert("Document has been deleted");
      console.log("Document has been deleted");
      window.location.reload();
    });
  }
}