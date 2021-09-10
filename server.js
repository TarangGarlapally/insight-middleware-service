const http = require('http')
const fs = require('fs')
const express = require('express')
const firebase = require('./firebase')

var app = express()
const port = 3000
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

var M1 = { colour: 'blue' };
var M2 = { width: 100 };

app.get('/test', function (req, res, next) {
    res.jsonp({ foo: M1.colour, bar: M2.width });
});

app.post('/send-model', (req, res) => {
    res.json(req.body.email + "abc")
})
