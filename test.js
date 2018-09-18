var test=require("./liguomongo.js")
function Test() {
    var call=liguotest;
    test.database.init(call);
}
Test();
function liguotest()
{
    //获取设备列表
    //var data=test.database.Devicelist();
    //获取设备信息
    var data
    data.toArray(function(err,doc){
        if(err)
        {
            console.log("有错误 "+err);
        }
        else
        {
            console.log(JSON.stringify(doc));
            var i;
            for(i=0;i<doc.length;i++)
            {
                console.log(JSON.stringify(doc[i].list));
            }
        }
    })
}
