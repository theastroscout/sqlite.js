async function SQLite(path){
	let SQLiteModule = await import('./sqlite.mjs');
	return new SQLiteModule.default(path);
}

module.exports = SQLite;