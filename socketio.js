var app=require('express')();
var http=require('http').Server(app);
var io=require('socket.io')(http);
app.get('/',function(req,res){
    res.sendFile(__dirname+'/html/socket.html')
})
io.on('connection',function(socket){
    console.log("a user connected");
    socket.emit
});
io.on('disconnect',function(){
    console.log("Have user lost connect")
})
http.listen(80,function(){
    console.log("listening on *:80")
})
