var calSignature = require('./Utils').calSignature;
var conf = require('./config');
var md5 = require('crypto').createHash('md5');
var http =require('http');

var newline = "\n";

var content = JSON.stringify({ name: "测试", age: "10", "high": "1000" });

var date = new Date().getTime();

var signString = conf.topic + newline + conf.producerID + newline + md5.update(content).digest('hex') + newline + date;

var sign = calSignature(signString, conf.secretKey);

var opt = {  
        method: "POST",  
        host: conf.onsUrl,  
        port: conf.onsPort,  
        path: conf.path + "message/?topic="+conf.topic+"&time="+date+"&tag=http&key=http",  
        headers: {  
            "Signature": sign,  
            "AccessKey": conf.accessKey,
            "ProducerID": conf.producerID,
            "Content-type": "text/html;charset=UTF-8",
            "Content-length": Buffer.byteLength(content, 'utf8')
        }  
    };

for(var i = 0; i < 5 ; i++ ) {
    var req = http.request(opt, function (res) {
        if (conf.successStatusCode.indexOf(res.statusCode) != -1) {  
            res.on('data', function (data) { 
                console.log("respone body: " + data);
            }); 
            res.on('end', function () {

            });  
        }  
        else {  
            console.log('Not success'); 
        }  
    });

    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });

    req.write(content);

    req.end();
}
