const sqlite3 = require('sqlite3');

let db;

module.exports.createDatabase = () => {
    db = new sqlite3.Database('./cms.db', (err) => {
        if (err) { return console.log("Error connecting to SQLite Database.") };
        console.log("Connected to the SQLite database");
    });
    return db;
}

module.exports.getDatabase = () => db;