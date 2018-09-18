var Errstr=require("./error");
var Authentication={};
Authentication.init=function(value,base){
    Errstr.ErrorGenerator.Generator("Auth",Authentication)
}
exports.Authentication=Authentication;