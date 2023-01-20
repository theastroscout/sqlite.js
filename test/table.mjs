/*

Table Test

*/

let tableTest = async sql => {
	console.log('\n\n### Table Test ###\n');

	let test_table = sql.table('test_table');
	console.log('Table Object: ', test_table);

	console.log('Insert Data...');
	
	// Count
	let count = await test_table.count();
	console.log('Table\'s Documents Count is ', count);

	let ids = await test_table.insert({data: 'Some Data', extra: 'Extra Data 2'});
	console.log('Inserted IDs: ', ids)
	ids = await test_table.insert([
		{data: 'Some Data', extra: 'Some Extra Data 3'},
		{data: 'Some Data', extra: 'Some Extra Data 4'},
		{data: 'Some Data', extra: 'Some Extra Data 5'},
		{data: 'Some Data', extra: 'Some Extra Data 6'}
	]);
	console.log('Inserted IDs: ', ids)

	// Count
	count = await test_table.count();
	console.log('Table\'s Documents Count is ', count);

	let r = await test_table.find({data: 'Some Data'}, {fields: ['id', 'data', 'extra'], limit: 10});
	console.log('Find Result: ', r)

	let r2 = await test_table.find({data: 'Some Data'}, {fields: ['id', 'data', 'extra'], limit: 2, skip: 3});
	console.log('Find Result Limit 2, Skipped 3: ', r2)

	test_table.each({data: 'Some Data'}, {fields: ['id', 'data', 'extra'], limit: 10}, (err, row) => {
		console.log('Each > Row:', row)
	});

	console.log('\n\n### End Table Test ###\n');

	return [true, 'Table Test successfully'];
};

export default tableTest;