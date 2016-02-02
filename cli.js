var https = require('follow-redirects').https;
var fs = require('fs');
var colors = require('colors');

colors.setTheme({
    error: ['red', 'bold']
});

colors.setTheme({
    info: ['cyan', 'bold']
});

colors.setTheme({
    normal: ['green', 'bold']
})

var argv = require('yargs')
    .usage('Usage: $0 -u [/user.name]')
    .demand(['u'])
    .argv;

var options = {
    hostname: 'www.instagram.com',
    port: 443,
    path: argv.u,
    method: 'GET',
    headers: {
        'accept': 'text/html,application/json,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
        'Host': 'www.instagram.com',
        'Connection': 'Keep-Alive',
        'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6',
    }
};

var req = https.request(options, function(res) {
    if (res.statusCode === 200) {
        console.log("\nStatus Code: ".info, "😀".info /*res.statusCode*/ ); // uncomment *res.statusCode to check it in numeric form
    } else {
        console.log("\nStatus Code: ".error, "😥".info /*res.statusCode*/ ); // same
    }
    var store = "";

    res.setEncoding('utf8');

    res.on('data', function(d) {

        store += d;

    });
    res.on('end', function(d) {
        var rePattern = new RegExp(/id":"\d*/);
        var arrMatches = store.match(rePattern);

        if (arrMatches && arrMatches[0]) {
            console.log('\n' + '--------------------------------'.info);
            console.log('| '.info +
                argv.u.replace('/', '').toUpperCase().toString().info +
                "'s Insta ID is ".info + arrMatches[0].replace('id":"', '').toString().normal +
                ' |'.info);

            console.log('--------------------------------'.info + '\n');

        } else {
            console.log("\nSorry ".error +
                argv.u.replace('/', '').toUpperCase().toString().info +
                " is not an Insta User.".error + '\n');
        }

    });
});
req.end();

req.on('error', function(e) {
    console.error(e);
});