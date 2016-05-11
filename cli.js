#!/usr/bin/env node

'use strict';

const https = require('follow-redirects').https;

const colors = require('colors/safe');

const updateNotifier = require('update-notifier');

const pkg = require('./package.json');

updateNotifier({pkg}).notify();

const argv = require('yargs')

    .usage(colors.cyan.bold('\n Usage : $0 -u [user.name]'))

    .demand(['u'])

    .describe('u', '  ❱    instagram username')

    .example('\nUsage : $0 -u tjholowaychuk2')

    .argv;

const options = {
	hostname: 'www.instagram.com',
	port: 443,
	path: argv.u,
	method: 'GET',
	headers: {
		'accept': 'text/html,application/json,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
		'Host': 'www.instagram.com',
		'Connection': 'Keep-Alive',
		'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6'
	}
};

const req = https.request(options, res => {
	if (res.statusCode === 200) {
		console.log('\nStatus Code: '.info, '😀'.info); // res.statusCode
	} else {
		console.log('\nSorry '.error + argv.u.replace('/', '').toUpperCase().toString().info + ' is not an Insta User.\n'.error);
		process.exit(1);
	}
	let store = '';
	res.setEncoding('utf8');
	res.on('data', d => {
		store += d;
	});
	res.on('end', () => {
		const rePattern = new RegExp(/id":"\d*/);
		const arrMatches = store.match(rePattern);
		if (arrMatches && arrMatches[0]) {
			console.log('\n| '.info +
                argv.u.replace('/', '').toUpperCase().toString().info +
                '\'s Insta ID is '.info + arrMatches[0].replace('id":"', '').toString().normal +
                ' |\n'.info);
		} else {
			/* do something */
		}
	});
});
req.end();
