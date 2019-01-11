var liguodatabase={};
var database="test";
liguodatabase.Database=require('mongodb').MongoClient;
liguodatabase.Error=require("../error/liguoerror");
liguodatabase.data;
liguodatabase.init=function(obj){
    liguodatabase.Database.connect("mongodb://47.104.156.124:36911",{useNewUrlParser:true},function(err,db){
        if(err)
        {
            console.log("Have Error for database"+err);
        }
        else
        {
            liguodatabase.database=db;
            liguodatabase.ClearSessionId();
            //清空数据库会话ID
            obj.cmd.User=obj.cmd.UserManage.UserManage.Init();
            //命令错误
            obj.cmd.Error.ErrorStr.Cmd.command.init();
            //认证错误
            obj.cmd.Error.ErrorStr.Auth.Authentication.init();
            //数据错误
            obj.cmd.Error.ErrorStr.Com.Common.init();
            console.log("connect database success");
        }
    })
    console.log("This is liguomongo");
}
liguodatabase.Destory=function(){
    if(liguodatabase.state)
    {
        console.log("数据库存在，并关闭数据库");
        liguodatabase.database.close();   
    }
    else
    {
        console.log("数据库不存在");
    }
}
/*

 */
//删除所有会话id
liguodatabase.ClearSessionId=function()
{
    var dbo=liguodatabase.database.db(database);
    dbo.collection("User").updateMany({"Session_id":{$ne:""}},{$set:{"Session_id":""}});
}
//获取当前所有处于会话状态的单元
liguodatabase.GetActiveUser=function(userlist)
{
    var dbo=liguodatabase.database.db(database);
    dbo.collection("User").find({"Session_id":{$ne:""}}).toArray(function(err,doc){
        if(err)
        {
            console.log("Have error ")
        }
        else
        {
            userlist.User=doc;
            console.log("The Value is "+JSON.stringify(doc));
        }
    });
}
//添加处于活动状态的用户
liguodatabase.AddActiveUser=function(name,passwd,res,value,call,Userlist)
{
    var dbo=liguodatabase.database.db(database);
    var time=Date.now();
    console.log("The Username is "+name);
    console.log("The password is "+passwd);
    dbo.collection("User").findOneAndUpdate({"UserName":name,"password":passwd},{$set:{"Session_id":time}},function(err,doc){
        value.status="fail";
        if(err)
        {
            console.log("Have error");
        }
        else
        {
            //console.log("The doc is "+JSON.stringify(doc));
            if(doc.lastErrorObject.updatedExisting)
            {
                value.status="success";
                value.data={"Session_id":time,"Priority":doc.value.priority};
            }
            else
            {
                value.error=liguodatabase.Error.ErrorStr.Auth.Authentication.Mismatch;
            }
            call(Userlist);
            console.log("The doc.lastErrorObject.updatedExisting "+doc.lastErrorObject.updatedExisting);
            res.send(value);
        }
    });
    console.log("jifukui ");
}
//删除当前处于会话状态的单元
liguodatabase.DeleteActiveUser=function(name,res,value,call,Userlist)
{
    console.log("删除活动用户");
    var dbo=liguodatabase.database.db(database);
    dbo.collection("User").findOneAndUpdate({"UserName":name},{$set:{"Session_id":""}},function(err,doc){
        value.status="fail";
        if(err)
        {
            console.log("Have error");
        }
        else
        {
            if(doc.lastErrorObject.updatedExisting)
            {
                value.status="success";
            }
            else
            {
                value.error=liguodatabase.Error.ErrorStr.Com.Common.Nouser;
            }
        }
        call(Userlist);
        console.log("The doc.lastErrorObject.updatedExisting "+doc.lastErrorObject.updatedExisting);
        res.send(value);
    });
}
//用户信息认证
liguodatabase.Auth=function(value){
    var dbo=liguodatabase.database.db(database);
    return dbo.collection("User").find(value);
}
liguodatabase.Userlist=function(value,res,user)
{
    var dbo=liguodatabase.database.db(database);
    var base;
    if(user=="admin")
    {    
        base=dbo.collection("User").find({},{"projection":{"UserName":true,"priority":true,"_id":false}})
    }
    else
    {
        base=dbo.collection("User").find({"UserName":user},{"projection":{"UserName":true,"priority":true,"_id":false}})
    }
    
    base.toArray(function(err,doc){
        value.status="fail";
        if(err)
        {
            console.log("Have error for get user list");
        }
        else
        {
            value.status="success";
            value.data=[];
            value.data.push(doc);
            res.send(value);
        }
    })
    
}
//用户注册
liguodatabase.AddUser=function(auth,user,res,value){
    var dbo=liguodatabase.database.db(database);
    console.log("The auth is "+JSON.stringify(auth));
    dbo.collection("User").find(auth).toArray(function(err,data){
        value.status="fail";
        if(err)
        {
            console.log("Add User error");
        }
        else
        {
            if(data.length==0)
            {
                value.error=liguodatabase.Error.ErrorStr.Com.Common.Autherror;
                res.send(value);
            }
            else
            {
                dbo.collection("User").insertOne(user,function(err,data){
                    value.status="fail";
                    if(err)
                    {
                        value.error=liguodatabase.Error.ErrorStr.Com.Common.HaveReg;
                        res.send(value);
                    }
                    else
                    {
                        if(data.result.ok)
                        {
                            value.status="success";
                        }
                        else
                        {
                            value.error=liguodatabase.Error.ErrorStr.Com.Common.AdduserErr;
                        }
                        res.send(value);
                    }
                })
            }
        }
    })
}
//用户删除
liguodatabase.DeleteUser=function(auth,username,res,value,call,Userlist)
{
    var dbo=liguodatabase.database.db(database);
    dbo.collection("User").find(auth).toArray(function(err,data){
        value.status="fail";
        if(err)
        {
            console.log("Add User error");
        }
        else
        {
            if(data.length==0)
            {
                value.error=liguodatabase.Error.ErrorStr.Com.Common.Autherror;
                res.send(value);
            }
            else
            {
                dbo.collection("User").findOneAndDelete({"UserName":username},function(err,data){
                    value.status="fail";
                    if(err)
                    {
                        console.log("Have error");
                    }
                    else
                    {
                        if(data.ok)
                        {
                            value.status="success";
                        }
                        else
                        {
                            value.error=liguodatabase.Error.ErrorStr.Com.Common.DeluserErr;
                        }
                    }
                    call(Userlist);
                    res.send(value);
                })
            }
        }
    })
}
//更新用户
liguodatabase.UpdateUser=function(auth,user,res,value,call,Userlist)
{
    var dbo=liguodatabase.database.db(database);
    dbo.collection("User").find(auth).toArray(function(err,data){
        value.status="fail";
        if(err)
        {
            console.log("Add User error");
        }
        else
        {
            if(data.length==0)
            {
                value.error=liguodatabase.Error.ErrorStr.Com.Common.Autherror;
                res.send(value);
            }
            else
            {
                dbo.collection("User").findOneAndReplace({"UserName":user.UserName},user,function(err,data){
                    value.status="fail";
                    if(err)
                    {
                        console.log("Have error "+err);
                    }
                    else
                    {
                        if(data.lastErrorObject.updatedExisting)
                        {
                            value.status="success";
                        }
                        else
                        {
                            value.error=liguodatabase.Error.ErrorStr.Com.Common.UpdateuserErr;
                        }
                    }
                    call(Userlist);
                    res.send(value);
                })
            }
        }
    })
}
liguodatabase.DeviceList=function(value,res,liguo)
{
    var dbo=liguodatabase.database.db(database);
    // return dbo.collection("DeviceInfo").aggregate([{$sort:{"BaseInfo.Name":1}},{$group:{_id:"$BaseInfo.ClassType",list:{$push:{"Name":"$BaseInfo.Name","Key":"$key","ModuleName":"$BaseInfo.ModuleName"}}}}]);
    dbo.collection("DeviceInfo").aggregate([{$sort:{"BaseInfo.Name":1}},{$group:{_id:"$BaseInfo.ClassType",list:{$push:{"Name":"$BaseInfo.Name","Key":"$key","ModuleName":"$BaseInfo.ModuleName"}}}}]).toArray(function(err,doc){
        value.status="fail";
        if(err)
        {
            console.log("have error for Devicelist");
        }
        else
        {
            value.status="success";
            liguo.Devicelist.data=[];
            liguo.Devicelist.data.push(doc);
            liguo.Devicelist.change=false;
            value.data=liguo.Devicelist.data;
            res.send(value);
        }
    })
}
liguodatabase.DeviceInfo=function(module,key,res,liguo,value){
    var dbo=liguodatabase.database.db(database);
    var data;
    dbo.collection("DeviceInfo").find({"key":key},{"projection":{"_id":false}}).toArray(function(err,data0){
        if(err)
        {
            console.log("Have error");
        }
        else
        {
            data=JSON.parse(JSON.stringify(data0[0]));
            value.status="fail";
            //console.log(JSON.stringify(data0));      
            dbo.collection("Device").find({"ModuleName":module}).toArray(function(err,data1){
                if(err)
                {
                    console.log("Have error Device");
                }
                else
                {
                    //console.log("The data [0] is "+JSON.stringify(data1[0]));
                    var test1;
                    data.BaseInfo.DefaultEDID=data1[0].DefaultEDID;
                    console.log("The default EDID is "+data1[0].DefaultEDID);
                    data["产品简介"]=data1[0]["产品简介"];
                    data["产品特性"]=data1[0]["产品特性"];
                    data.PhotoURL=data1[0].PhotoURL;
                    //console.log("The data [0] is "+JSON.stringify(data.PhotoURL));
                    //console.log("The data [0] is "+JSON.stringify(data1[0].PhotoURL));
                    for(test1=0;test1<data1[0].PHYPortList.length;test1++)
                    {
                        data.PortInfo[test1].PHYName=data1[0].PHYPortList[test1].PhyName;
                    }
                    dbo.collection("EDID").find({"key":key}).sort({"PortIndex":1}).toArray(function(err,data2){
                        if(err)
                        {
                            console.log("Have error EDID");
                        }
                        else
                        {
                            var i;
                            for(i=0;i<data2.length;i++)
                            {
                                data.PortInfo[i].EDID=data2[i].EDID;
                            }
                            dbo.collection("Macro").find({"key":key},{"projection":{"Name":1,"Switch":1,"_id":false}}).sort({"Name":1}).toArray(function(err,data3){
                                if(err)
                                {
                                    console.log("Have error Macro");
                                }
                                else
                                {
                                    var i,j;
                                    var input,output,val,portnum,stri,stro,ji=[];
                                    portnum=GetPortArr(data.BaseInfo.PortInfo);
                                    for(i=0;i<data3.length;i++)
                                    {
                                        console.log("The base data is "+JSON.stringify(data3[i]));
                                        ji=[];
                                        for(j=0;j<data3[i].Switch.length;j++)
                                        {
                                            val=data3[i].Switch[j].split(">");
                                            input=parseInt(val[0]);
                                            output=parseInt(val[1]);
                            
                                            input=GetPortIndex(input,portnum);
                                            output=GetPortIndex(output,portnum);
                                            
                                                    
                                            stri=data.PortInfo[parseInt(input%1000)].PHYName+"_"+data.PortInfo[parseInt(input%1000)].ChannalInfo[parseInt(input/1000)].Name;
                                            stro=data.PortInfo[parseInt(output%1000)].PHYName+"_"+data.PortInfo[parseInt(output%1000)].ChannalInfo[parseInt(output/1000)].Name;
                                            ji.push(stri+"<-->"+stro);
                                            
                                        }
                                        data3[i].SwitchInfo=ji;
                                    }
                                    var info={};
                                    data.Macro=data3;
                                    value.status="success";
                                    value.data=data;
                                    info.data=data;
                                    info.change=false;
                                    liguo.DeviceInfo[key]=info;
                                    // liguo.DeviceInfo.data=data;
                                    // liguo.DeviceInfo.change=false;
                                    res.send(value);
                                }
                            })
                        }
                    })
                }
            })
        }
        
    })
}
liguodatabase.SetDeviceName=function(value,res,key,name,liguo)
{
    var dbo=liguodatabase.database.db(database);
    dbo.collection("DeviceInfo").findOneAndUpdate({"key":key},{$set:{"BaseInfo.Name":name}},function(err,doc){
        value.status="fail";
        if(err)
        {
            console.log("Have error");
        }
        else
        {
            if(doc.lastErrorObject.updatedExisting)
            {
                liguo.DeviceInfo[key].change=true;
                value.status="success";
            }
            else
            {
                value.error=liguodatabase.Error.ErrorStr.Com.Common.Nodevice;
            }
            console.log("The doc.lastErrorObject.updatedExisting "+doc.lastErrorObject.updatedExisting);
            res.send(value);
        }
    });
}
liguodatabase.SetDHCPStatus=function(value,res,key,DHCP,liguo)
{
    var dbo=liguodatabase.database.db(database);
    dbo.collection("DeviceInfo").findOneAndUpdate({"key":key},{$set:{"network.dhcp":DHCP}},function(err,doc){
        value.status="fail";
        if(err)
        {
            console.log("Have error");
        }
        else
        {
            if(doc.lastErrorObject.updatedExisting)
            {
                liguo.DeviceInfo[key].change=true;
                value.status="success";
            }
            else
            {
                value.error=liguodatabase.Error.ErrorStr.Com.Common.Nodevice;
            }
            console.log("The doc.lastErrorObject.updatedExisting "+doc.lastErrorObject.updatedExisting);
            res.send(value);
        }
    });
}
liguodatabase.SetNetwork=function(value,res,key,network,liguo)
{
    console.log("设置设备网络参数");
    var dbo=liguodatabase.database.db(database);
    dbo.collection("DeviceInfo").findOneAndUpdate({"key":key},{$set:{"network.ip":network.ip,"network.mask":network.mask,"network.gateway":network.gateway,"network.TCP":network.TCP,"network.UDP":network.UDP}},function(err,doc){
        value.status="fail";
        if(err)
        {
            console.log("Have error");
        }
        else
        {
            if(doc.lastErrorObject.updatedExisting)
            {
                liguo.DeviceInfo[key].change=true;
                value.status="success";
            }
            else
            {
                value.error=liguodatabase.Error.ErrorStr.Com.Common.Nodevice;
            }
            console.log("The doc.lastErrorObject.updatedExisting "+doc.lastErrorObject.updatedExisting);
            res.send(value);
        }
    });
}
liguodatabase.SetChannalName=function(value,res,key,channal,name,liguo)
{
    console.log("设置通道名称");
    var data
    var dbo=liguodatabase.database.db(database);
    var portnum=GetPortArr(liguo.DeviceInfo[key].data.BaseInfo.PortInfo);
    var data=GetPortIndex(channal,portnum);
    index=data%1000
    var ch=parseInt(data/1000);
    var str1="PortInfo."+index+".ChannalInfo."+ch+""+".PhyID";
    var str2="PortInfo."+index+".ChannalInfo."+ch+""+".Name";
    var query={};
    var update={};
    query["key"]=key;
    query[str1]=channal;
    update[str2]=name;
    console.log("The query is "+JSON.stringify(query));
    dbo.collection("DeviceInfo").findOneAndUpdate(query,{$set:update},function(err,doc){
        value.status="fail";
        if(err)
        {
            console.log("Have error");
        }
        else
        {
            if(doc.lastErrorObject.updatedExisting)
            {
                liguo.DeviceInfo[key].change=true;
                value.status="success";
            }
            else
            {
                value.error=liguodatabase.Error.ErrorStr.Com.Common.Nodevice;
            }
            console.log("The doc.lastErrorObject.updatedExisting "+doc.lastErrorObject.updatedExisting);
            res.send(value);
        }
    });
}
liguodatabase.SetRoutChannal=function(value,res,key,data,liguo)
{
    var dbo=liguodatabase.database.db(database);
    dbo.collection("DeviceInfo").findOne({"key":key},function(err,doc)
    {
        value.status="fail";
        if(err)
        {
            console.log("有错误");
        }
        else
        {
            var val=data.split(">");
            if(val.length!=2)
            {
                value.error=liguodatabase.Error.ErrorStr.Cmd.command.RoutErr;
                res.send(value);
            }
            else
            {
                var input =parseInt(val[0]);
                var output=parseInt(val[1]);
                if((parseInt(output/1000)%2)==0)
                {
                    value.error=liguodatabase.Error.ErrorStr.Cmd.command.RoutErr;
                    res.send(value);
                    return;
                }
                if((parseInt(input/1000)%2)==1)
                {
                    value.error=liguodatabase.Error.ErrorStr.Cmd.command.RoutErr;
                    res.send(value);
                    return;
                }
                var sdata=doc;
                var portnum=GetPortArr(liguo.DeviceInfo[key].data.BaseInfo.PortInfo);
                input=GetPortIndex(input,portnum);
                output=GetPortIndex(output,portnum);
                var temp=sdata.PortInfo[parseInt(output%1000)].ChannalInfo[parseInt(output/1000)].Connected;
                temp=GetPortIndex(temp,portnum);
                if(sdata.PortInfo[parseInt(output%1000)].ChannalInfo[parseInt(output/1000)].Connected==parseInt(val[0]))
                {
                    liguo.DeviceInfo[key].change=true;
                    value.status="success";
                    res.send(value);
                    return;
                }
                if(temp!=-1)
                {
                    var i;
                    for(i=0;i<sdata.PortInfo[parseInt(temp%1000)].ChannalInfo[parseInt(temp/1000)].Connected.length;i++)
                    {
                        if(sdata.PortInfo[parseInt(temp%1000)].ChannalInfo[parseInt(temp/1000)].Connected[i]==parseInt(val[1]))
                        {
                            sdata.PortInfo[parseInt(temp%1000)].ChannalInfo[parseInt(temp/1000)].Connected.splice(i,1);
                            break;
                        }
                    }
                }
                console.log("the input is "+input);
                sdata.PortInfo[parseInt(input%1000)].ChannalInfo[parseInt(input/1000)].Connected.push(parseInt(val[1]));
                sdata.PortInfo[parseInt(output%1000)].ChannalInfo[parseInt(output/1000)].Connected=(parseInt(val[0]));
                dbo.collection("DeviceInfo").findOneAndReplace({"key":key},sdata,function(err1,doc1){
                    value.status="fail";
                    if(err1)
                    {
                        console.log("有错误");
                    }
                    else
                    {
                        if(doc1.lastErrorObject.updatedExisting)
                        {
                            liguo.DeviceInfo[key].change=true;
                            value.status="success";
                            res.send(value);
                        }
                        else
                        {
                            value.error=liguodatabase.Error.ErrorStr.Cmd.command.RoutErr;
                            res.send(value);
                        }   
                    }
                })
            }
        }
    })
}
liguodatabase.SetMacroName=function(value,res,key,oldname,newname,liguo)
{
    var dbo=liguodatabase.database.db(database);
    dbo.collection("Macro").findOneAndUpdate({"key":key,"Name":oldname},{$set:{"Name":newname}},function(err,doc){
        value.status="fail";
        if(err)
        {
            console.log("Have error");
        }
        else
        {
            if(doc.lastErrorObject.updatedExisting)
            {
                liguo.DeviceInfo[key].change=true;
                value.status="success";
            }
            else
            {
                value.error=liguodatabase.Error.ErrorStr.Cmd.command.nothismacro;
            }
            console.log("The doc.lastErrorObject.updatedExisting "+doc.lastErrorObject.updatedExisting);
            res.send(value);
        }
    })
}
liguodatabase.AddMacro=function(value,res,key,macro,liguo)
{
    var dbo=liguodatabase.database.db(database);
    dbo.collection("Macro").find({"key":key,"Name":macro.name}).toArray(function(err,data){
        value.status="fail";
        if(err)
        {
            console.log("Add Macro error");
        }
        else
        {
            if(data.length!=0)
            {
                value.error=liguodatabase.Error.ErrorStr.Cmd.command.MacroExt;
                res.send(value);
            }
            else
            {
                console.log("The Key is "+key);
                dbo.collection("Macro").insertOne({"key":key,"Name":macro.name,"Switch":macro.data},function(err,data){
                    if(err)
                    {
                        value.error=liguodatabase.Error.ErrorStr.Cmd.command.AddMacro;
                        res.send(value);
                    }
                    else
                    {
                        if(data.result.ok)
                        {
                            liguo.DeviceInfo[key].change=true;
                            value.status="success";
                        }
                        else
                        {
                            value.error=liguodatabase.Error.ErrorStr.Cmd.command.AddMacro;
                        }
                        res.send(value);
                    }
                })
            }
        }
    })
}
liguodatabase.DeleteMacro=function(value,res,key,name,liguo)
{
    var dbo=liguodatabase.database.db(database);
    dbo.collection("Macro").find({"key":key,"Name":name}).toArray(function(err,data){
        value.status="fail";
        if(err)
        {
            console.log("Delete User error");
        }
        else
        {
            if(data.length==0)
            {
                value.error=liguodatabase.Error.ErrorStr.Cmd.command.NoMacro;
                res.send(value);
            }
            else
            {
                dbo.collection("Macro").findOneAndDelete({"Name":name},function(err,data){
                    if(err)
                    {
                        console.log("Have error");
                    }
                    else
                    {
                        if(data.ok)
                        {
                            liguo.DeviceInfo[key].change=true;
                            value.status="success";
                        }
                        else
                        {
                            value.error=liguodatabase.Error.ErrorStr.Cmd.command.DelMacro;
                        }
                    }
                    res.send(value);
                })
            }
        }
    })
}
liguodatabase.UpdateMacro=function(value,res,key,macro,liguo)
{
    var dbo=liguodatabase.database.db(database);
    dbo.collection("Macro").find({"key":key,"Name":macro.name},{projection:{"_id":false}}).toArray(function(err,doc){
        value.status="fail";
        if(err)
        {
            console.log("Update Macro error");
        }
        else
        {
            if(doc.length==0)
            {
                value.error=liguodatabase.Error.ErrorStr.Cmd.command.NoMacro;
                res.send(value);
            }
            else
            {
                var val=doc[0];
                val.Switch=macro.data;
                dbo.collection("Macro").findOneAndReplace({"key":key,"Name":macro.name},val,function(err,data){
                    if(err)
                    {
                        console.log("Have error "+err);
                    }
                    else
                    {
                        if(data.lastErrorObject.updatedExisting)
                        {
                            liguo.DeviceInfo[key].change=true;
                            value.status="success";
                        }
                        else
                        {
                            value.error=liguodatabase.Error.ErrorStr.Com.Common.UpdateuserErr;
                        }
                    }
                    res.send(value);
                })
            }
        }
    })
}
liguodatabase.RunMacro=function(value,res,key,name,liguo)
{
    var dbo=liguodatabase.database.db(database);
    dbo.collection("Macro").find({"key":key,"Name":name},{projection:{"_id":false,Switch:true}}).toArray(function(err,doc){
        value.status="fail";
        if(err)
        {
            console.log("Update Macro error");
        }
        else
        {
            if(doc.length==0)
            {
                value.error=liguodatabase.Error.ErrorStr.Cmd.command.NoMacro;
                res.send(value);
            }
            else
            {
                Router(value,res,key,liguo,doc[0].Switch);
            }
        }
    })
}
liguodatabase.SetVideoInfo=function(value,res,key,PHYID,videoInfo,liguo)
{
    value.status="fail";
    if(!liguo.DeviceInfo[key])
    {
        value.error=liguodatabase.Error.ErrorStr.Com.Common.Nodevice;
        res.send(value);
    }
    else
    {
        var data=liguo.DeviceInfo[key].data;
        var dbo=liguodatabase.database.db(database);
        var portnum=GetPortArr(liguo.DeviceInfo[key].data.BaseInfo.PortInfo);
        PHYID=GetPortIndex(PHYID,portnum);
        PortInfo[parseInt(PHYID%1000)].ChannalInfo[parseInt(PHYID/1000)].Name=videoInfo.Name;
        PortInfo[parseInt(PHYID%1000)].ChannalInfo[parseInt(PHYID/1000)].Name=videoInfo.Name;
        PortInfo[parseInt(PHYID%1000)].ChannalInfo[parseInt(PHYID/1000)].Name=videoInfo.Name;
        dbo.collection("DeviceInfo").findOneAndReplace({"key":key},data,function(err,doc){
            value.status="fail";
            if(err)
            {
                console.log("Have error for VideoInfo");
            }
            else
            {
                if(doc.lastErrorObject.updatedExisting)
                {
                    liguo.DeviceInfo[key].change=true;
                    value.status="success";
                }
                else
                {
                    value.error=liguodatabase.Error.ErrorStr.Com.Common.UpdateuserErr;
                }
            }
        })
    }
}
liguodatabase.SetAudioInfo=function(value,res,key,PHYID,audioInfo,liguo)
{
    value.status="fail";
    if(!liguo.DeviceInfo[key])
    {
        value.error=liguodatabase.Error.ErrorStr.Com.Common.Nodevice;
        res.send(value);
    }
    else
    {
        var data=liguo.DeviceInfo[key].data;
        var dbo=liguodatabase.database.db(database);
        var portnum=GetPortArr(liguo.DeviceInfo[key].data.BaseInfo.PortInfo);
        PHYID=GetPortIndex(PHYID,portnum);
        dbo.collection("DeviceInfo").findOneAndReplace({"key":key},data,function(err,doc){
            value.status="fail";
            if(err)
            {
                console.log("Have error for AudioInfo");
            }
            else
            {
                if(doc.lastErrorObject.updatedExisting)
                {
                    liguo.DeviceInfo[key].change=true;
                    value.status="success";
                }
                else
                {
                    value.error=liguodatabase.Error.ErrorStr.Com.Common.UpdateuserErr;
                }
            }
        })
    }
}
liguodatabase.SetChannalInfo=function(value,res,key,PHYID,ChannalInfo,liguo)
{
    console.log("这个是设置通道的信息 "+JSON.stringify(ChannalInfo));
    value.status="fail";
    if(!liguo.DeviceInfo[key])
    {
        value.error=liguodatabase.Error.ErrorStr.Com.Common.Nodevice;
        res.send(value);
    }
    else
    {
        var data={};
        var dbo=liguodatabase.database.db(database);
        var portnum=GetPortArr(liguo.DeviceInfo[key].data.BaseInfo.PortInfo);
        PHYID=GetPortIndex(PHYID,portnum);
        var index=parseInt(PHYID%1000);
        var ch=parseInt(PHYID/1000);
        var i;
        var str="PortInfo."+index+".ChannalInfo."+ch+""+".";
        for(i in ChannalInfo)
        {
            //console.log("The Data is "+str+i);
            var str1=str+i;
            //console.log("The Data1 is "+str1);
            data[str1]=ChannalInfo[i];
        }
        console.log("The data is "+JSON.stringify(data));
        dbo.collection("DeviceInfo").findOneAndUpdate({"key":key},{$set:data},function(err,doc){
            value.status="fail";
            if(err)
            {
                console.log("Have error for VideoInfo "+err);
            }
            else
            {
                if(doc.lastErrorObject.updatedExisting)
                {
                    liguo.DeviceInfo[key].change=true;
                    value.status="success";
                }
                else
                {
                    value.error=liguodatabase.Error.ErrorStr.Com.Common.UpdateuserErr;
                }
                res.send(value);
            }
        })
    }
}
liguodatabase.output=function(value)
{
    var len=value.toArray(function(err,data){
        if(err)
        {

        }
        else
        {
            console.log("The data is "+JSON.stringify(data));
        }
    });    
    if(len!=0)
    {
        return value;
    }
    else
    {
        console.log("to array error");
        return 1;
    };  
}
var defaultedid="00FFFFFFFFFFFF0011EE13000101010100120103803A20780A0DC9A05747982712484C2DCE0081803159455961590101010101010101662150B051001B30407036004440210000180E1F008051001E3040803700104E4200001E000000FC0044454E4F4E2D4156414D500A20000000FD0038550E4610000A2020202020200163020348705E141312111615050403020706011F102021220E230F241D251E260A0B191A380F07073D1EC01507505F7E01570600657E00671E004D0200835F000067030C001100B82D0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000074"
liguodatabase.SetRoutEDID=function(value,res,key,EDID,liguo)
{
    if(!liguo.DeviceInfo[key])
    {
        value.status="fail";
        value.error=liguodatabase.Error.ErrorStr.Com.Common.Nodevice;
        res.send(value);
    }
    else
    {
        var sdata=liguo.DeviceInfo[key].data;
        var data="";
        switch(EDID.mode)
        {
            case "IN":
            {
                console.log("选择的是输入源");
            }
            case "OUT":
            {
                console.log("选择的是输出源");
                data=sdata.PortInfo[EDID.In-1];
                break;
            }
            case "Default":
            {
                //data=defaultedid;
                data=sdata.BaseInfo.DefaultEDID;
                break;
            }
            case "File":
            {
                data=EDID.data;
                break;
            }
        }
        console.log("设置EDID database");
        console.log("teh data is "+JSON.stringify(data));
        var i;
        var dbo=liguodatabase.database.db(database);
        dbo.collection("EDID").updateMany({"PortIndex":{$in:EDID.Out},"key":key},{$set:{"EDID":data}},function(err,doc){
            if(err)
            {
                console.log("Have error for EDID Update "+err);
            }
            else
            {
                liguo.DeviceInfo[key].change=true;
                value.status="success";
                console.log("The mactch is "+doc.matchedCount);
                res.send(value);
            }
        })
        
        
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////错误信息相关///////////////////////////////////////////////////////////////////////////////////
liguodatabase.ErrorGenerator=function(value)
{
    //var test="Command"
    console.log("The error value is "+value);
    var dbo=liguodatabase.database.db(database);
    return dbo.collection("Error").find({"ErrorClass":value});
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
function Router(value,res,key,liguo,doc)
{
    var i;
    var input ="";
    var output="";
    var temp="";
    var sdata={};
    //sdata=DeviceInfo(liguo.DeviceInfo[key].data);
    var val="";
    var portnum=GetPortArr(liguo.DeviceInfo[key].data.BaseInfo.PortInfo);
    console.log("The doc is "+JSON.stringify(doc));
    //console.log("The new data is "+JSON.stringify(sdata));
    var dbo=liguodatabase.database.db(database);
    dbo.collection("DeviceInfo").find({"key":key}).toArray(function(derr,ddoc){
        if(derr)
        {
            console.log("RUN Macro error");
        }
        else
        {
            sdata=ddoc[0];
            for(i=0;i<doc.length;i++)
            {
                val=doc[i];
                val=val.split(">");
                input =parseInt(val[0]);
                output=parseInt(val[1]);
                input=GetPortIndex(input,portnum);
                output=GetPortIndex(output,portnum);
                temp=sdata.PortInfo[parseInt(output%1000)].ChannalInfo[parseInt(output/1000)].Connected;
                temp=GetPortIndex(temp,portnum);
                //console.log("The input is "+input);
                //console.log("The output is "+output);
                //console.log("The temp is "+temp);
                if(sdata.PortInfo[parseInt(output%1000)].ChannalInfo[parseInt(output/1000)].Connected==parseInt(val[0]))
                {
                    continue;
                }
                if(temp!=-1)
                {
                    var j;
                    for(j=0;j<sdata.PortInfo[parseInt(temp%1000)].ChannalInfo[parseInt(temp/1000)].Connected.length;j++)
                    {
                        if(sdata.PortInfo[parseInt(temp%1000)].ChannalInfo[parseInt(temp/1000)].Connected[j]==parseInt(val[1]))
                        {
                            sdata.PortInfo[parseInt(temp%1000)].ChannalInfo[parseInt(temp/1000)].Connected.splice(j,1);
                            break;
                        }
                    }
                }
                sdata.PortInfo[parseInt(input%1000)].ChannalInfo[parseInt(input/1000)].Connected.push(parseInt(val[1])); 
                sdata.PortInfo[parseInt(output%1000)].ChannalInfo[parseInt(output/1000)].Connected=(parseInt(val[0]));
            }
            dbo.collection("DeviceInfo").findOneAndReplace({"key":key},sdata,function(err,doc1)
            {
                if(err)
                {
                    console.log("The Run Macro is fail")
                }
                else
                {
                    if(doc1.lastErrorObject.updatedExisting)
                    {
                        liguo.DeviceInfo[key].change=true;
                        value.status="success";
                    }
                    else
                    {
                        value.error=liguodatabase.Error.ErrorStr.Cmd.command.RunMacro;
                    }
                    res.send(value);
                }
            })
        }
    })
    
}

exports.database=liguodatabase;
