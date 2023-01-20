import SQLite from '../src/sqlite.mjs';
import tableTest from './table.mjs';

const sql = new SQLite('test/test');

let go = ['createTable', 'insert', 'table', 'get', 'all', 'drop', 'remove'];

/*

Tests

*/

let tests = {

	/*

	Create Table

	*/

	createTable: async () => {
		let result = await sql.run("CREATE TABLE IF NOT EXISTS test_table (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT NOT NULL, extra TEXT);");
		if(!result){
			return [false, 'Create Table failed'];
		}
		return [true, 'Create Table successfully'];
	},

	/*

	Insert Into table

	*/

	insert: async () => {
		let result = await sql.run("INSERT OR IGNORE INTO test_table VALUES(NULL, 'Some Data', 'EXTRA DATA 1');");
		if(!result){
			return [false, 'Insert failed'];
		}
		return [true, 'Insert successfully'];
	},

	/*

	Get from table

	*/

	get: async () => {
		let result = await sql.get("SELECT * FROM test_table WHERE data='Some Data' LIMIT 1;");
		if(!result){
			return [false, 'Get failed'];
		}
		return [true, 'Get true', result];
	},

	/*

	Get all from table

	*/

	all: async () => {
		let result = await sql.all("SELECT * FROM test_table WHERE data='Some Data' LIMIT 2;");
		console.log('@Get All (Limit 2):', result);
		if(!result){
			return [false, 'Get All failed'];
		}
		return [true, 'Get All true', result];
	},

	/*

	Truncate Table

	*/

	truncate: async () => {
		let result = await sql.truncate('test_table');

		if(!result){
			return [false, 'Truncate table failed'];
		}

		/*

		Check truncated

		*/

		await sql.run("INSERT OR IGNORE INTO test_table VALUES(NULL, 'Some Data', 'Extra Data 1');");
		result = await sql.get("SELECT * FROM test_table WHERE data='Some Data';");
		if(result.id !== 1){
			return [false, 'Truncate table failed while checking'];
		}

		return [true, 'Truncate table successfully'];
	},

	/*

	Table Test

	*/

	table: async () => {
		return await tableTest(sql);
	},

	/*

	Drop table

	*/

	drop: async () => {
		let result = await sql.drop('test_table');
		
		if(!result){
			return [false, 'Drop table failed'];
		}

		// Check Drop
		result = await sql.get("SELECT * FROM test_table WHERE data='Some Data';");
		if(result){
			return [false, 'Drop table failed while checking'];
		}
		return [true, 'Drop successfully'];
	},

	/*

	Remove DB

	*/

	remove: async () => {
		/*

		Remove DB

		*/

		
		let result = sql.removeDB();
		if(!result){
			return [false, 'Remove Table failed'];
		}

		return [true, 'Remove Table successfully'];		
	}
};


let success = true;
for(let fn of go){
	let result = await tests[fn]();
	console.log('-', result[1]);
	if(!result[0]){
		success = false;
		break;
	}
}

if(success){
	console.log('The test is successfully passed.');
} else {
	console.log('The test is failed.');
}