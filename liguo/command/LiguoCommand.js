var express=require("express");
var liguocommand={}
liguocommand.app=express();
liguocommand.bodyParser=require('body-parser');
liguocommand.app.use(liguocommand.bodyParser.urlencoded({extended:false}));
liguocommand.app.use(liguocommand.bodyParser.json());
liguocommand.app.use(liguocommand.bodyParser.json({limit:'50mb'}));
liguocommand.app.use(liguocommand.bodyParser.urlencoded({limit: '50mb', extended: true}))
var DataBase=require("../database/liguodatabase");
liguocommand.UserManage=require("./User");
liguocommand.DeviceManage=require("./Device");
liguocommand.Error=require("../error/liguoerror");
liguocommand.json=require("../json/liguojson");
liguocommand.DeviceInfo={};
liguocommand.Devicelist={"data":[],"change":true};
liguocommand.IsReturn=false;
const fs=require('fs');
liguocommand.app.use("/",function(req,res)
{
    var value={};
    var flag=false;
    var call=[];
    var base;
    liguocommand.IsReturn=false;
    value=liguocommand.json.Json.init(1);
    //statue
    value.status="fail";
    value.responseID=req.body.request;
    value.timeStramp=Date.now();
    value.data=[];
    value.error={"errortype":""};
    //判断是否有会话ID
    console.log("错误的数据为1"+JSON.stringify(value.error));
    //if(req.body["Authentication[SessionId]"])
    if(req.body.Authentication.SessionId)
    {
        //有会话ID首先需要进行用户的会话ID的认证
        console.log("good");
        console.log("The active user is "+liguocommand.User.length);
        var i=0;
        for(i=0;i<liguocommand.User.length;i++)
        { 
            if(req.body.Authentication.UserName==liguocommand.User[i].UserName)
            {     
                if(req.body.Authentication.SessionId==liguocommand.User[i].Session_id)
                {
                    console.log("有这个ID");
                    flag=true; 
                    break;
                }
            }
        }
        if(flag)
        {
            var index=0;
            for(index;index<req.body.datalen;index++)
            {
                var func=CommandHandler(req,res,value,base,index);
                call.push(func);
            }
        }
        else
        {
            value.error=liguocommand.Error.ErrorStr.Auth.Authentication.AuthErr;
            console.log("not have this Session");
            res.send(value);
        }
    }
    //对于无会话ID的需要判断是不是登录访问
    else
    {
        console.log("没有会话ID");
        console.log("The active user is "+liguocommand.User.length);
        var i=0;
        for(i=0;i<liguocommand.User.length;i++)
        { 
            
            //if(req.body["Authentication[UserName]"]==liguocommand.User[i].UserName)
            if(req.body.Authentication.UserName==liguocommand.User[i].UserName)
            {     
                console.log("当前用户已经登陆");
                value.error=liguocommand.Error.ErrorStr.Auth.Authentication.SessionExt;
                res.send(value);
                return;
            }
        }
        //进行身份认证
        //if(req.body["data[0][CommandType]"]=='Authentication')
        if(req.body.data[0].CommandType=='Authentication')
        {
            liguocommand.IsReturn=true;
            console.log("用户身份验证");
            liguocommand.UserManage.UserManage.AddActiveUser(req.body.data[0].CommandData.UserName,req.body.data[0].CommandData.Password,res,value,liguocommand);
        }
        //不进行身份认证
        else
        {
            console.log("错误的数据");
            error=liguocommand.Error.ErrorStr.Com.Common.typeerror; 
            value.error=liguocommand.Error.ErrorStr.Com.Common.DataMat;
            res.send(value);   
        }      
    }
    // console.log("The IS return is "+liguocommand.IsReturn);
    // if(!liguocommand.IsReturn)
    // {
    //     Output(res,value,call);
    // }
    console.log("end of this ");
});
var CommandHandler=function(req,res,value,base,index)
{
    // var call={"base":{},"func":{}};
    // var func;
    var error={};
    //console.log("The data type is "+req.body.data[index].CommandType);
    //console.log("The data CommandName is "+req.body.data[index].CommandData.CommandName);
    //console.log("The data CommandData is "+req.body.data[index].CommandData.CommandData);
    switch (req.body.data[index].CommandData.CommandName){
        //注销登录
        case "logout":
        {
            if(req.body.data[index].CommandType=="Authentication")
            {
                liguocommand.IsReturn=true;
                liguocommand.UserManage.UserManage.DeleteActiveUser(req.body.data[0].CommandData.UserName,res,value,liguocommand);
            }
            else
            {
                error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd;
            }
            break;
        }
        //获取用户列表
        case "User":
        {
            //获取用户列表 完成
            console.log("获取用户信息");
            if(req.body.data[index].CommandType=="get")
            {  
                //base=DataBase.database.Userlist(req.body.data[index].CommandData.UserName);  
                //func=liguocommand.UserManage.UserManage.GetUserList;
                //console.log("Good for call");
                liguocommand.IsReturn=true;
                DataBase.database.Userlist(value,res,req.body.data[index].CommandData.UserName);              
            }
            else
            {
                error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd;
            }   
            break; 
        }
        //添加用户
        case "AddUser":
        {
            console.log("添加用户");
            if(req.body.data[index].CommandType!="set")
            {
                error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd;
            }
            else
            {
                liguocommand.IsReturn=true;
                var user,auth;
                user=liguocommand.UserManage.UserManage.InfoSeting(user,req,index);
                auth=liguocommand.UserManage.UserManage.AuthSeting(user,req,index);
                liguocommand.UserManage.UserManage.AddUser(auth,user,res,value);
            }
            break;
        }
        //删除用户
        case "DeleteUser":
        {
            console.log("删除用户");
            if(req.body.data[index].CommandType!="set")
            {
                error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd;
            }
            else
            {
                var auth;
                liguocommand.IsReturn=true;
                auth=liguocommand.UserManage.UserManage.AuthSeting(user,req,index);
                liguocommand.UserManage.UserManage.DeleteUser(auth,req.body.data[index].CommandData.UserName,res,value,liguocommand);
            }
            break;
        }
        //修改用户信息
        case "UpdateUser":
        {
            console.log("更新用户信息");
            if(req.body.data[index].CommandType!="set")
            {
                value.error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd;
            }
            else
            {
                liguocommand.IsReturn=true;
                var user,auth;
                user=liguocommand.UserManage.UserManage.InfoSeting(user,req,index);
                auth=liguocommand.UserManage.UserManage.AuthSeting(user,req,index);
                liguocommand.UserManage.UserManage.UpdateUser(auth,user,res,value,liguocommand);
            }
            break;
        }
        case "Devicelist":
        {
            //获取设备列表 完成
            if(req.body.data[index].CommandType=="get")
            {
                console.log("获取设备列表");
                value.status="success";
                if(liguocommand.Devicelist.change)
                {
                    // base=DataBase.database.DeviceList();
                    // func=liguocommand.DeviceManage.Device.GetDevicelist;
                    DataBase.database.DeviceList(value,res,liguocommand);
                }
                else
                {
                    value.data=liguocommand.Devicelist.data;
                    res.send(value);
                }
                liguocommand.IsReturn=true;
            }
            else
            {
                error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd;
            }
            break;
        }
        case "DeviceInfo":
        {
            //获取设备信息
            if(req.body.data[index].CommandType=="get")
            {
                //获取设备信息
                var key="1";
                key=req.body.data[index].CommandData.key;
                if(liguocommand.DeviceInfo[key]&&(!liguocommand.DeviceInfo[key].change))
                {    
                    console.log("无数据更新")
                    value.status="success";
                    value.data=liguocommand.DeviceInfo[key].data;
                    res.send(value);   
                }
                else
                {
                    console.log("设备类型是:"+req.body.data[index].CommandData.ModuleName);
                    console.log("key值是:"+req.body.data[index].CommandData.key);
                    module=req.body.data[index].CommandData.ModuleName;
                    console.log("有更新")
                    DataBase.database.DeviceInfo(module,key,res,liguocommand,value);
               }
               console.log("状态值"+liguocommand.DeviceInfo.change);
               console.log("ID值为:"+liguocommand.DeviceInfo.key);
               liguocommand.IsReturn=true;
                
            }
            else
            {
                error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd;
            }
            break;
        }
        case "DeviceName":
        {
            if(req.body.data[index].CommandType=="set")
            {
                liguocommand.IsReturn=true;
                var name="1";
                var key="1";
                name=req.body.data[index].CommandData.DeviceName;
                key=req.body.data[index].CommandData.key;
                liguocommand.DeviceManage.Device.SetDeviceName(value,res,key,name,liguocommand);
            }
            else
            {
                error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd
            }
            break;
        }
        case "DHCP":
        {
            if(req.body.data[index].CommandType=="set")
            {
                liguocommand.IsReturn=true;
                var DHCP="";
                var key="1";
                DHCP=req.body.data[index].CommandData.DHCP;
                DHCP=DHCP.toLocaleLowerCase();
                key=req.body.data[index].CommandData.key;
                liguocommand.DeviceManage.Device.SetDHCPStatus(value,res,key,DHCP,liguocommand);
            }
            else
            {
                error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd
            }
            break;
        }
        case "network":
        {
            if(req.body.data[index].CommandType=="set")
            {
                liguocommand.IsReturn=true;
                var network={};
                var key="1";
                network=req.body.data[index].CommandData.network;
                key=req.body.data[index].CommandData.key;
                liguocommand.DeviceManage.Device.SetNetwork(value,res,key,network,liguocommand);
            }
            else
            {
                error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd;
            }
            break;
        }
        case "ChannalName":
        {
            if(req.body.data[index].CommandType=="set")
            {
                liguocommand.IsReturn=true;
                var name="";
                var channal="";
                var key="1";
                channal=req.body.data[index].CommandData.channal;
                name=req.body.data[index].CommandData.name;
                key=req.body.data[index].CommandData.key;
                liguocommand.DeviceManage.Device.SetChannalName(value,res,key,channal,name,liguocommand);
            }
            else
            {
                error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd;
            }
            break;
        }
        case "RoutChannal":
        {
            if(req.body.data[index].CommandType=="set")
            {
                //console.log("切换设置");
                liguocommand.IsReturn=true;
                var data="";
                var key="1";
                data=req.body.data[index].CommandData.data;
                key=req.body.data[index].CommandData.key;
                liguocommand.DeviceManage.Device.SetRoutChannal(value,res,key,data,liguocommand);
            }
            else
            {
                error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd;
            }
            break;
        }
        case "MacroName":
        {
            if(req.body.data[index].CommandType=="set")
            {
                liguocommand.IsReturn=true;
                var name="";
                var key="1";
                name=req.body.data[index].CommandData.name;
                key=req.body.data[index].CommandData.key;
                liguocommand.DeviceManage.Device.SetMacroName(value,res,key,name,liguocommand);
            }
            else
            {
                error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd;
            }
            break;
        }
        case "AddMacro":
        {
            if(req.body.data[index].CommandType=="set")
            {
                liguocommand.IsReturn=true;
                var key="1";
                var macro={"name":"","data":[]};
                macro=req.body.data[index].CommandData.macro;
                console.log("The macro is "+JSON.stringify(macro));
                key=req.body.data[index].CommandData.key;
                liguocommand.DeviceManage.Device.AddMacro(value,res,key,macro,liguocommand);
            }
            else
            {
                error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd;
            }
            break;
        }
        case "DeleteMacro":
        {
            if(req.body.data[index].CommandType=="set")
            {
                liguocommand.IsReturn=true;
                var name="";
                var key="1";
                name=req.body.data[index].CommandData.name;
                key=req.body.data[index].CommandData.key;
                console.log("The Key is "+key);
                liguocommand.DeviceManage.Device.DeleteMacro(value,res,key,name,liguocommand);
            }
            else
            {
                error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd;
            }
            break;
        }
        case "UpdateMacro":
        {
            if(req.body.data[index].CommandType=="set")
            {
                liguocommand.IsReturn=true;
                var macro="";
                var key="";
                macro=req.body.data[index].CommandData.macro;
                key=req.body.data[index].CommandData.key;
                liguocommand.DeviceManage.Device.UpdateMacro(value,res,key,macro,liguocommand);
            }
            else
            {
                error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd;
            }
            break;
        }
        case "RunMacro":
        {
            if(req.body.data[index].CommandType=="set")
            {
                liguocommand.IsReturn=true;
                var name="";
                var key="1";
                name=req.body.data[index].CommandData.name;
                key=req.body.data[index].CommandData.key;
                liguocommand.DeviceManage.Device.RunMacro(value,res,key,name,liguocommand);
            }
            else
            {
                error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd;
            }
            break;
        }
        case "RoutEDID":
        {
            if(req.body.data[index].CommandType=="set")
            {
                liguocommand.IsReturn=true;
                var EDID="";
                EDID=req.body.data[index].CommandData.EDID;
                key=req.body.data[index].CommandData.key;
                console.log("设置EDID");
                var edidmode=["IN","OUT","Default","File"];
                var i;
                for(i=0;i<edidmode.length;i++)
                {
                    console.log("获取EDID的类型");
                    if(EDID.mode==edidmode[i])
                    {
                        break;
                    }
                }
                if(i==edidmode.length)
                {
                    error=liguocommand.Error.ErrorStr.Cmd.command.EDIDmodeErr;
                }
                else
                {
                    if(EDID.mode=="File")
                    {
                        if(!EDID.data)
                        {
                            error=liguocommand.Error.ErrorStr.Cmd.command.NeedEDIDData;
                            res.send(value);
                        }
                        else
                        {
                            console.log("是正确的文件形式");
                            liguocommand.DeviceManage.Device.SetRoutEDID(value,res,key,EDID,liguocommand);
                        }
                    }
                    else
                    {
                        console.log("非文件形式");
                        liguocommand.DeviceManage.Device.SetRoutEDID(value,res,key,EDID,liguocommand);
                    }
                }
                
            }
            else
            {
                error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd;
                res.send(value);
            }
            break;
        }
        case "VideoInfo":
        {
            if(req.body.data[index].CommandType=="set")
            {
                liguocommand.IsReturn=true;
                var key="1";
                var PHYID="0";
                var videoInfo={};
                PHYID=req.body.data[index].CommandData.PhyID;
                key=req.body.data[index].CommandData.key;                
                videoInfo=req.body.data[index].CommandData.ChannalInfo[i]                
                liguocommand.DeviceManage.Device.SetVideoInfo(value,res,key,PHYID,videoInfo,liguocommand);
            }
            else
            {
                error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd;
            }
            break;
        }
        case  "AudioInfo":
        {
            if(req.body.data[index].CommandType=="set")
            {
                liguocommand.IsReturn=true;
                var key="1";
                var PHYID="0";
                var audioInfo={};
                PHYID=req.body.data[index].CommandData.PhyID;
                key=req.body.data[index].CommandData.key;
                liguocommand.DeviceManage.Device.SetAudioInfo(value,res,key,PHYID,audioInfo,liguocommand);
            }
            else
            {
                error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd;
            }              
            break;
        }
        case "ChannalInfo":
        {
            console.log("设置通道信息");
            if(req.body.data[index].CommandType=="set")
            {
                liguocommand.IsReturn=true;
                var key="1";
                var PHYID="0";
                var ChannalInfo={};
                PHYID=req.body.data[index].CommandData.PhyID;
                key=req.body.data[index].CommandData.key;                
                ChannalInfo=req.body.data[index].CommandData.ChannalInfo;               
                liguocommand.DeviceManage.Device.SetChannalInfo(value,res,key,PHYID,ChannalInfo,liguocommand);
            }
            else
            {
                error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd;
            }
            break;
        }
        case "FileUpload":
        {
            //liguocommand.IsReturn=true;
            console.log("上传文件");
            var path="./liguo/device/"+req.body.data[index].CommandData.data.module+"/";
            path=path+req.body.data[index].CommandData.data.name;
            
            fs.writeFileSync(path,req.body.data[index].CommandData.data.data,"binary",function(err,doc){
                if(err)
                {
                    console.log("error for write file "+err);
                }
                else
                {
                    value.status="success";
                    console.log("write file success");
                    res.send(value);
                }
            })
            console.log("不知道是什么情况文件上传完成了");
            value.status="success";
            //res.send(value);
            break;
        }
        default:
        {
            console.log("默认信息");
            error=liguocommand.Error.ErrorStr.Cmd.command.nothiscmd;
            break;
        }
    }
    if(!liguocommand.IsReturn)
    {
        value.error=error;
        res.send(value);
    }
    // call.base=base;
    // call.func=func;
    // return call;
}


