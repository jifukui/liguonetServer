var liguojson={}
liguojson.support=["1.0.0"];
liguojson.init=function(index){
    if(index==1)
    {
        var subjson=require("./JSonFormat1.0.0");
    }
    else
    {
        var subjson=require("./JSonFormat1.0.0");
    }
    //console.log("The value of liguojson"+JSON.stringify(subjson.Json.Init()))
    return subjson.Json.Init();
}
exports.Json=liguojson;