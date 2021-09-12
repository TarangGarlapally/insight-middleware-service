const http = require('http')
const fs = require('fs')
const express = require('express')
const services = require('./services')
//const mod = require('./modules')

var admin = require('firebase-admin');
const db = admin.firestore();

var app = express()
const port = process.env.PORT || 3000

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

app.get('/aggregate', async (req, res ) =>{
   
    const getData = db.collection('monthlyModels').doc('9-2021');
    const data = await getData.get();
    if (!data.exists) {
    console.log('No such document!');
    }   
    
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
    
    const getDataAgg = db.collection('aggregatedModels').doc('8-2021');
    const dataAgg = await getDataAgg.get();
    if (!dataAgg.exists) {
    console.log('No such document!');
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
    console.log(max_model);

    const agg = await db.collection('aggregatedModels').doc('9-2021').set(max_model);
});


app.post('/send-model', (req, res) => {
    services.postMonthlyModelToFirebase(req.body)
    res.json("Successful")
})
