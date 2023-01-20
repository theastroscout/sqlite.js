/*

Table Test

*/

let tableTest = async sql => {
	console.log('\n\n### Table Test ###\n');

	let test_table = sql.table('test_table');
	console.log('Table Object: ',test_table);

	console.log('Insert Data...');
	await test_table.insert({data: 'Some Data', extra: 'Extra Data 1'});
	await test_table.insert([
		{data: 'Some Data', extra: 'Some Extra Data 2'},
		{data: 'Some Data', extra: 'Some Extra Data 3'},
		{data: 'Some Data', extra: 'Some Extra Data 4'}
	]);
	let r = await test_table.find({data: 'Some Data'}, {fields: ['id', 'data', 'extra'], limit: 7});
	console.log('Find Result: ', r)

	console.log('\n\n### End Table Test ###\n');

	return [true, 'Table Test successfully'];
};

export default tableTest;