function Output(res,value,call)
{
    try{
        console.log(value.error.errortype);
    }
    catch(err)
    {
        console.log("Have find a error is "+err);
    }
    finally
    {
        console.log("Test for error");
    }
    console.log(call.length);
    //console.log("The call is "+JSON.stringify(call));
    var i;
    if(call.length==0)
    {
        value.data=[];
        res.send(value);
    }
    for(i=0;i<call.length;i++)
    {
        if(value.error.errortype!="")
        {
            console.log("not errortype");
            try{
                call[i].base.toArray(function(err,val){
                    if(err)
                    {
                        console.log("The error is "+err);
                        value.error.errortype=123546;
                        value.error.errorstring.en=err;
                    }
                    else
                    {
                       
                        var arr;
                        //console.log("The length is "+call.length);
                        arr=call.shift();
                        //console.log("The func is"+arr.func);
                        arr.func(value,val);
                        //console.log("have over callback");
                        if(call.length==0)
                        {
                            console.log("not error and send message");
                            value.status="success";
                            res.send(value);
                        }
                    }
                })
            }
            catch(err)
            {
                console.log("Have catch a Error and error is "+err);
                res.send(value);
            }
            finally
            {

            }
        }
        else
        {
            console.log("have errortype");
            value.data=[];
            res.send(value);
            return;
        }
        console.log("This is output");
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.cmd=liguocommand;