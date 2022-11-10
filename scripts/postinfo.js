var postID = localStorage.getItem("postID");

function getPostInfo(postCode){
    db.collection("posts").where("code", "==", postCode)
           .get()
           .then(queryPost => {
               size = queryPost.size;
               posts = queryPost.docs;   

               if (size = 1) {
                   var thisPost = posts[0].data();
                   var title = thisPost.title;
                   var author = thisPost.nickname;
                   var content = thisPost.content;
                   document.querySelector('.body-title').innerHTML = title;
                   document.querySelector('.body-author').innerHTML = "By: " + author;
                   document.querySelector('.body-content').innerHTML = content;
               } else {
                   console.log("Query has more than one data")
               }
           })
           .catch((error) => {
               console.log("Error getting documents: ", error);
           });
}
getPostInfo(postID);