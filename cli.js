var https = require('follow-redirects').https;
var fs = require('fs');

var options = {
    hostname: 'instagram.com',
    port: 443,
    path: process.argv.slice(2),
    method: 'GET',
    headers: {
        'accept': 'text/html,application/json,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
        'Host': 'instagram.com',
        'Connection': 'Keep-Alive',
        'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6',
    }
};

var req = https.request(options, function(res) {
    console.log("statusCode: ", res.statusCode);
    var store = "";

    res.setEncoding('utf8');

    res.on('data', function(d) {

        store += d;

    });
    res.on('end', function(d) {
        var rePattern = new RegExp(/id":"\d*/);
        var arrMatches = store.match(rePattern);

        if (arrMatches && arrMatches[0]) {
            console.log("User ID: " + arrMatches[0].replace('id":"', ''));
        }

    });
});
req.end();

req.on('error', function(e) {
    console.error(e);
});
