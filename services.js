const axios = require('axios');

module.exports.postMonthlyModelToFirebase = function (model) {
    return axios.post('https://project-insight-chat.herokuapp.com/get-score', model)
        .then(function (response) {
            console.log(response.data);
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
}

// const getDoc=asyn(req,res,next)=>{
//     const getData = db.collection('monthlyModels').doc('9-2021');
//     const data = await getData.get();
//     if (!data.exists) {
//     console.log('No such document!');
//     }   
// }