var User={};
var DataBase=require("../database/liguodatabase");
//初始化用户的初始状态为无活动用户
User.Init=function()
{
    var data=[];
    return data;
}
//添加活动用户，并更新状态
User.AddActiveUser=function(user,pwd,res,value,userlist)
{
    var call=User.GetActiveUserlist;
    DataBase.database.AddActiveUser(user,pwd,res,value,call,userlist);

}
//删除活动用户，，并更新状态
User.DeleteActiveUser=function(user,res,value,userlist)
{
    var call=User.GetActiveUserlist;
    DataBase.database.DeleteActiveUser(user,res,value,call,userlist);
}
//获取活动用户列表
User.GetActiveUserlist=function(userlist)
{
    //console.log("获取当前处于活动状态的用户列表");
    DataBase.database.GetActiveUser(userlist);
    /*
    data.toArray(function(err,doc){
        if(err)
        {
            console.log("Have error ")
        }
        else
        {
            userlist.User=doc;
            console.log("The Value is "+JSON.stringify(doc));
        }
    })*/
}
//获取注册用户列表
User.GetUserList=function(value,data)
{
    value.data.push(data);
}
//注册用户
User.AddUser=function(auth,user,res,value)
{
    DataBase.database.AddUser(auth,user,res,value);
}
//注销用户
User.DeleteUser=function(auth,user,res,value,userlist)
{
    var call=User.GetActiveUserlist;
    DataBase.database.DeleteUser(auth,user,res,value,call,userlist);
}
//更新用户信息
User.UpdateUser=function(auth,user,res,value,userlist)
{
    var call=User.GetActiveUserlist;
    DataBase.database.UpdateUser(auth,user,res,value,call,userlist);
}
User.InfoSeting=function(user,req,index)
{
    var user={"UserName":"","password":"","priority":"","Session_id":""};
    user.UserName=req.body.data[index].CommandData.UserInfo.UserName;
    user.password=req.body.data[index].CommandData.UserInfo.password;
    user.priority=req.body.data[index].CommandData.UserInfo.priority;
    return user;
}
User.AuthSeting=function(user,req,index)
{
    var user={"UserName":"","password":""};
    user.UserName=req.body.data[index].CommandData.Auth.UserName;
    user.password=req.body.data[index].CommandData.Auth.password;
    return user;
}
exports.UserManage=User;