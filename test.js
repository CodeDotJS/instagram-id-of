import childProcess from 'child_process';

import test from 'ava';

test.cb(t => {
	childProcess.execFile('./cli.js', ['iama_rishi'], {
		cwd: __dirname
	}, (err, stdout) => {
		t.ifError(err);
		t.true(stdout === `\u001b[?25l\n\u001b[?25l\u001b[1000D\u001b[K\u001b[1A\u001b[1000D\u001b[K\n› User ID of 10x RISHI is 3162844793 \n\n\u001b[?25h`);
		t.end();
	});
});
