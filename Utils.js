var crypto = require('crypto');
var url = require('url');

exports.calSignature = function(signString, sk) {
        var sign=crypto.createHmac('sha1', sk).update(signString).digest().toString('base64');
        return sign;
    };
