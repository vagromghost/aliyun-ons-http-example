var calSignature = require('./Utils').calSignature;
var conf = require('./config');
var md5 = require('crypto').createHash('md5');
var http =require('http');


var newline = "\n";

function delMessage(message) {
    var date = new Date().getTime();
    var signString = conf.topic + newline + conf.consumerID + newline + message['msgHandle'] + newline + date;
    var sign = calSignature(signString, conf.secretKey);
    var opt = {  
            method: "DELETE",  
            host: conf.onsUrl,  
            port: conf.onsPort,                
            path: conf.path + "message/?msgHandle="+message['msgHandle'] + "&topic="+conf.topic+"&time="+date,
            headers: {  
                "Signature": sign,  
                "AccessKey": conf.accessKey,
                "ConsumerID": conf.consumerID
            }
        };
    var req = http.request(opt, function (res) {
        if (conf.successStatusCode.indexOf(res.statusCode) != -1) {
            res.on('data', function (data) {
                console.log("delete respone body: " + data);
            }); 
            res.on('end', function () {
            });
        }  
        else {  
            console.log('delete message not success');
        }  
    });

    req.on('error', (e) => {
      console.error(`detele message problem with request: ${e.message}`);
    });

    req.end();
}

function loop(){
    var date = new Date().getTime();

    var signString = conf.topic + newline + conf.consumerID + newline + date;

    var sign = calSignature(signString, conf.secretKey);
    var opt = {  
        method: "GET",  
        host: conf.onsUrl,  
        port: conf.onsPort,                
        path: conf.path + "message/?topic="+conf.topic+"&time="+date+"&num=32",  
        headers: {  
            "Signature": sign,  
            "AccessKey": conf.accessKey,
            "ConsumerID": conf.consumerID
        }
    };
    var req = http.request(opt, function (res) {
        if (conf.successStatusCode.indexOf(res.statusCode) != -1) {
            var body = '';
            res.on('data', function (data) {
                body += data;
            });
            res.on('end', function () {
                console.log("respone body: " + body);
                var messages = JSON.parse(body);
                messages.forEach(function(message) {
                    delMessage(message);
                    console.log("respone message:" + JSON.stringify(message));
                });
                setTimeout(loop, 5000);
            });
        } else {
            console.log('Not success, respone statusCode :' + res.statusCode);
            setTimeout(loop, 5000);
        }  
    });

    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });

    req.end();
}
loop();
