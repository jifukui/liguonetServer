var liguo={};
var express=require('express');
liguo.Database=require('mongodb').MongoClient;
liguo.app=express();
liguo.bodyParser=require('body-parser');
liguo.app.use(liguo.bodyParser.urlencoded({extended:false}));
liguo.app.use(liguo.bodyParser.json());
liguo.app.get('/',function (req,res) {
    console.log("have in the index");
    res.sendfile("./html/login.html");
})
liguo.app.use(express.static('html'));
liguo.app.use(express.static('js'));
liguo.app.post('/login',function (req,res) {
    console.log(req.body.name);
    console.log(req.body.password);
    //var tfind={};
    //tfind.UserName=req.body.name;
    liguo.Database.connect("mongodb://47.104.156.124:36911",function (err,db) {
        if(err)
        {
            console.log("连接数据库失败");
            res.status(200).json({ status: 'fail' });
        }
        else
        {
            console.log("连接数据库成功");
            var dbo=db.db("test");
            dbo.collection('User').find({"UserName":req.body.name}).toArray(function (dberr,dbres) {
                if(dberr)
                {
                    console.log("传数据表错误");
                    res.status(200).json({ status: 'fail' });
                }
                else
                {
                    if(dbres.length!=1)
                    {
                        res.status(200).json({ status: 'error' });
                    }
                    else
                    {
                        if(req.body.password==dbres[0].password)
                        {
                            res.status(200).json({ status: 'successful' });
                        }
                        else
                        {
                            res.status(200).json({ status: 'error' });
                        }
                    }

                }

            })
        }
    });
});
liguo.server=liguo.app.listen(3000);