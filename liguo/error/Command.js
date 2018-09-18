var Generator=require("./error");
var Command={};
//Generator.ErrorGenerator(value,Command);
Command.init=function()
{
    Generator.ErrorGenerator.Generator("Command",Command);
}

/*
Command.notthiscommand={
    "errortype":123465798,
        "errorstring":{
            "cn":"不支持的命令",
            "en":"donnot support this command"
        }
}
*/
exports.command=Command;
