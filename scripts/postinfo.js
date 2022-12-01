// Grabs the current postID
var postID = localStorage.getItem("postID");

// Looks for the exact post, then populates the page with the correct details
function getPostInfo(postCode){
    db.collection("posts").where("code", "==", postCode)
           .get()
           .then(queryPost => {
               size = queryPost.size;
               posts = queryPost.docs;   

               if (size = 1) {
                   var thisPost = posts[0].data();
                   var title = thisPost.title;
                   var category = thisPost.category;
                   var author = thisPost.nickname;
                   var school = thisPost.school;
                   var content = thisPost.content;
                   console.log(thisPost, title, category, author, school, content);
                   document.querySelector('.body-title').innerHTML = title;
                   document.querySelector('.body-category').innerHTML = "Category: " + category;
                   document.querySelector('.body-author').innerHTML = "By: " + author;
                   document.querySelector('.body-school').innerHTML = "From: " + school;
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