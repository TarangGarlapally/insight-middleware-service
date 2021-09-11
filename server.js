const http = require('http')
const fs = require('fs')
const express = require('express')
const services = require('./services')

var app = express()
const port = 3000

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json())




app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.listen(port, () => {
    console.log('server is listening on port ' + port)
})



app.get('/', (req, res) => {
    res.json({ message: 'Hello world..' })
})

app.get('/get-best-model', (req, res) => {
    res.json({ message: 'This API returns the best model' })
})

var M1 = { colour: 'blue' };
var M2 = { width: 100 };

app.get('/aggregate', function (req, res, next) {
    res.jsonp({ foo: M1.colour, bar: M2.width });
});


app.post('/send-model', async (req, res) => {
    score = await services.postMonthlyModelToFirebase(req.body)
    res.json(req.body.email + "abc score:" + score)
})
