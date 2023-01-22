/*

Table

*/

class Table {

	/*

	Constructor

	*/

	constructor(db, name){
		this.db = db;
		this.name = name;
	}

	/*

	Count

	*/

	async count(match){
		let query = [];
		if(match && Object.keys(match).length){
			let where = [];
			for(let field in match){
				let value = match[field];
				if(typeof value === 'object'){
					value = `'${JSON.stringify(value)}'`;
				} else if(typeof value === 'string'){
					value = `'${value}'`;
				}
				where.push(`\`${field}\`=${value}`);
			}
			query.push(`WHERE ${where.join(' AND ')}`);
		}

		query.unshift(`SELECT count(1) as count FROM \`${this.name}\``);
		let result = await this.db.get(query.join(' '));
		return result.count;
	}

	/*

	Find

	@match Object, AND condition
	@options Object {
		limit: 1, // Integer
		fields: ['id', ...] // Output Fields, Array
	}

	*/

	async find(match, options){
		let fields = '*';
		let query = [];

		/*

		Create Where

		*/


		if(match && Object.keys(match).length){
			let where = [];
			for(let field in match){
				let value = match[field];
				if(value['$in']){
					where.push(`\`${field}\` IN ('${value['$in'].join('\',\'')}')`);
				} else if(value['$like']){
					where.push(`\`${field}\` LIKE '${value['$like']}')`);
				} else if(value['$or']){
					
					/*

					$or: [
						[field1, value1],
						[field2, value2],
					]

					*/

					let ORs = [];
					for(let v of value['$or']){
						ORs.push(`\`${v[0]}\` = '${v[1]}'`);
					}
					where.push(ORs.join(' OR '));
					
				} else {
					if(typeof value === 'object'){
						value = `'${JSON.stringify(value)}'`;
					} else if(typeof value === 'string'){
						value = `'${value}'`;
					}
					where.push(`\`${field}\`=${value}`);
				}
			}
			query.push(`WHERE ${where.join(' AND ')}`);
		}

		/*

		Create Options

		*/

		if(options){
			
			if(options.skip){
				let limit = options.limit || -1;
				query.push(`LIMIT ${limit} OFFSET ${options.skip}`);
			} else if(options.limit){
				query.push(`LIMIT ${options.limit}`);
			}

			if(options.fields && options.fields.length){
				fields = `\`${options.fields.join('`,`')}\``;
			}
		}

		query.unshift(`SELECT ${fields} FROM \`${this.name}\``);
		query = query.join(' ');

		/*

		Return Result

		*/

		return await this.db.all(query);
	}

	/*

	Find One

	*/

	async findOne(match, options){
		let fields = '*';
		let query = [];

		/*

		Create Where

		*/


		if(match && Object.keys(match).length){
			let where = [];
			for(let field in match){
				let value = match[field];
				if(typeof value === 'object'){
					value = `'${JSON.stringify(value)}'`;
				} else if(typeof value === 'string'){
					value = `'${value}'`;
				}
				where.push(`\`${field}\`=${value}`);
			}
			query.push(`WHERE ${where.join(' AND ')}`);
		}

		/*

		Create Options

		*/

		if(options){
			
			if(options.skip){
				let limit = options.limit || -1;
				query.push(`LIMIT ${limit} OFFSET ${options.skip}`);
			} else if(options.limit){
				query.push(`LIMIT ${options.limit}`);
			}

			if(options.fields && options.fields.length){
				fields = `\`${options.fields.join('`,`')}\``;
			}
		}

		query.unshift(`SELECT ${fields} FROM \`${this.name}\``);
		query = query.join(' ');

		/*

		Return Result

		*/

		return await this.db.get(query);
	}

	/*

	Insert

	*/

