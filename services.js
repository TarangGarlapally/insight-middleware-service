const firebase = require('./firebase')
const axios = require('axios');
const fs = require('fs');
const fileOp = require('./fileOp');

function getScore(model) {
    return axios.post('https://project-insight-chat.herokuapp.com/get-score', model)
        .then(function (response) {
            console.log(response.data.score);
            return response.data.score;
        })
        .catch(function (error) {
            console.log(error);
        });
}


function convertArrayToFile(arr) {

    var file = fs.createWriteStream('coef.temporary.txt');
    file.on('error', function (err) { /* error handling */ });
    arr.forEach(function (x) { file.write(x.join(',') + '\n'); });
    file.end();

    return file;

}

module.exports.postMonthlyModelToFirebase = async function (model) {
    var score = await getScore(model);
    // model.coef_ = [{ array: model.coef_[0] }];
    //model.coef_ = [Buffer.from(model.coef_[0])];
    model.score = score;
    console.log(score);

    var date = new Date();
    month_doc = (date.getMonth() + 1).toString() + "-" + date.getFullYear().toString();


    var file = convertArrayToFile(model.coef_);

    var destFilename = month_doc + model.email.split("@")[0] + '.txt';
    model.coef_ = destFilename;

    // firebase cloud storage - uploading model coef file
    fileOp.fileUplaod(file.path, destFilename);


    //firebase firestore - adding monthly user model to monthly document
    firebase.firestore().collection("monthlyModels").doc(month_doc).get()
        .then(snap => {
            if (snap.exists) {
                console.log("exists");

                var arr = snap.data().models
                arr.push(model);

                firebase.firestore().collection("monthlyModels").doc(month_doc).update({
                    models: arr
                }).then(done => {
                    console.log("appended to monthly document")
                }).catch(err => {
                    console.log(err)
                })
            } else {
                console.log("doesn't exist");
                firebase.firestore().collection("monthlyModels").doc(month_doc).set({
                    models: [model]
                }).then(done => {
                    console.log("created monthly document")
                }).catch(err => {
                    console.log(err)
                })
            }

        })
        .catch(err => {
            console.log("error: \n");
            console.log(err);
        })
}

