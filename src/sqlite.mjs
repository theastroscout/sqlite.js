/*

SQLite
Inspired by https://www.npmjs.com/package/sqlite3
(c) Alexander Yermolenko • https://surfy.one

*/

import fs from 'node:fs';
import sqlite3 from 'sqlite3';
import Table from './table.mjs';

class SQLite {

	/*

	SQLite Constructor
	@path String, DB file

	*/

	constructor(path){
		this.path = path;
		this.db = new sqlite3.Database(this.path);
	}

	/*

	Get Original Object

	*/

	getSQLite3(){
		return this.db;
	}

	/*

	Get Row
	@query String

	*/

	get(query){
		return new Promise(resolve => {
			try {
				this.db.get(query, (err, result) => {
					if(err){
						this.error(['SQLite Get Error', err, 'Query: ' + query]);
						resolve(false)
						return false;
					}

					result = this.parse(result);
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
				this.db.all(query, (err, result) => {
					if(err){
						this.error(['SQLite All Error', err, 'Query: ' + query]);

						resolve(false)
						return false;
					}

					result = this.parse(result);
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
				this.db.run(query, (err, result) => {
					if(err){
						this.error(['SQLite Run Error', err, 'Query: '+query]);
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

	Drop table if exists

	*/
	drop(tableName){

		return new Promise(resolve => {
			try {
				this.db.run(`DROP TABLE IF EXISTS '${tableName}';`, (err, result) => {
					if(err){
						this.error([`SQLite Drop '${tableName}' Table Error`, err]);
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
				this.db.run(`Delete from '${tableName}';`, (err, result) => {
					if(err){
						this.error([`SQLite Truncate '${tableName}' Table Error`, err]);
						resolve(false);
					} else {
						this.db.run(`DELETE FROM SQLITE_SEQUENCE WHERE name='${tableName}';`, (err, result) => {
							resolve(true);
						});
						
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
		if(fs.existsSync(this.path)){
			this.db.close();
			fs.unlinkSync(this.path);
			return true;
		}

		return false;
	}

	/*

	Get Table Instance

	*/

	table(tableName){
		return new Table(this, tableName);
	}

	/*

	Prepare

	*/

	prepare(query){
		return this.db.prepare(query);
	}

	/*

	Each

	*/

	each(query, callback){
		this.db.each(query, (err, row) => {
			callback(err, this.parse(row));
		});
	}

	/*

	Error Message

	*/

	error(msg){
		if(Array.isArray(msg)){
			msg = msg.join('\n');
		}
		console.error(`\nERROR: ${msg}\n`);
	}

	/*

	Parse Special

	*/

	parse(result){
		if(!result){
			return result;
		}
		if(!Array.isArray(result)){
			return this.extract(result);
		}
		
		for(let i=0,l=result.length;i<l;i++){
			result[i] = this.extract(result[i]);
		}

		return result;
	}

	extract(row){
		for(let field in row){
			if(/^DATE\((.+)\)$/.test(row[field])){
				row[field] = new Date(row[field].replace(/^DATE\((.+)\)$/, '$1'));
			}
		}
		return row;
	}
};

export default SQLite;