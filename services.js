const firebase = require('./firebase')
const axios = require('axios');
const fs = require('fs');
const fileOp = require('./fileOp');
var admin = require('firebase-admin');
const db = admin.firestore();

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

var date = new Date();
month_doc = (date.getMonth() + 1).toString() + "-" + date.getFullYear().toString();
//month_doc='9-2021'
//prevmonth_doc='8-2021'
prevmonth_doc=(date.getMonth()).toString() + "-" + date.getFullYear().toString();


function convertArrayToFile(arr) {

    var file = fs.createWriteStream('coef.temporary.txt');
    file.on('error', function (err) { /* error handling */ });
    arr.forEach(function (x) { file.write(x.join(',') + '\n'); });
    file.end();

    return file;

}

exports.postMonthlyModelToFirebase = async function (model) {
    var score = await getScore(model);
    // model.coef_ = [{ array: model.coef_[0] }];
    //model.coef_ = [Buffer.from(model.coef_[0])];
    model.score = score;
    console.log(score);

    

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

getDoc = async function ()  {
    
    const getData = db.collection('monthlyModels').doc(month_doc);
    const data = await getData.get();
    if (!data.exists) {
    console.log('No such document!');
    }    
    //console.log(data.data())
    //return this.data
    const obj=JSON.parse(JSON.stringify(data.data()))
    
    const objdata=obj.models
    var arr=[]
    objdata.forEach(function(x) { 
        arr.push(x.score);
    })
    const max=Math.max(...arr)
    objdata.forEach(function(x) { 
        if(x.score==max){
            maxData=x
            //console.log(x);
        }
    })
    //console.log(maxData)
    
        const getDataAgg = db.collection('aggregatedModels').doc(prevmonth_doc);
        const dataAgg = await getDataAgg.get();
        if (!dataAgg.exists) {
            const agg = await db.collection('aggregatedModels').doc(month_doc).set(maxData);
        }   
    
        const objAgg=JSON.parse(JSON.stringify(dataAgg.data()))
        //console.log(dataAgg.data())
        max_score=Math.max(maxData.score,objAgg.score);
    
        if(max_score==maxData.score){
            max_model=maxData
        }
        else{
            max_model=objAgg
        }
        //console.log(max_model);
    
        const agg = await db.collection('aggregatedModels').doc(month_doc).set(max_model);
}
// removing=async function(){
//     const FieldValue = admin.firestore.FieldValue;
//     const getDataAgg_new = db.collection('aggregatedModels').doc(month_doc);
//     var upd = await getDataAgg_new.update({
//         email: FieldValue.delete(),
//         score:FieldValue.delete()
//       });
// }

get_best_model=async function(req,res,array){
    const FieldValue = admin.firestore.FieldValue;
    const getDataAgg_new = db.collection('aggregatedModels').doc(month_doc);
    const dataAgg_new = await getDataAgg_new.get();
    //obj=dataAgg_new.data()
    obj=JSON.parse(JSON.stringify(dataAgg_new.data()))
    const obj1={
        "classes_":obj.classes_,
        "intercept_":obj.intercept_,
        "n_iter_":obj.n_iter_,
        "coef_":array
    }
    //obj.coef_=array
    //console.log(obj1);
    //res.json(obj1)
    //res.send({"result":"hi"})
    res.send(obj1)
}

get_fileDownload=async function(){
    const model = db.collection('aggregatedModels').doc(month_doc);
    const model_obj = await model.get();
    model_data=model_obj.data()
    var Filename = model_data.coef_
    //console.log(Filename);
    fileOp.fileDownload(Filename)

}
module.exports.getDoc=getDoc;
module.exports.get_best_model=get_best_model;
//module.exports.removing=removing;
module.exports.get_fileDownload=get_fileDownload;
//module.exports.updating=updating;