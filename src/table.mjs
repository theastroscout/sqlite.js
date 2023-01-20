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

	Find

	@match Object, AND condition
	@options Object {
		limit: 1, // Integer
		fields: ['id', ...] // Output Fields, Array
	}

	*/

	async find(match, options){

		console.log('Find params:\n\tMatch: ',match, '\n\tOptions: ', options);

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
			
			if(options.limit){
				query.push(`LIMIT ${options.limit}`);
			}

			if(options.fields && options.fields.length){
				fields = `\`${options.fields.join('`,`')}\``;
			}
		}

		query.unshift(`SELECT ${fields} FROM \`${this.name}\``);
		query = query.join(' ');
		console.log('Find Query: ', query)

		/*

		Return Result

		*/

		return await this.db.all(query);
	}

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
					rowData.push(row[field] || 'NULL');
				}
				values.push(rowData);
			}

			fields = `${fields.join(',')}`;
			let prepareQuery = `INSERT INTO \`${this.name}\` (${fields}) VALUES(${fieldsQ.join(',')})`;
			
			const stmt = this.db.prepare(prepareQuery);
			
			
			for(let row of values){
				console.log('Insert Row', row)
				stmt.run(...row);
			}
			stmt.finalize();
			resolve(true);
		});
	}
};

export default Table;