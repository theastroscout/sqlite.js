# SQLite
Asynchronous Library for sqlite3

<br/>

## Installation
```
npm install @surfy/sqlite
```

## Usage

```js

// Import library
import SQLite from "@surfy/sqlite";

const db = new SQLite('PATH_TO_DB_FILE');
// DB File will be created automatically if not exists
// e.g. /var/data/my_awesome_db.db

```
<br/>

## Methods

### .run(query)
```js

await db.run("CREATE TABLE IF NOT EXISTS test_table (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, data TEXT);");

await db.run("INSERT OR IGNORE INTO test_table VALUES(NULL, 'Test Record', 'Data content');");

````
<br/>


### .table(table_name)
Returns Table instance for query processing

```js

let table = await db.table('test_table');

````
<br/>

### .find(match, options)
Finds matches in a table

```js

let match = {
	id: 1,
	name: {
		$in: ['Test 1', 'Test 2']
	}
};
// ...WHERE id=1 AND name IN ('Test 1', 'Test 2')

let options = {
	fields: ['id', 'name'],
	limit: 2,
	skip: 3
};

/*

Return only id and name fields
Skip first 3 rows
Limit results to 2

*/

let result = await table.find(match, options);

````
<br/>

### .findOne(match, options)
Finds one row in a table

```js

let match = {
	id: 1
};

let options = {
	fields: ['id', 'name'],
	skip: 3
};

let result = await table.findOne(match, options);

````
<br/>

### Operators
```js

let match = {
	id: 1,
	name: 'Test 1'
};

// ...WHERE id=1 AND name='Test 1'


match = {
	id: 1,
	name: {
		$in: ['Test 1', 'Test 2']
	}
};

// ...WHERE id=1 AND name IN ('Test 1', 'Test 2')


match = {
	id: 1,
	name: {
		$like: 'Test%'
	}
};

// ...WHERE id=1 AND name LIKE 'Test%'


match = {
	id: 1,
	$or: [
		{
			name: 'Name'
		},
		{
			extra: 'Extra'
		}
	]
};

// ...WHERE id=1 AND ( name='Name' OR extra='Extra' )

```

<br/>
<br/>

### .insert(values)
Inserts data into the table

```js

// Single value
let newRow = {
	name: 'Test name',
	data: {
		extraOption: 'Test Data'
	}
};

let insertedIDs = await table.insert(newRow);
// insertedIDs - Array [(int) Inserted_ID]

// Multiple values
let newRows = [
	{
		name: 'Test name 1',
		data: {
			extraOption: 'Test Data 1'
		}
	},
	{
		name: 'Test name 2',
		data: {
			extraOption: 'Test Data 2'
		}
	},
	{
		name: 'Test name 3',
		data: [1, 2, 3]
	}
];

let IDs = await table.insert(newRows);
// Return IDs - Array [(int) Inserted_ID, (int) Inserted_ID, ...]

````
<br/>

### .insertOne(values)
Inserts a single row into the table

```js

// Single value
let newRow = {
	name: 'Test name'
};

let insertedID = await table.insertOne(newRow);
// insertedID - (int) Inserted_ID

```
<br/>

### .update(match, update)

```js

let match = {
	id: 1
};

let update = {
	data: 'Updated Data',
	extra: new Date()
};

await test_table.update(match, update);


```
<br/>

### .each(match, options, callback)
Runs the SQL query with parameters and calls the callback once for each row

```js

let table = await db.table('test_table');

let match = {
	name: 'Test name'
};

let options = {
	fields: ['id', 'name'],
	limit: 2,
	skip: 3
};

table.each(match, options, (err, row) => {
	console.log('Row', row);
});


```
<br/>

## Date

```js
await db.run("CREATE TABLE IF NOT EXISTS time_table (id INTEGER PRIMARY KEY AUTOINCREMENT, time TEXT);");

let time_table = await db.table('time_table');

let insertedIDs = await time_table.insert([
	{
		id: 1,
		time: 'CURRENT_TIME'
	},
	{
		id: 2,
		time: new Date()
	}
]);

let rows = await time_table.find();

/*

Result
rows = [
	{
		id: 1,
		time: JS Date Object
	},
	{
		id: 2,
		time: JS Date Object
	}
]

*/

```
<br/>
<br/>

## Global method

### .get(query)
Returns rows or false if error occured

```js

let rows = await db.get("SELECT * FROM test_table WHERE id=1");

```
<br/>

### .all(query)
Returns rows or false if error occured

```js

let rows = await db.all("SELECT * FROM test_table");

```
<br/>

### .truncate(table_name)
Truncates table and reset Auto Increment

```js

let result = await db.truncate('test_table');

// @Result True or False

```
<br/>

### .remove(DB_name)
Removes loaded DB file

```js

let result = await db.removeDB();

/*

@Result
	False if DB file does not exist
	True If successful
*/

```
<br/>


### .getSQLite3()
Returns original SQLite3 object

```js

const sqlite3 = db.getSQLite3();

```

<br />
<br />

## MIT License

Alexander Yermolenko • [surfy.one](https://surfy.one)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.