	insert(rows){
		return new Promise(resolve => {
			if(!Array.isArray(rows)){
				rows = [rows];
			}

			let fields = [];
			let fieldsQ = [];
			for(let row of rows){
				for(let field in row){
					if(!fields.includes(field)){
						fields.push(field);
						fieldsQ.push('?');
					}
				}
			}

			let values = [];
			for(let row of rows){
				let rowData = [];
				for(let field of fields){
					/*
					let v = row[field] || 'NULL';
					if(v === 'CURRENT_TIME'){
						v = `DATE(${(new Date()).toJSON()})`;
					} else if(v instanceof Date){
						v = `DATE(${(new Date(v)).toJSON()})`;
					}
					*/
					// let v = this.db.parse(row[field], 'values');
					rowData.push(row[field]);
				}
				values.push(this.db.parse(rowData));
			}

			fields = `${fields.join(',')}`;
			let prepareQuery = `INSERT OR IGNORE INTO \`${this.name}\` (${fields}) VALUES(${fieldsQ.join(',')})`;
			
			const stmt = this.db.prepare(prepareQuery);
			let completed = 0;
			let ids = [];
			for(let row of values){
				stmt.run(...row, (err, result) => {
					completed++;
					ids.push(stmt.lastID);
					if(completed === rows.length){
						resolve(ids);
					}
				});
			}
			stmt.finalize();
			
		});
	}

	/*

	Insert One

	*/

	insertOne(rows){
		return new Promise(resolve => {
			if(!Array.isArray(rows)){
				rows = [rows];
			}

			let fields = [];
			let fieldsQ = [];
			for(let row of rows){
				for(let field in row){
					if(!fields.includes(field)){
						fields.push(field);
						fieldsQ.push('?');
					}
				}
			}

			let values = [];
			for(let row of rows){
				let rowData = [];
				for(let field of fields){
					/*
					let v = row[field] || 'NULL';
					if(v === 'CURRENT_TIME'){
						v = `DATE(${(new Date()).toJSON()})`;
					} else if(v instanceof Date){
						v = `DATE(${(new Date(v)).toJSON()})`;
					}
					*/
					// let v = this.db.parse(row[field], 'values');
					rowData.push(row[field]);
				}
				values.push(this.db.parse(rowData));
			}

			fields = `${fields.join(',')}`;
			let prepareQuery = `INSERT OR IGNORE INTO \`${this.name}\` (${fields}) VALUES(${fieldsQ.join(',')})`;
			
			const stmt = this.db.prepare(prepareQuery);
			let completed = 0;
			let ids = [];
			for(let row of values){
				stmt.run(...row, (err, result) => {
					completed++;
					ids.push(stmt.lastID);
					if(completed === rows.length){
						resolve(ids[0]);
					}
				});
			}
			stmt.finalize();
			
		});
	}

	/*

	Each

	*/

	each(match, options, callback){
		let fields = '*';
		let query = [];

		/*

		Create Where

		*/


		if(match && Object.keys(match).length){
			let where = [];
			for(let field in match){
				let value = match[field];
				if(typeof value === 'object'){
					value = `'${JSON.stringify(value)}'`;
				} else if(typeof value === 'string'){
					value = `'${value}'`;
				}
				where.push(`\`${field}\`=${value}`);
			}
			query.push(`WHERE ${where.join(' AND ')}`);
		}

		/*

		Create Options

		*/

		if(options){
			
			if(options.skip){
				let limit = options.limit || -1;
				query.push(`LIMIT ${limit} OFFSET ${options.skip}`);
			} else if(options.limit){
				query.push(`LIMIT ${options.limit}`);
			}

			if(options.fields && options.fields.length){
				fields = `\`${options.fields.join('`,`')}\``;
			}
		}

		query.unshift(`SELECT ${fields} FROM \`${this.name}\``);
		query = query.join(' ');
		

		this.db.each(query, callback);
	}

	/*

	Update

	*/

	async update(match, update){
		let query = [`UPDATE \`${this.name}\``];

		if(update && Object.keys(update).length){
			let set = this.db.parse(update, 'set');
			query.push(`SET ${set}`);
		}

		if(match && Object.keys(match).length){
			let where = this.db.parse(match, 'where');
			query.push(`WHERE ${where}`);
		}

		query = query.join(' ');
		return await this.db.run(query);
	}
};

export default Table;