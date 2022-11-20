function saveSettings() {
    firebase.auth().onAuthStateChanged(user => {   //find out who's logged in
        console.log("in save function");
        const n = document.querySelector('#notifications');
        const u = document.querySelector('#notify');
        console.log(n.checked);  
        console.log(u.checked);    //get checked attribute
        db.collection("users").doc(user.uid).update({   //update user's doc
            notifications: n.checked
            
        })

        db.collection("users").doc(user.uid).update({   //update user's doc
            notify: u.checked
            
        })
    })
}

function showSettings() {
    firebase.auth().onAuthStateChanged(user => {
            db.collection("users").doc(user.uid)
                .get()
                .then(function (doc) {
                    ustatus = doc.data().notify;
                    nstatus = doc.data().notifications;
                    
                    console.log("notfications is: " + nstatus);
                    console.log("Notifying update is: " + ustatus )

                    document.getElementById("notifications").checked = nstatus;
                    document.getElementById("notify").checked = ustatus;

                })
    })
}

showSettings();


