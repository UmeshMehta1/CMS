const express = require('express');
const router = express.Router();
const db = require('../db/database').getDatabase();
const tables = require('../db/tables');
const { validateStudent } = require('../db/models');

/**
 * @swagger
 * definitions:
 *  Student:
 *     type: object
 *     properties:
 *      id:
 *          type: integer
 *          example: 1
 *      name:
 *          type: string
 *          example: "John Doe"
 *      total_credits:
 *          type: integer
 *          example: 21
 *      instructor_id:
 *          type: integer
 *          example: 1
 *      department_name:
 *          type: string
 *          example: Computer Science
 *  Error:
 *      type: object
 *      properties:
 *          message:
 *              type: string
 *              example: "An error occurred"
 *  Not Found:
 *      type: object
 *      properties:
 *          message:
 *              type: string
 *              example: "The requested resource could not be found"
 *  Invalid Schema:
 *      type: object
 *      properties:
 *          message:
 *              type: string
 *              example: "Resource is required"
 *  Success:
 *      type: object
 *      properties:
 *          message:
 *              type: string
 *              example: "Operation completed successfully"
 */

/**
 * @swagger
 * /students:
 *  get:
 *      tags:
 *          - students
 *      description: Get all the students in the database
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: An Array of all the students
 *              schema:
 *                  $ref: "#/definitions/Student"
 *          500:
 *              description: Server error
 *              schema:
 *                  $ref: "#/definitions/Error"
 */
router.get("/", (req, res) => {
    const sqlQuery = `SELECT * FROM ${tables.tableNames.student}`;
    db.all(sqlQuery, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occurred"
            });
        }
        // res.send(rows);
        res.render("../FrontEnd/students.ejs", { students: rows });
    });
});

router.get("/create", function (req, res) {
    res.render("../FrontEnd/createStudent.ejs");
});

/**
 * @swagger
 * /students/{id}:
 *  get:
 *      tags:
 *          - students
 *      description: Get a single student by their ID
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: id
 *            description: Student's ID
 *            in: path
 *            required: true
 *            type: integer
 *      responses:
 *          200:
 *              description: The requested Student object
 *              schema:
 *                  $ref: "#/definitions/Student"
 *          404:
 *              description: Student not found
 *              schema:
 *                  $ref: "#/definitions/Not Found"
 *          500:
 *              description: Server error
 *              schema:
 *                  $ref: "#/definitions/Error"
 */
router.get("/:id", (req, res) => {
    const id = req.params.id;
    const sqlQuery = `SELECT * FROM ${tables.tableNames.student} WHERE ${tables.studentColumns.id} = ?`;
    db.get(sqlQuery, [req.params.id], (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occurred"
            });
        }
        if (!rows) {
            return res.status(404).send({
                message: "A student with the requested ID was not found."
            });
        }
        // return res.send(rows);
        res.render("../FrontEnd/studentById.ejs", { student: rows });
    });
});

/**
 * @swagger
 * /students/{id}/advisor:
 *  get:
 *      tags:
 *          - students
 *      description: Get a single student by their ID
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: id
 *            description: Student's ID
 *            in: path
 *            required: true
 *            type: integer
 *      responses:
 *          200:
 *              description: The requested Student object
 *              schema:
 *                  $ref: "#/definitions/Student"
 *          404:
 *              description: Advisor not found
 *              schema:
 *                  $ref: "#/definitions/Not Found"
 *          500:
 *              description: Server error
 *              schema:
 *                  $ref: "#/definitions/Error"
 */
router.get("/:id/advisor", (req, res) => {
    const sqlQuery = `
    SELECT * FROM ${tables.tableNames.instructor}
    WHERE ${tables.instructorColumns.id} =
        (SELECT ${tables.studentColumns.instructor_id}
        FROM ${tables.tableNames.student}
        WHERE ${tables.studentColumns.id} = ?
        )`;

    db.get(sqlQuery, [req.params.id], (err, row) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occurred"
            });
        }
        if (!row) {
            return res.status(404).send({
                message: "Advisor for this student not found."
            });
        }
        // res.send(row);
        res.render("../FrontEnd/studentAdvisor.ejs", { instructor: row });
    });
});

/**
 * @swagger
 * /students:
 *  post:
 *      tags:
 *          - students
 *      description: Create a new student in the database
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: student
 *            description: The student to be added
 *            in: body
 *            required: true
 *            type: object
 *            schema:
 *              $ref: "#/definitions/Student"
 *      responses:
 *          200:
 *              description: Student saved successfully
 *              schema:
 *                  $ref: "#/definitions/Student"
 *          400:
 *              description: Invalid schema of the student object
 *              schema:
 *                  $ref: "#/defintions/Invalid Schema"
 */
router.post("/", (req, res) => {
    const { error } = validateStudent(req.body);
    if (error) {
        return res.status(400).send({
            message: error.details[0].message
        });
    }

    const iname = req.body.name;
    const icreds = req.body.total_credits;
    const idept = req.body.department_name;
    const sqlQuery = `
    INSERT INTO ${tables.tableNames.student}
    (name, total_credits, department_name)
    VALUES ('${iname}', ${icreds}, '${idept}')`;

    db.run(sqlQuery, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occured while trying to save the student details"
            });
        }
        res.redirect("/students");
    });
});

/**
 * @swagger
 * /students/{id}:
 *  delete:
 *      tags:
 *          - students
 *      description: Delete a single student by their ID
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: id
 *            description: Student's ID
 *            in: path
 *            required: true
 *            type: integer
 *      responses:
 *          200:
 *              description: Student deleted successfully
 *              schema:
 *                  $ref: "#/definitions/Success"
 *          500:
 *              description: Server error
 *              schema:
 *                  $ref: "#/definitions/Error"
 */
router.delete("/:id", (req, res) => {
    const sqlQuery = `
    DELETE FROM ${tables.tableNames.student}
    WHERE ${tables.studentColumns.id} == ?`

    db.run(sqlQuery, [req.params.id], (err) => {
        if (err) {
            return res.status(500).send({
                message: "An error occurred while trying to delete this student."
            });
        }
        return res.send({
            message: "Student deleted successfully."
        });
    });
});

router.post("/:id/delete", (req, res) => {
    const sqlQuery = `
    DELETE FROM ${tables.tableNames.student}
    WHERE ${tables.studentColumns.id} == ?`

    db.run(sqlQuery, [req.params.id], (err) => {
        if (err) {
            return res.status(500).send({
                message: "An error occurred while trying to delete this student."
            });
        }
        return res.redirect("/students");
    });
});

module.exports = router;
