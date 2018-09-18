var liguo={};
liguo.Database=require('mongodb').MongoClient;
//按照需求进行匹配内容，选择性选择返回数据项，按照数据项进行排序
var FindDataBase=function(){
    liguo.Database.connect("mongodb://47.104.156.124:36911",function (err,db) {
    var data={"Pro AV":[],"AV Stream":[]};
        if(err)
        {
            console.log("数据库连接失败");
        }
        else
        {
            console.log("连接数据库成功");
            var dbo=db.db("test");
            dbo.collection('DeviceInfo').find({"BaseInfo.ClassType":"Pro AV"},{"projection":{"BaseInfo.Name":true,"_id":false}}).sort({"BaseInfo.Name":1}).toArray(function (dberr,dbres) {
                if(dberr)
                {
                    console.log("传数据表错误"); 
                }
                else
                {
                   console.log("The Length "+dbres.length);
                   /*
                   var i=0;
                   for(i=0;i<dbres.length;i++)
                   {
                        //console.log("index is "+i+" The Value is  "+JSON.stringify(dbres[i]));
                        data["Pro AV"][i]=dbres[i].BaseInfo.Name;
                   }
                   */
                   data["Pro AV"]=dbres;
                   //console.log("data is "+data["Pro AV"][0].BaseInfo.Name);
                   dbo.collection('DeviceInfo').find({"BaseInfo.ClassType":"AV Stream"},{"projection":{"BaseInfo.Name":true,"_id":false}}).sort({"BaseInfo.Name":1}).toArray(function (dberr1,dbres1) {
                   if(dberr1)
                   {
                        console.log("传数据表错误"); 
                   }
                    else
                    {
                        console.log("The Length "+dbres1.length);
                        /*
                        var i=0;
                        for(i=0;i<dbres1.length;i++)
                        {
                            data["AV Stream"][i]=dbres1[i].BaseInfo.Name;
                        }
                        */
                       data["AV Stream"]=dbres1;
                        console.log("The Value is "+JSON.stringify(data));
                        db.close();
                    }
                    
                    });
                }
            });   
        }
    });
}
//FindDataBase();
//查询匹配匹配选项中的数据，并选择性返回
var FindDataBase1=function(){
    liguo.Database.connect("mongodb://47.104.156.124:36911",function (err,db) {
    var data={"Pro AV":[],"AV Stream":[]};
        if(err)
        {
            console.log("连接数据库失败");
        }
        else
        {
            console.log("连接数据库成功");
            var dbo=db.db("test");
            dbo.collection('DeviceInfo').find({"BaseInfo.ClassType":{"$in":["Pro AV","AV Stream"]}},{"projection":{"BaseInfo.Name":true,"_id":false}}).toArray(function (dberr,dbres) {
                if(dberr)
                {
                    console.log("传数据表错误"); 
                }
                else
                {
                    console.log("The Length "+dbres.length);
                    data=dbres;
                    console.log("The Value is "+JSON.stringify(data));
                    db.close();
                }
            });   
        }
    });
} 
//FindDataBase1();
//游标进行操作
var curson=function()
{
    liguo.Database.connect("mongodb://47.104.156.124:36911",function (err,db)
    {
        if(err)
        {
            console.log("Error");
        }
        else
        {
            var dbo=db.db("test");
            var data=dbo.collection("DeviceInfo").find().limit(13).explain(function(Value)
        {
            
        });
           data.forEach(element => {
              console.log("The data is "+element.BaseInfo.Name);
          });
          db.close();
        }
    });
}
//curson();
//countDocuments的使用
var JiCount=function(){
    liguo.Database.connect("mongodb://47.104.156.124:36911",{useNewUrlParser:true},function (err,db)
    {
        if(err)
        {
            console.log("Error");
        }
        else
        {
            var dbo=db.db("test");
            var a;
            a=dbo.collection("DeviceInfo").countDocuments({"BaseInfo.ModuleName":"VS-88UHDA"},{},function(err,value){
                if(err)
                {
                    console.log("Have a error");
                }
                else
                {
                    console.log("The value is "+JSON.stringify(value))
                }
            });
            console.log(a);
        }
    });
}
//JiCount();
var JiAggregation=function()
{
    liguo.Database.connect("mongodb://47.104.156.124:36911",{useNewUrlParser:true},function (err,db)
    {
        if(err)
        {
            console.log("Error");
        }
        else
        {
            var dbo=db.db("test");
            dbo.collection("DeviceInfo").aggregate([{$group:{_id:"$BaseInfo.ClassType","ModuleType":{$push:"$BaseInfo.Name"}}}]).toArray(function (err,result) {
                if(err)
                {
                    console.log("error");
                }
                else
                {
                    var n=0;
                    var i;
                    for(n;n<result.length;n++)
                    {
                        for (i in result[n])
                        {
                            console.log("i value is "+result[n][i])
                        }
                    }
                    
                }
            })
            

        }
    });
};
//JiAggregation();
//获取用户列表
var Userlist=function()
{
    liguo.Database.connect("mongodb://47.104.156.124:36911",{useNewUrlParser:true},function (err,db)
    {
        if(err)
        {
            console.log("Error");
        }
        else
        {
            var dbo=db.db("test");
            dbo.collection("User").find({},{"projection":{"UserName":true,"priority":true,"_id":false}}).toArray(function(err,data){
                if(err)
                {
                    console.log("Have error");
                }
                else
                {
                    console.log(JSON.stringify(data));
                }
            })
        }
    });
};
//Userlist();
//DataBase
var DataBase=function()
{
    var data;
    liguo.Database.connect("mongodb://47.104.156.124:36911",{useNewUrlParser:true},function (err,db)
    {
        if(err)
        {
            console.log("Error");
        }
        else
        {
            var dbo=db.db("test");
            dbo.collection("DeviceInfo").find({"key":"0C54A505AC1E00000000000001"},{"projection":{"_id":false}}).toArray(function(err,data0){
                if(err)
                {
                    console.log("Have error");
                }
                else
                {
                    data=JSON.parse(JSON.stringify(data0[0]));
                    //console.log(JSON.stringify(data0));      
                    dbo.collection("Device").find({"ModuleName":"VS-88UHDA"}).toArray(function(err,data1){
                        if(err)
                        {
                            console.log("Have error Device");
                        }
                        else
                        {
                            //console.log(JSON.stringify(data1[0].PHYPortList));
                            var test1;
                            data["产品简介"]=data1[0]["产品简介"];
                            data["产品特性"]=data1[0]["产品特性"];
                            for(test1=0;test1<data1[0].PHYPortList.length;test1++)
                            {
                                data.PortInfo[test1].PHYName=data1[0].PHYPortList[test1].PhyName;
                            }
                            //console.log("\r\nThe data is "+JSON.stringify(data));
                            //console.log("The data is "+JSON.stringify(data.PortInfo));
                            //db.close();
                            dbo.collection("EDID").find({"key":"0C54A505AC1E00000000000001"}).sort({"PortIndex":1}).toArray(function(err,data2){
                                if(err)
                                {
                                    console.log("Have error EDID");
                                }
                                else
                                {
                                    //console.log(JSON.stringify(data2));
                                    var i;
                                    for(i=0;i<data2.length;i++)
                                    {
                                        data.PortInfo[i].EDID=data2[i].EDID;
                                    }
                                    //console.log("The data is "+JSON.stringify(data.PortInfo));
                                    //db.close();
                                    dbo.collection("Macro").find({"key":"0C54A505AC1E00000000000001"},{"projection":{"Name":1,"Switch":1,"_id":false}}).sort({"Name":1}).toArray(function(err,data3){
                                        if(err)
                                        {
                                            console.log("Have error Macro");
                                        }
                                        else
                                        {
                                            //console.log(JSON.stringify(data3));
                                            var i,j;
                                            var input,output,val,portnum,stri,stro,ji=[];
                                            portnum=GetPortArr(data.BaseInfo.PortInfo);
                                            console.log("The list info is "+JSON.stringify(portnum));
                                            for(i=0;i<data3.length;i++)
                                            {
                                                console.log("The base data is "+JSON.stringify(data3[i]));
                                                ji=[];
                                                for(j=0;j<data3[i].Switch.length;j++)
                                                {
                                                    val=data3[i].Switch[j].split(">");
                                                    input=parseInt(val[0]);
                                                    output=parseInt(val[1]);
                                                    //input=(parseInt(parseInt(val[0])/1000))+(parseInt(val[0])%1000)-1;
                                                    //output=(parseInt(parseInt(val[1])/1000))+(parseInt(val[1])%1000)-1;
                                                    input=GetPortIndex(input,portnum);
                                                    output=GetPortIndex(output,portnum);
                                                    //console.log("The Input is "+input);
                                                    //console.log("The output is "+output);
                                                    
                                                    stri=data.PortInfo[parseInt(input%1000)].PHYName+"_"+data.PortInfo[parseInt(input%1000)].ChannalInfo[parseInt(input/1000)].Name;
                                                    stro=data.PortInfo[parseInt(output%1000)].PHYName+"_"+data.PortInfo[parseInt(output%1000)].ChannalInfo[parseInt(output/1000)].Name;
                                                    //console.log("The input is "+stri);
                                                    //console.log("The output is "+stro);
                                                    ji.push(stri+"<-->"+stro);
                                                    
                                                }
                                                console.log("The ji is "+JSON.stringify(ji));
                                                data3[i].SwitchInfo=ji;
                                            }
                                            data.Macro=data3;
                                            console.log("The data is "+JSON.stringify(data));
                                            db.close();
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
                
            })
        }
    });
};
//DataBase();
var AddUser=function()
{
    liguo.Database.connect("mongodb://47.104.156.124:36911",{useNewUrlParser:true},function (err,db)
    {
        if(err)
        {
            console.log("Error");
        }
        else
        {
            var val={"UserName":"wenlong789","password":"123456789","priority":12,"Session_id":""};
            var dbo=db.db("test");
            dbo.collection("User").insertOne(val,function(err,data){
                if(err)
                {
                    console.log("Have error "+err);
                }
                else
                {
                    console.log("The data is "+JSON.stringify(data));
                    console.log("The data is "+data.n);
                    console.log("The data is "+data.ok);
                    console.log("The data is "+JSON.stringify(data.result));
                    var q;
                    for(q in data)
                    {
                        console.log(q +" The value is "+data[q]);
                    }
                    if(data.result.ok)
                    {
                        console.log("添加成功");
                    }
                    else
                    {
                        console.log("添加失败");
                    }
                    db.close();
                }
            })
        }
    });
};
//AddUser();
var DeleteUser=function()
{
    liguo.Database.connect("mongodb://47.104.156.124:36911",{useNewUrlParser:true},function (err,db)
    {
        if(err)
        {
            console.log("Error");
        }
        else
        {
            //var val={"UserName":"wenlong","password":"123456789","priority":12,"Session_id":""};
            var dbo=db.db("test");
            dbo.collection("User").findOneAndDelete({"UserName":"wenlong789"},function(err,data){
                if(err)
                {
                    console.log("Have error");
                }
                else
                {
                    console.log("The Delete data is "+JSON.stringify(data));
                    console.log("The Delete data is ok "+data.ok);
                    db.close();
                }
            })
        }
    });
};
//DeleteUser();
var UpdateUser=function()
{
    liguo.Database.connect("mongodb://47.104.156.124:36911",{useNewUrlParser:true},function (err,db)
    {
        if(err)
        {
            console.log("Error");
        }
        else
        {
            var val={"UserName":"wenlong","password":"123456789","priority":19,"Session_id":""};
            var dbo=db.db("test");
            dbo.collection("User").findOneAndReplace({"UserName":"wenlong"},val,function(err,data){
                if(err)
                {
                    console.log("Have error "+err);
                }
                else
                {
                    console.log("The data is "+JSON.stringify(data));
                }
            })
        }
    });
};
// UpdateUser();
var Find=function()
{
    liguo.Database.connect("mongodb://47.104.156.124:36911",{useNewUrlParser:true},function (err,db)
    {
        if(err)
        {
            console.log("Error");
        }
        else
        {
            var val={"UserName":"admin","password":"123145678"};
            var dbo=db.db("test");
            dbo.collection("User").find(val).toArray(function(err,data){
                if(err)
                {
                    console.log("Have error");
                }
                else
                {
                    console.log("The valye ius "+JSON.stringify(data));
                    console.log("The length is "+data.length);
                    db.close();
                }
            })
        }
    });
};
var network=function()
{
    liguo.Database.connect("mongodb://47.104.156.124:36911",{useNewUrlParser:true},function (err,db)
    {
        if(err)
        {
            console.log("Error");
        }
        else
        {
            var val={"ip":"192.168.20.33","mask":"255.255.255.128","gateway":"192.168.20.1","TCP":5001,"UDP":50001};
            //var val;
    
           // val["network.mask"]="255.255.255.0";
            //val["network.gateway"]="192.168.20.111";
            //val["network.TCP"]=5001;
            //val["network.UDP"]=50001;
            //{"network.ip":"192.168.20.33"}
            var dbo=db.db("test");
            dbo.collection("DeviceInfo").findOneAndUpdate({"key":"0C54A505AC1E00000000000001"},{$set:{"network.ip":val.ip,"network.mask":val.mask}},function(err,doc)
            {
                if(err)
                {
                    console.log("Have error");
                }
                else
                {
                    if(doc.lastErrorObject.updatedExisting)
                    {
                        console.log("The doc.lastErrorObject.updatedExisting "+doc.lastErrorObject.updatedExisting);
                    }
                    else
                    {
                        console.log("The doc.lastErrorObject.updatedExisting "+doc.lastErrorObject.updatedExisting);
                    }
                    db.close();
                    console.log("The data is "+JSON.stringify(doc));
                }
            })
        }
    });
};
//network();
var ChannalName=function()
{
    liguo.Database.connect("mongodb://47.104.156.124:36911",{useNewUrlParser:true},function (err,db)
    {
        if(err)
        {
            console.log("Error");
        }
        else
        {
            var i=2001
            var index=0;
            var channel=1;
            var dbo=db.db("test");
            var str1="PortInfo."+index+".ChannalInfo."+channel+""+".PhyID";
            var str2="PortInfo."+index+".ChannalInfo."+channel+""+".Name";
            var test1={"key":"0C54A505AC1E00000000000001"};
            var test2={};
            test1[str1]=i;
            test2[str2]="test123"
            //dbo.collection("DeviceInfo").findOneAndUpdate({"key":"0C54A505AC1E00000000000001",str1:i},{$set:{str2:"test1"}},function(err,doc)
            dbo.collection("DeviceInfo").findOneAndUpdate(test1,{$set:test2},function(err,doc)
            {
                if(err)
                {
                    console.log("Have error");
                }
                else
                {
                    if(doc.lastErrorObject.updatedExisting)
                    {
                        console.log("The doc.lastErrorObject.updatedExisting "+doc.lastErrorObject.updatedExisting);
                    }
                    else
                    {
                        console.log("The doc.lastErrorObject.updatedExisting "+doc.lastErrorObject.updatedExisting);
                    }
                    db.close();
                    //console.log("The data is "+JSON.stringify(doc));
                }
            })
        }
    });
};
//ChannalName();
var ChannalName1=function()
{
    liguo.Database.connect("mongodb://47.104.156.124:36911",{useNewUrlParser:true},function (err,db)
    {
        if(err)
        {
            console.log("Error");
        }
        else
        {
            var i=2001
            var index=0;
            var channel=1;
            var dbo=db.db("test");
            var str1="PortInfo."+index+".ChannalInfo."+channel+""+".PhyID";
            var str2="PortInfo."+index+".ChannalInfo."+channel+""+".Name";
            console.log("The str is "+str1);
            var dbo=db.db("test");
            var str3="PortInfo.0.ChannalInfo.1.PhyID";
            var test={"key":"0C54A505AC1E00000000000001"};
            test[str1]=i;
            console.log("The test is "+JSON.stringify(test));
            if(str1==="PortInfo.0.ChannalInfo.1.PhyID")
            {
                console.log("相等");
            }
            else
            {
                console.log("不相等");
            }
            //"PortInfo.0.ChannalInfo.1.PhyID":2001
            dbo.collection("DeviceInfo").find(test).toArray(function(err,doc)
            {
                if(err)
                {
                    console.log("Have error "+err);
                }
                else
                {    
                    console.log("The data is "+JSON.stringify(doc));               
                    db.close();
                }
            });
        }
    });
};
//ChannalName1()
var Modtify=function()
{
    liguo.Database.connect("mongodb://47.104.156.124:36911",{useNewUrlParser:true},function (err,db)
    {
        if(err)
        {
            console.log("Error");
        }
        else
        {
            var dbo=db.db("test");
            var data={"ji":123,"fu":456,"kui":789};
            dbo.collection("test").findOneAndReplace({"ID":1},{data},function(err,doc)
            {
                if(err)
                {
                    console.log("Have error "+err);
                }
                else
                {    
                    console.log("The data is "+JSON.stringify(doc));               
                    db.close();
                }
            });
        }
    });
};
//Modtify();
function FindOne()
{
    liguo.Database.connect("mongodb://47.104.156.124:36911",{useNewUrlParser:true},function (err,db)
    {
        if(err)
        {
            console.log("Error");
        }
        else
        {
            var dbo=db.db("test");
           dbo.collection("DeviceInfo").findOne({"key":"0C54A505AC1E00000000000001"},function(err,doc){
               if(err)
               {
                   console.log("有错误");
               }
               else
               {
                   console.log("The data is "+JSON.stringify(doc));
                   /*
                   var data=doc;
                   data["test1"]="jifukui";
                   dbo.collection("test").findOneAndReplace({"ID":1},{data},function(err,doc)
                   {
                        if(err)
                        {
                            console.log("Have error "+err);
                        }
                        else
                        {    
                            console.log("The data is "+JSON.stringify(doc));               
                            db.close();
                        }
                    });*/
               }
           })
        }
    });
}
//FindOne();
function UpdateMany()
{
    liguo.Database.connect("mongodb://47.104.156.124:36911",{useNewUrlParser:true},function (err,db)
    {
        if(err)
        {
            console.log("Error");
        }
        else
        {
            var dbo=db.db("test");
            dbo.collection("test").updateMany({"ID":{$in:[1,2,3]}},{$set:{"DOTA":"jifukui12"}},function(err,doc){
                if(err)
                {
                    console.log("Have error for EDID");
                }
                else
                {
                    var i;
                    for (i in doc)
                    {
                        console.log(i+" is "+doc[i]);
                    }
                    console.log("The result is "+JSON.stringify(doc.result));
                    console.log("The return is "+JSON.stringify(doc));
                    console.log("The matched is "+doc.matchedCount);
                    db.close();
                }
            })
        }
    });
}
UpdateMany();
function GetPortArr(data)
{
    var i,val=[],tem;
    tem=0;
    for(i=0;i<data.length;i++)
    {
        if(i==2)
        {
            continue;
        }
        else if(i==3)
        {
            continue;
        }
        tem+=parseInt(data[i].PortNum);
        val.push(tem);
    }
    return val;
}
function GetPortIndex(value,data)
{
    var val=parseInt(value%1000)-1;
    switch(parseInt(value/1000))
    {
        case 0:
            value=val;
            break;
        case 1:
            value=val+data[0];
            break;
        case 2:
            value=val+1000;
            break;
        case 3:
            value=val+data[0]+1000;
            break;
        case 4:
            value=val+data[1];
            break;
        case 5:
            value=val+data[2];
            break;
    }
    return value;
}
//Find();