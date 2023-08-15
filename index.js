const Express = require('express');
const app = Express();
const db = require('./db/database').createDatabase();

require('./startup/db').init(db);
require('./startup/logger')(app);
require('./startup/routers')(app);
require('./startup/swagger')(app);
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

process.on('SIGINT', () => {
    console.log("Close signal received");
    console.log("Shutting down server...");
    server.close(() => {
        console.log("Closing connection to database");
        db.close();
        console.log("Server shutdown");
    });
});