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

const sql = new SQLite('PATH TO DB FILE');
```
<br/>

## Methods
<br/>

### Run
```js

await sql.run("CREATE TABLE IF NOT EXISTS test_table (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);");
await sql.run("INSERT OR IGNORE INTO test_table VALUES(NULL, 'Test Record');");

````
<br/>

### Get
Return rows or false if error occured

```js

let rows = await sql.get("SELECT * FROM test_table WHERE id=1");
console.log(rows);

````
<br/>

### All
Return rows or false if error occured

```js

let rows = await sql.all("SELECT * FROM test_table");
console.log(rows);

````
<br/>

### Truncate table
Truncate table and reset Auto Increment

```js

await sql.truncate("test_table");

````
<br/>

### Remove DB file
Remove loaded DB file.

```js

let result = await sql.removeDB();

/*

@Result
	False if DB file does not exist
	True If successful
*/

````
<br/>

### Get SQLite3
Return original SQLite3 object

```js

const sqlite3 = sql.getSQLite3();

````

<br />
<br />

## MIT License

Copyright (c) Alexander Yermolenko • [surfy.one](https://surfy.one)

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