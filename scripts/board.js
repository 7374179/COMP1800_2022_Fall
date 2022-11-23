var filter = localStorage.getItem("filter");
var currentUser;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid);   //global
        console.log(currentUser);

        // the following functions are always called when someone is logged in
        populateCardsDynamically(filter);
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
        testPostCard.querySelector('.card-category').innerHTML = "category: " + postcategory;
        // testPostCard.querySelector('.card-uploaded').innerHTML = postUpload;
        testPostCard.querySelector('.card-preview').innerHTML = postPreview;
        testPostCard.querySelector('.sender').onclick = () => setPostInfoData(postID);
        testPostCard.querySelector('i').id = 'save-' + postID;
        testPostCard.querySelector('i').onclick = () => saveBookmark(postID);
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
        testPostCard.querySelector('.card-category').innerHTML = "category: " + postcategory;
        // testPostCard.querySelector('.card-uploaded').innerHTML = postUpload;
        testPostCard.querySelector('.card-preview').innerHTML = postPreview;
        testPostCard.querySelector('.sender').onclick = () => setPostInfoData(postID);
        testPostCard.querySelector('i').id = 'save-' + postID;
        testPostCard.querySelector('i').onclick = () => saveBookmark(postID);
        postCardGroup.appendChild(testPostCard);
      })

    })
  }
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