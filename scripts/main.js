var currentUser
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    currentUser = db.collection("users").doc(user.uid);   //global
    console.log(currentUser);
  } else {
    console.log("Critical error! You shouldn't be here!");
    window.location = "login.html";
  }
})

// function insertName() {
//     firebase.auth().onAuthStateChanged(user => {
//         // Check if a user is signed in:
//         if (user) {
//             // Do something for the currently logged-in user here: 
//             console.log(user.uid);
//             console.log(user.displayName);
//             user_Name = user.displayName;

//             //method #1:  insert with html only
//             //document.getElementById("name-goes-here").innerText = user_Name;    //using javascript
//             //method #2:  insert using jquery
//             $("#name-goes-here").text(user_Name); //using jquery

//         } else {
//             // No user is signed in.
//         }
//     });
// }
// insertName(); //run the function

function insertName() {
  // to check if the user is logged in:
  firebase.auth().onAuthStateChanged(user => {
      if (user) {
          console.log(user.uid); // let me to know who is the user that logged in to get the UID
          currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
          currentUser.get().then(userDoc => {
              //get the user name
              var user_Name = userDoc.data().name;
              console.log(user_Name);
              $("#name-goes-here").text(user_Name); //jquery
              // document.getElementByID("name-goes-here").innetText=user_Name;
          })
      }

  })
}
insertName();