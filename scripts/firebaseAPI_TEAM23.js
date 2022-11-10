//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyDRPXK5r8hdQeER1nGJSDsp0T4LhVe1VGU",
    authDomain: "bby23-23c88.firebaseapp.com",
    projectId: "bby23-23c88",
    storageBucket: "bby23-23c88.appspot.com",
    messagingSenderId: "457171488307",
    appId: "1:457171488307:web:a327d4a4051da7202bdd46"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();