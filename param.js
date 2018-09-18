var express=require('express');
var param=exports();
param.param('id',function(req,res,next,id){
    console.log("first");
    next();
})
exports.testparam=param;