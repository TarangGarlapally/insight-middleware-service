const http=require('http')
const fs=require('fs')
const express= require('express')
var app=express()
const port=3000
const students= require('./student')
app.use(express.json())
/*** 
const server=http.createServer(function(req,res){

})

server.listen(port,function(error){
    if(error){
        console.log('something went wrong',error)
    }
    else{
        console.log('server is listening at port '+ port)
    }
})
***/

app.listen(port,()=>{
    console.log('server is listening on port '+ port)
})

app.get('/',(req,res)=>{
    //res.send('Hello world')
    res.json({message:'Hello world..'})
    
})

var M1 = { colour: 'blue' };
var M2 = { width: 100 };

app.get('/test', function(req,res,next) {
  res.jsonp( { foo: M1.colour, bar: M2.width } );
});

app.post('/',(req,res)=>{
    const user={
        id:students.length+1,
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        email: req.body.email
    }
    students.push(user)
    res.json(user)
})
