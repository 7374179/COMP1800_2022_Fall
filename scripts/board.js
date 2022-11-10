function populateCardsDynamically() {
  let postCardTemplate = document.getElementById("postCardTemplate");
  let postCardGroup = document.getElementById("postCardGroup");

  db.collection("posts").get()
    .then(allPosts => {
      allPosts.forEach(doc => {
        var postTitle = doc.data().title;
        var postID = doc.data().code;
        var postUpload = doc.data().uploaded;
        var postAuthor = doc.data().nickname;
        var postPreview = doc.data().short_description;
        let testPostCard = postCardTemplate.content.cloneNode(true);
        testPostCard.querySelector('.card-title').innerHTML = postTitle;
        testPostCard.querySelector('.card-author').innerHTML = postAuthor;
        testPostCard.querySelector('.card-uploaded').innerHTML = postUpload;
        testPostCard.querySelector('.card-preview').innerHTML = postPreview;
        testPostCard.querySelector('a').onclick = () => setPostInfoData(postID);
        postCardGroup.appendChild(testPostCard);
      })

    })
}
populateCardsDynamically();

function setPostInfoData(id){
  localStorage.setItem('postID', id);
}