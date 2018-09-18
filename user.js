var express=require('express');
var app=express();
app.get('/',function(req,res){
    console.log("This is User ");
    console.log(app.mountpath);
    res.send("Hello World");
})
exports.user=app;