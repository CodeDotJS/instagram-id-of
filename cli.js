#!/usr/bin/env node

'use strict';

const dns = require('dns');
const got = require('got');
const chalk = require('chalk');
const logUpdate = require('log-update');
const ora = require('ora');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({pkg}).notify();

const arg = process.argv[2];
const end = process.exit;
const spinner = ora();

const profile = `https://instagram.com/${arg}`;

if (!arg || arg === '-h' || arg === '--help') {
	console.log(`
  ${chalk.cyan('Usage')}   :  insta-id-of <username>

  ${chalk.cyan('Example')} :  insta-id-of 9gag

  ${chalk.cyan('Help')}    :  insta-id-of ${chalk.dim('-h or --help')}
	`);
	end(1);
}

dns.lookup('instagram.com', err => {
	if (err) {
		logUpdate(`\n ${chalk.red('›')} ${chalk.dim('Please check your internet connection!')} \n`);
		end(1);
	} else {
		logUpdate();
		spinner.text = chalk.blue('Fetching...');
		spinner.start();
		got(profile).then(res => {
			const userId = res.body.split(',"id":"')[1].split('",')[0];
			const userName = res.body.split(',"full_name":"')[1].split('",')[0] || arg;
			logUpdate(`\n${chalk.cyan('›')} User ID of ${chalk.cyan(userName)} is ${chalk.yellow(userId)} \n`);
			spinner.stop();
		}).catch(err => {
			if (err) {
				logUpdate(`\n${chalk.red('›')} ${chalk.yellow(arg)} is not an instagram user! \n`);
				end(1);
			}
		});
	}
});
