var currentUser

function populateInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var userName = userDoc.data().name;
                    var userSchool = userDoc.data().school;
                    var userCity = userDoc.data().city;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userSchool != null) {
                        document.getElementById("schoolInput").value = userSchool;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}


populateInfo();

function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;

    // document.getElementById('personalInfoFields').disabled = true;

}

function cancelEditInfo(){
    document.getElementById('personalInfoFields').disabled = true;

    let text = "Are you sure you want to cancel the change?";
    
    if (confirm(text) == true) {
        window.location = "profile.html";
        return true;
        
    } else{
        window.location = "profile.html";
        return false;
    }
}

function saveUserInfo() {
    userName = document.getElementById('nameInput').value;
    userSchool = document.getElementById('schoolInput').value;
    userCity = document.getElementById('cityInput').value;

    currentUser.update({
        name: userName,
        school: userSchool,
        city: userCity
    })
    .then(() => {
        console.log("Document successfully updated!");
    })
    
    document.getElementById('personalInfoFields').disabled = true;

    let text = "Are you sure you want to save the change?";
    if (confirm(text) == true) {
        
       

        return true;
       
        
        
    } else{
        document.getElementById('personalInfoFields').disabled = false;
    }
  }


// function confirmSave() {
//     let text = "Are you sure you want to post this?";
//     if (confirm(text) == true) {
//         return true;
        
//     } else{
//         return false;
//     }
//   }