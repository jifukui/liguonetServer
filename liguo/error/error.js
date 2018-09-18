var DataBase=require("../database/liguodatabase")
var ErrorGenerator={};
ErrorGenerator.Generator=function(value,base)
{
    console.log("The error value is "+value);
    var val=DataBase.database.ErrorGenerator(value);
    val.toArray(function(err,doc){
        if(err)
        {
            console.log("生成错误信息错误 "+err);
        }
        else
        {
            //console.log("生成错误信息的数据为 "+JSON.stringify(doc));
            var i=0;
            for(i=0;i<doc.length;i++)
            {
                var errortype=doc[i].errortype;
                var errorstr={"cn":"","en":""};
                var data=base[""+doc[i].ErrorName+""]={};
                errorstr.cn=doc[i].errorstring.cn;
                errorstr.en=doc[i].errorstring.en;
                data["errortype"]=errortype;
                data["errorstring"]=errorstr;
            }
            console.log("The error class is "+JSON.stringify(base));
        }
    })
}
exports.ErrorGenerator=ErrorGenerator;