/*

CommonJS Test

*/

console.log('\n\n== CommonJS Test ==\n\n')

const SQLite = require('../src/sqlite.js');
const test = async () => {

	const db = await SQLite('test/test');
	
	let result = await db.run("CREATE TABLE IF NOT EXISTS test_table (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT NOT NULL, extra TEXT);");
	console.log('Create DB', result);

	result = await db.removeDB();
	console.log('Remove DB', result);
};
test();