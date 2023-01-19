import SQLite from '../src/sqlite.mjs';

const sql = new SQLite('test/test');

setTimeout(async () => {
	let result = sql.removeDB();
	console.log('Remove DB',result)
}, 0);
