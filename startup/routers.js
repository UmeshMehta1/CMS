const bodyparser = require('body-parser');
const studentsRouter = require('../routes/students');
const departmentsRouter = require('../routes/departments');
const instructorsRouter = require('../routes/instructors');
const sectionsRouter = require('../routes/sections');
const homeRouter = require('../routes/home');

module.exports = (app) => {
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({ extended: true }));
    app.use("/", homeRouter);
    app.use("/students", studentsRouter);
    app.use("/departments", departmentsRouter);
    app.use("/instructors", instructorsRouter);
    app.use("/sections", sectionsRouter);
}