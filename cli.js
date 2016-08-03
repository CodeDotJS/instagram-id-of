#!/usr/bin/env node

'use strict';

const dns = require('dns');
const https = require('follow-redirects').https;
const logUpdate = require('log-update');
const colors = require('colors/safe');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({pkg}).notify();
const arg = process.argv[2];

if (!arg || arg === '-h' || arg === '--help') {
	console.log(`
 ${colors.cyan('Usage   :')} insta-id-of ${colors.blue('<username>\n')}
 ${colors.cyan('Example :')} insta-id-of ${colors.yellow('iama_rishi\n')}
 ${colors.cyan('Help    :')} insta-id-of ${colors.green('-h')} ${colors.dim('--help')}
 `);
	process.exit(1);
}

const userArgs = arg;
const pathReq = `/${userArgs}`;

const options = {
	hostname: 'www.instagram.com',
	port: 443,
	path: pathReq,
	method: 'GET',
	headers: {
		'accept': 'text/html,application/json,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
		'Host': 'www.instagram.com',
		'Connection': 'Keep-Alive',
		'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6'
	}
};

dns.lookup('instagram.com', err => {
	if (err && err.code === 'ENOTFOUND') {
		logUpdate(`\n${colors.red.bold('›')} Please check your internet connection`);
		process.exit(1);
	} else {
		logUpdate(`\n${colors.cyan.bold('›')} ${colors.dim('Fetching User ID. Please wait!')}`);
	}
});

const req = https.request(options, res => {
	if (res.statusCode === 200) {
		logUpdate(`${colors.cyan.bold('\n›')} ${colors.yellow(arg)} ${colors.dim(`is an Instagram user!`)}\n`);
	} else {
		logUpdate(`${colors.cyan.bold('\n›')} ${colors.dim(`Sorry "${arg}" is not an Instagram user!`)}\n`);
		process.exit(1);
	}
	let store = '';
	res.setEncoding('utf8');

	res.on('data', d => {
		store += d;
	});

	res.on('end', () => {
		const rePattern = new RegExp(/id": "\d*/);
		const arrMatches = store.match(rePattern);

		if (arrMatches && arrMatches[0]) {
			logUpdate(`\n${colors.cyan.bold('›')} ${colors.dim('Instagram ID of')} ${arg} ${colors.dim('is')} ${arrMatches[0].replace('id": "', '')}\n`);
		} else {
			// nothing
		}
	});
});
req.end();
