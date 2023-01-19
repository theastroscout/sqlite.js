import SQLite from '../src/sqlite.mjs';

const sql = new SQLite('test/test');
let result;

/*

Create Table

*/

result = await sql.run("CREATE TABLE IF NOT EXISTS test_table (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT NOT NULL);");
if(!result){
	throw Error('Run, create table sucks');
}
console.log('Run, create table checked:', result);

/*

Insert Into table

*/

result = await sql.run("INSERT OR IGNORE INTO test_table VALUES(NULL, 'Some Data');");
if(!result){
	throw Error('Get method sucks');
}
console.log('Insert checked:', result);
/*

Get from table

*/

result = await sql.get("SELECT * FROM test_table WHERE data='Some Data';");
if(!result){
	throw Error('Get method sucks');
}
console.log('Get Result:', result);

/*

Truncate Table

*/

result = await sql.truncate("test_table");
if(!result){
	throw Error('Truncate error');
}
console.log('Truncate Result: ', result);

/*

Check truncated

*/

await sql.run("INSERT OR IGNORE INTO test_table VALUES(NULL, 'Some Data');");
result = await sql.get("SELECT * FROM test_table WHERE data='Some Data';");
if(result.id !== 1){
	throw Error('Truncate sucks');
}

/*

Drop table

*/

result = await sql.drop("test_table");
if(!result){
	throw Error('Drop table sucks');
}
result = await sql.get("SELECT * FROM test_table WHERE data='Some Data';");
if(result){
	throw Error('Drop table sucks');
}
console.log('Drop checked');

/*

Remove DB

*/

setTimeout(async () => {
	let result = sql.removeDB();
	console.log('Remove DB',result)
}, 0);
