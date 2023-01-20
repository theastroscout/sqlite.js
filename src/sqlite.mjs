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

					result = this.extract(result);
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

					result = this.extract(result);
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
			callback(err, this.extract(row));
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

	Prepare Field

	*/

	parse(fields, type='values'){
		
		let list = [];

		for(let field in fields){
			let v = fields[field];

			console.log('VALUE:', typeof v, v)

			if(!v){
				v = 'NULL';
			} else if(typeof v === 'string'){
				v = `'${v}'`;
			} else if(v === 'CURRENT_TIME'){
				v = `'DATE(${(new Date()).toJSON()})'`;
			} else if(v instanceof Date){
				v = `'DATE(${(new Date(v)).toJSON()})'`;
			} if(typeof v === 'object'){
				v = `'${JSON.stringify(v)}'`;
			}

			if(type === 'set'){
				list.push(`\`${field}\`=${v}`);
			} else if(type === 'where'){
				if(v === 'NULL'){
					list.push(`\`${field}\` IS NULL`);
				} else {
					list.push(`\`${field}\`=${v}`);
				}
			} else if(type === 'values'){
				list.push(v);
			}
		}

		if(type === 'where'){
			return list.join(' AND ');
		}

		// Values and Set
		return list.join(',');
		
	}

	_parse(fields, type='values'){
		if(!v){
			v = 'NULL';
		} else if(typeof v === 'object'){
			v = `'${JSON.stringify(v)}'`;
		} else if(typeof v === 'string'){
			v = `'${v}'`;
		} else if(v === 'CURRENT_TIME'){
			v = `'DATE(${(new Date()).toJSON()})'`;
		} else if(v instanceof Date){
			v = `'DATE(${(new Date(v)).toJSON()})'`;
		}

		return v;
	}

	/*

	Parse Special

	*/

	extract(result){
		if(!result){
			return result;
		}
		if(!Array.isArray(result)){
			return this.extractField(result);
		}
		
		for(let i=0,l=result.length;i<l;i++){
			result[i] = this.extractField(result[i]);
		}

		return result;
	}

	extractField(row){
		for(let field in row){
			if(/^DATE\((.+)\)$/.test(row[field])){
				row[field] = new Date(row[field].replace(/^DATE\((.+)\)$/, '$1'));
			}
		}
		return row;
	}
};

export default SQLite;