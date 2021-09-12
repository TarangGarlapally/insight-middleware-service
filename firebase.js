var admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = {
    type: process.env.type,
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key,
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url
}


const firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pegasuschat-default-rtdb.firebaseio.com"
});

//const db = admin.firestore();
console.log("Firebase Service Initialized");

// firebase.firestore().collection("monthlyModels").doc("4-2021").get().then(snap => {
//     var buffer = snap.data().models[0].coef_[0];
//     var arr = Array.prototype.slice.call(buffer, 0)
//     console.log(arr)
//     var c = 0;
//     for (let index = 0; index < arr.length; index++) {
//         if (arr[index] != 0)
//             console.log(arr[index])
//     }
//     console.log(c)
// })

module.exports = firebase
