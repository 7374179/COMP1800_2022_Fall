// save the setting when stitch turned on for setting
function saveSettings() {
    firebase.auth().onAuthStateChanged(user => {   //find out who's logged in
        console.log("in save function");
        const n = document.querySelector('#notifications');
       
        console.log(n.checked);  
          //get checked attribute
        db.collection("users").doc(user.uid).update({   //update user's doc
            notifications: n.checked
            
        })

        
    })
}
// save the setting when stitch turned on for setting1
function saveSettings1() {
    firebase.auth().onAuthStateChanged(user => {   //find out who's logged in
        console.log("in save function notify");
        const u = document.querySelector('#notify'); 
        console.log(u.checked);    //get checked attribute
        

        db.collection("users").doc(user.uid).update({   //update user's doc
            notify: u.checked
            
        })
    })
}
// save the setting wehn switch turned on for settings2
function saveSettings2() {
    firebase.auth().onAuthStateChanged(user => {   //find out who's logged in
        console.log("in save function tips");
        const z = document.querySelector('#tip'); 
        console.log(z.checked);    //get checked attribute
        

        db.collection("users").doc(user.uid).update({   //update user's doc
            tip: z.checked
            
        })
    })
}

// show settings
function showSettings() {
    firebase.auth().onAuthStateChanged(user => {
            db.collection("users").doc(user.uid)
                .get()
                .then(function (doc) {
                    ustatus = doc.data().notify;
                    nstatus = doc.data().notifications;
                    zstatus = doc.data().tip;
                    
                    console.log("notfications is: " + nstatus);
                    console.log("Notifying update is: " + ustatus )
                    console.log("tips setting is: " + tip)

                    document.getElementById("notifications").checked = nstatus;
                    document.getElementById("notify").checked = ustatus;
                    document.getElementById("tip").checked = zstatus;

                })
    })
}

showSettings();


