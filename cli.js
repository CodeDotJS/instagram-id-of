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

	path: '/' + argv.u,

	method: 'GET',

	headers: {
		'accept': 'text/html,application/json,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',

		'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',

		'Host': 'www.instagram.com',

		'Connection': 'Keep-Alive',

		'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6'
	}
};

function checkInternet(cb) {
	require('dns').lookup('instagram.com', err => {
		if (err && err.code === 'ENOTFOUND') {
			cb(false);
		} else {
			cb(true);
		}
	});
}

// checking internet connection
checkInternet(isConnected => {
	if (isConnected) {
		// do nothing
	} else {
		// stop the whole process if the network is unreachable
		console.log(colors.red.bold('\n ❱ Internet Connection   :   ✖\n'));

		process.exit(1);
	}
});

const req = https.request(options, res => {
	if (res.statusCode === 200) {
		console.log(colors.cyan.bold('\n ❱ Instagram User  :  ✔'));
	} else {
		console.log(colors.red.bold('\n ❱ Instagram User  :  ✖\n'));

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
			console.log(colors.cyan.bold('\n ❱ User ID         : '), colors.green.bold(arrMatches[0].replace('id":"', ''), '\n'));
		} else {
			/* do nothing */
		}
	});
});
req.end();
