//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyDtIEZPGXezIVE0BOv-aLae4K0cAVatd9E",
    authDomain: "comp1800-202230-580ce.firebaseapp.com",
    projectId: "comp1800-202230-580ce",
    storageBucket: "comp1800-202230-580ce.appspot.com",
    messagingSenderId: "608166372706",
    appId: "1:608166372706:web:75b882279f7c6ec816f83b"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();