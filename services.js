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

