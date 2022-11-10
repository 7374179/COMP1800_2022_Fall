var postID = localStorage.getItem("postID");

db.collection("posts").where("code", "==", postID)
            .get()
            .then(queryPost => {
                //see how many results you have got from the query
                size = queryPost.size;
                // get the documents of query
                Posts = queryPost.docs;

                // We want to have one document per hike, so if the the result of 
                //the query is more than one, we can check it right now and clean the DB if needed.
                if (size = 1) {
                    var thisPost = Posts[0].data();
                    name = thisPost.name;
                    document.getElementById("PostName").innerHTML = name;
                } else {
                    console.log("Query has more than one data")
                }
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });