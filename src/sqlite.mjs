/*

SQLite
Inspired by https://www.npmjs.com/package/sqlite3
(c) Alexander Yermolenko • https://surfy.one

*/

import fs from 'node:fs';
import path from 'node:path';
import sqlite3 from 'sqlite3';

class SQLite {

	/*

	SQLite Constructor
	@path String, DB file

	*/

	constructor(path){
		this.path = path;
		this.obj = new sqlite3.Database(this.path);
		// this.cursorObj = this.obj.cursor();
	}

	/*

	Get Original Object

	*/

	getSQLite3(){
		return this.obj;
	}

	/*

	Get Row
	@query String

	*/

	get(query){
		return new Promise(resolve => {
			try {
				this.obj.get(query, (err, result) => {
					if(err){
						console.error('SQLite Get Error:',err);
						resolve(false)
						return false;
					}
					resolve(result);
				});
			} catch(e){
				resolve(false)
			}
		});
	}

	/*

	Get All Rows
	@query String

	*/

	all(query){
		return new Promise(resolve => {
			try {
				this.obj.get(query, (err, result) => {
					if(err){
						console.error('SQLite All Error:',err);
						resolve(false)
						return false;
					}
					resolve(result);
				});
			} catch(e){
				resolve(false)
			}
		});
	}

	/*

	Run
	@query String

	*/

	run(query){
		return new Promise(resolve => {
			try {
				this.obj.run(query, (err, result) => {
					if(err){
						console.error('SQLite Run Error:',err);
						resolve(false)
						return false;
					}

					resolve(true);
				});
			} catch(e){
				resolve(false)
			}
		});
	}

	/*

	Truncate Table
	@tableName String
	
	*/


	truncate(tableName){
		return new Promise(resolve => {
			try {
				this.obj.run(`Delete from '${tableName}';`, (err, result) => {
					if(err){
						console.log('SQLite Truncate Error', err);
						resolve(false);
					} else {
						this.obj.run(`DELETE FROM SQLITE_SEQUENCE WHERE name='${tableName}';`, (err, result) => {
							resolve(true);
						})
						
					}
				});
				
			} catch(e){
				resolve(false);
			}
		});
	}

	/*

	Remove DB

	*/

	removeDB(){
		// console.log(path.join(__dirname, this.path))
		if(fs.existsSync(this.path)){
			this.obj.close();
			fs.unlinkSync(this.path);
			return true;
		}

		return false;
	}
};

export default SQLite;