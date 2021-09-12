const http = require('http')
const fs = require('fs')
const express = require('express')
const services = require('./services')
const file = require('./fileOp')

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
    services.removing()

    fs.readFile('localcoef.temporary.txt' ,function (err, data) {
        if(err) throw err;
            
            data1=data.toString()
            arr=data1.split(',').map(Number)
            var array=[]
            array=[arr]
            myMethod(array)
            //console.log(array);
    });  
    //console.log(array)

    function myMethod(array){
        fs.writeFile('localcoef.temporary.txt', '', function(){console.log('done')})
        services.get_best_model(req,res,array) 
    }

    //var array=new Array()
    // function myMethod(){
    //     fs.readFile('localcoef.temporary.txt',function(err,data){
    //         if(err) throw err;
    //         data1=data.toString()
    //         arr=data1.split(',').map(Number)
    //         var array=[]
    //         array=[arr]
    //         //console.log(array)
    //     })
    //     return array
    // }
    // var array=myMethod()
    // console.log(array);
    //fs.writeFile('localcoef.temporary.txt', '', function(){console.log('done')})
    //services.get_best_model(req,res) 
      
})


app.get('/aggregate', async (req, res ) =>{
    services.getDoc()
    services.get_fileDownload()
});


app.post('/send-model', (req, res) => {
    services.postMonthlyModelToFirebase(req.body)
    res.json("Successful")
})
