/*

Table Test

*/

let tableTest = async sql => {
	console.log('\n\n### Table Test ###\n');

	let test_table = sql.table('test_table');
	console.log('Table Object: ',test_table);

	let r = await test_table.find({data: 'Some Data'}, {fields: ['id', 'data'], limit: 2});
	console.log('Find Result: ',r)

	console.log('\n\n### End Table Test ###\n');
};

export default tableTest;