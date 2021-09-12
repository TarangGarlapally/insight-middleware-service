const firebase = require('./firebase')

exports.fileUplaod = (path, destFilename) => {
    firebase.storage().bucket("gs://pegasuschat.appspot.com").upload(path, {
        destination: destFilename,
    }).then(done => {
        console.log("done");
    }).catch(err => {
        console.log(err);
    });

}


exports.fileDownload = async (filename) => {
    return await firebase.storage().bucket("gs://pegasuschat.appspot.com").file(filename).download({
        destination: "localcoef.temporary.txt",
    });
}