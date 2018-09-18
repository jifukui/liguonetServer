var crypto=require('crypto');
function print(param){
    console.log(param);
}
var md5=crypto.createHash('md5');
md5.update('123456');
print(md5.digest('hex'));