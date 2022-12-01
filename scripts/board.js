// Gets current filter, checks whether user is logged in or not
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

// Gets post data and depending on the filter, gives that data
function populateCardsDynamically(filter) {
  let postCardTemplate = document.getElementById("postCardTemplate");
  let postCardGroup = document.getElementById("postCardGroup");
  // Shows all the posts
  if (filter == 'all') {
    db.collection("posts").orderBy("code", "desc").get()
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
        testPostCard.querySelector('.editSender').onclick = () => setPostInfoDataToEdit(postID);
        testPostCard.querySelector('.editSender').id = 'edit-' + postID;
        testPostCard.querySelector('.deleter').id = 'delete-' + postID;
        testPostCard.querySelector('i').id = 'save-' + postID;
        testPostCard.querySelector('i').onclick = () => saveBookmark(postID);
        // If the post is in the user's bookmark or the user made the post, allow them to edit and delete
        currentUser.get().then( userDoc => {
          var bookmarks = userDoc.data().bookmarks;
          if (bookmarks.includes(postID)) {
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
        postCardGroup.appendChild(testPostCard);
      })

    })
  // If it's the user, checks whether the user uid matches with the post
  } else if (filter == 'User') {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        db.collection("posts").where("user", "==", user.uid).orderBy("code", "desc").get()
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
            testPostCard.querySelector('.editSender').onclick = () => setPostInfoDataToEdit(postID);
            testPostCard.querySelector('.editSender').id = 'edit-' + postID;
            testPostCard.querySelector('.deleter').id = 'delete-' + postID;
            testPostCard.querySelector('i').id = 'save-' + postID;
            testPostCard.querySelector('i').onclick = () => saveBookmark(postID);
            // If the post is in the user's bookmark or the user made the post, allow them to edit and delete
            currentUser.get().then(userDoc => {
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
            postCardGroup.appendChild(testPostCard);
          })
    
        })
      } else {
        console.log("No one is logged in. Why did we get here?")
      }
    })
  // Checks whether the post's category is the same as the current filter
  } else {
    db.collection("posts").where("category", "==", filter).orderBy("code", "desc").get()
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
        testPostCard.querySelector('.editSender').onclick = () => setPostInfoDataToEdit(postID);
        testPostCard.querySelector('.editSender').id = 'edit-' + postID;
        testPostCard.querySelector('.deleter').id = 'delete-' + postID;
        testPostCard.querySelector('i').id = 'save-' + postID;
        testPostCard.querySelector('i').onclick = () => saveBookmark(postID);
        // If the post is in the user's bookmark or the user made the post, allow them to edit and delete
        currentUser.get().then(userDoc => {
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
        postCardGroup.appendChild(testPostCard);
      })

    })
  }
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

// Changes the text inside the filter button
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
  } else if (filter == 'User') {
    document.querySelector('.current-option').innerHTML = "My posts";
  }
  console.log("Filter set to " + filter);
}

// Allows the user to delete a post, usually their own
function deletePost(id) {
  let text = "Are you sure you want to delete this?";
  if (confirm(text) == true) {
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