var liguo={};
var express=require('express');
liguo.Database=require('mongodb').MongoClient;
liguo.app=express();
liguo.app.use(express.static('dist'));
liguo.app.post('/login',function (req,res) {
    console.log("Have get a ajax");
    console.log(req.params);
    var value={};
    value.status="successful";
    res.send(value);
});
liguo.server=liguo.app.listen(80);