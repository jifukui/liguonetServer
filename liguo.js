var liguo={};
var express=require('express');
liguo.Database=require('./liguo/database/liguodatabase');
var user=require("./user.js");
var command=require("./liguo/command/LiguoCommand1");
liguo.app=express();



liguo.Database.database.init(command);
//liguo.Database.database.User();
/*
liguo.app.get("/",function(req,res)
{
    PrintMessage(req,res);
    res.sendfile("./html/login.html");
})*/

liguo.app.use(express.static('dist2'));
liguo.app.use(express.static('js'));
liguo.app.use(express.static('html'));
liguo.app.post('/',function(req,res){
    console.log("Hello world");
    PrintMessage(req,res);
    res.send(value);
})
liguo.app.post('/login',function (req,res) {
    res.send(PrintMessage(req,res));
});

liguo.app.get('/login',function(req,res){
    console.log("good for get");
    var value={};
    value.status="successful";
    res.send(value);
})
liguo.app.use('/user',user.user);
liguo.app.use("/cmd",command.cmd.app);
/*
liguo.app.param(["data","value"],function(req,res,next,value)
{
    console.log("This is The first "+value);
    //res.send(value);
    next();
})
liguo.app.use("/cmd/:data/:value",function(req,res,next,value){
    console.log("This match is "+value);
    //res.send(value);
    next();
})
liguo.app.use("/cmd/:data/:value",function(req,res,next){
    console.log("The ")
    //res.send(value);
    res.end();
})
*/

liguo.app.get("*",function(req,res){
    //res.send(PrintMessage(req,res));
})

function PrintMessage(req,res){
    console.log("The print Message");
    var value={};
    //环境变量
    console.log(liguo.app.get('env'));
    value.env=liguo.app.get('env');
    //请求的主机名
    console.log("The req.hostname is "+ req.hostname);
    value.hostname=req.hostname;
    //请求主机的IP
    console.log("The host Ip address is "+req.ip);
    value.ip=req.ip;
    //请求的主体
    console.log("The req.body is "+JSON.stringify(req.body));
    value.body=JSON.stringify(req.body);
    //请求的URL
    console.log("The url is "+req.originalUrl);
    value.url=req.originalUrl;
    //请求的req.params
    console.log("The req.params is"+JSON.stringify(req.params));
    value.params=JSON.stringify(req.params);
    //请求的协议
    console.log("The req.protocol is "+req.protocol);
    value.protocol=req.protocol;
    //req.query get方法中请求的内容
    console.log("The querry is "+req.query);
    value.query=req.query;
    //req.route
    console.log("req.route is "+JSON.stringify(req.route));
    value.route=JSON.stringify(req.route);
    //req.subdomains
    console.log("req.subdomains is "+req.subdomains );
    value.subdomains=req.subdomains;
    //req.accepts()
    console.log("The req.accepts() is "+req.accepts());
    value.accepts=req.accepts();
    //req.acceptsCharsets
    console.log("req.acceptsCharsets is "+req.acceptsCharsets);
    value.acceptsCharsets=req.acceptsCharsets;
    //req.acceptsEncodings
    console.log("req.acceptsEncodings is +"+req.acceptsEncodings );
    value.acceptsEncodings=req.acceptsEncodings;
    //req.acceptsLanguages
    console.log("req.acceptsLanguages is "+req.acceptsLanguages);
    value.acceptsLanguages=req.acceptsLanguages;
    //req.get()
    console.log("req.get() is "+req.get('Content-type'));
    value.get=req.get('Content-type');
    //req.is()
    console.log("req.is() is "+req.is('json'));
    value.is=req.is('json');




    //状态的返回
    value.status="successful";
    return value;
}
liguo.server=liguo.app.listen(8888);