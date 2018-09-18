var MongoObj={};
MongoObj.DataBase=require('mongodb').MongoClient;

/*连接数据库的到数据库对象 */
MongoObj.init=function(call){
    MongoObj.DataBase.connect("mongodb://47.104.156.124:36911",{useNewUrlParser:true},function(err,db){
        if(err)
        {
            console.log("Have Error for database");
        }
        else
        {
            MongoObj.database=db;
            console.log("connect database success");
            call();
        }
    })
    console.log("This is liguomongo");
}
/*销毁数据库对象 */
MongoObj.destory=function(){
    if(MongoObj.state)
    {
        console.log("数据库存在");
        MongoObj.database.close();   
    }
    else
    {
        console.log("数据库不存在");
    }
}
//数据库对象初始化
//exports.Init=MongoObj.init;
//数据库对象销毁
//exports.Destory=MongoObj.destory;
MongoObj.Devicelist=function()
{
    var data=MongoObj.database.db("test");
    return data.collection("DeviceInfo").aggregate([{$sort:{"BaseInfo.Name":1}},{$group:{_id:"$BaseInfo.ClassType",list:{$push:{"Name":"$BaseInfo.Name","key":"$key"}},}}]);
}
exports.database=MongoObj;