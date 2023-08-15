const router = require('express').Router();
const tables = require('../db/tables');
const db = require('../db/database').getDatabase();
const { validateDepartment, validateTeaches } = require('../db/models');

/**
 * @swagger
 * definitions:
 *  Department:
 *      type: object
 *      properties:
 *          deptName:
 *              type: string
 *              description: The name of the department. Must be unique.
 *              example: Computer Science
 *          building:
 *              type: string
 *              description: The building allotted to this department
 *              example: Computer Department
 *          budget:
 *              type: integer
 *              description: The budget approved for this department
 *              example: 100000000
 *  Instructor:
 *      type: object
 *      properties:
 *          name:
 *              type: string
 *              example: "Jane Doe"
 *          department_name:
 *              type: string
 *              example: "Computer Science"
 *          salary:
 *              type: integer
 *              example: 1000
 *          id:
 *              type: integer
 *              example: 1
 *  Teaches:
 *      type: object
 *      properties:
 *          instructor_id:
 *              type: integer
 *              example: 1
 *              description: The instructor's ID that teaches in this department
 *          section_id:
 *              type: integer
 *              example: 1
 *              description: The section taught by the instructor in this department
 */

/**
* @swagger
* /departments:
*  get:
*      tags:
*          - departments
*      description: Get all the departments in the database
*      consumes:
*          - application/json
*      produces:
*          - application/json
*      responses:
*          200:
*              description: An Array of all the departments
*              schema:
*                  $ref: "#/definitions/Department"
*          500:
*              description: Server error
*              schema:
*                  $ref: "#/definitions/Error"
*/
router.get("/", (req, res) => {
    const sqlQuery = `SELECT * FROM ${tables.tableNames.department}`;
    db.all(sqlQuery, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occurred"
            });
        }
        // res.send(rows);
        res.render("../FrontEnd/departments.ejs", { departments: rows });
    });
});

router.get("/:name/instructors/create", (req, res) => {
    const name = req.params.name;
    res.render('../FrontEnd/addInstructorToDept.ejs', { name: name });
});

router.get("/create", (req, res) => {
    res.render('../FrontEnd/createDepartment.ejs');
});

/**
 * @swagger
 * /departments/{name}:
 *  get:
 *      tags:
 *          - departments
 *      description: Get a single departments by its name
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: name
 *            description: Department's name
 *            in: path
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: The requested Department object
 *              schema:
 *                  $ref: "#/definitions/Department"
 *          404:
 *              description: Department not found
 *              schema:
 *                  $ref: "#/definitions/Not Found"
 *          500:
 *              description: Server error
 *              schema:
 *                  $ref: "#/definitions/Error"
 */
router.get("/:name", (req, res) => {
    // Adding COLLATE NOCASE makes the queries case insensitive.
    const sqlQuery = `SELECT * FROM ${tables.tableNames.department} WHERE ${tables.deptColumns.deptName} = ? COLLATE NOCASE`;
    db.get(sqlQuery, [req.params.name], (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occurred"
            });
        }
        if (!rows) {
            return res.status(404).send({
                message: "A department with the requested name was not found."
            });
        }
        // res.send(rows);
        res.render("../FrontEnd/departmentByName.ejs", { department: rows });
    });
});

/**
 * @swagger
 * /departments/{name}/instructors:
 *  get:
 *      tags:
 *          - departments
 *      description: Get all instructors in this department
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: name
 *            description: Department's name
 *            in: path
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: An array of all instructors in this department
 *              schema:
 *                  $ref: "#/definitions/Instructor"
 *          404:
 *              description: Instructors for the requested department could not be found
 *              schema:
 *                  $ref: "#/definitions/Not Found"
 *          500:
 *              description: Server error
 *              schema:
 *                  $ref: "#/definitions/Error"
 */
router.get("/:name/instructors", (req, res) => {
    // Adding COLLATE NOCASE makes the queries case insensitive.
    const sqlQuery = `
    SELECT * FROM ${tables.tableNames.instructor}
    WHERE ${tables.instructorColumns.department_name} = ? COLLATE NOCASE`

    db.all(sqlQuery, [req.params.name], (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occurred"
            });
        }
        if (!rows) {
            return res.status(404).send({
                message: "Instructors for the requested department name could not be found."
            });
        }
        // res.send(rows);
        res.render("../FrontEnd/deptInstructors.ejs", { instructors: rows });
    });
});

/**
 * @swagger
 * /departments/{name}/students:
 *  get:
 *      tags:
 *          - departments
 *      description: Get all students in the requested department
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: name
 *            description: Department's name
 *            in: path
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: An array of all students in this department
 *              schema:
 *                  $ref: "#/definitions/Student"
 *          404:
 *              description: Students for the requested department could not be found.
 *              schema:
 *                  $ref: "#/definitions/Not Found"
 *          500:
 *              description: Server error
 *              schema:
 *                  $ref: "#/definitions/Error"
 */
router.get("/:name/students", (req, res) => {
    // Adding COLLATE NOCASE makes the queries case insensitive.
    const sqlQuery = `
    SELECT * FROM ${tables.tableNames.student}
    WHERE ${tables.studentColumns.department_name} = ? COLLATE NOCASE`

    db.get(sqlQuery, [req.params.name], (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occurred"
            });
        }
        if (!rows) {
            return res.status(404).send({
                message: "Students for the requested department name could not be found."
            });
        }
        // res.send(rows);
        res.render("../FrontEnd/deptStudents.ejs", { student: rows });
    });
});

/**
 * @swagger
 * /departments:
 *  post:
 *      tags:
 *          - departments
 *      description: Create a new department in the database
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: department
 *            description: The department to be added
 *            in: body
 *            required: true
 *            type: object
 *            schema:
 *              $ref: "#/definitions/Department"
 *      responses:
 *          200:
 *              description: Department saved successfully
 *              schema:
 *                  $ref: "#/definitions/Success"
 *          400:
 *              description: Invalid schema of the department object
 *              schema:
 *                  $ref: "#/defintions/Invalid Schema"
 */
router.post("/", (req, res) => {
    console.log("Request to post department received.")
    const { error } = validateDepartment(req.body);
    if (error) {
        return res.status(400).send({
            message: error.details[0].message
        });
    }

    const deptName = req.body.deptName;
    const building = req.body.building;
    const budget = req.body.budget;
    const sqlQuery = `
    INSERT INTO ${tables.tableNames.department}
    (deptName, building, budget)
    VALUES ('${deptName}', '${building}', ${budget})`

    db.run(sqlQuery, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occured while trying to save the department details"
            });
        }
        res.redirect("/departments");
    });
});

router.post("/:name/delete", (req, res) => {
    const sqlQuery = `
    DELETE FROM ${tables.tableNames.department}
    WHERE ${tables.deptColumns.deptName} = ?
    COLLATE NOCASE`

    db.run(sqlQuery, [req.params.name], (err) => {
        if (err) {
            return res.status(500).send({
                message: "An error occurred while trying to delete this department"
            });
        }
        res.redirect("/departments");
    })
})

/**
 * @swagger
 * /departments/{name}/instructors:
 *  post:
 *      tags:
 *          - departments
 *      description: Create a new teaches relation in the database
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: name
 *            description: The name of the department to which the relation is to be added
 *            in: path
 *            required: true
 *            type: string
 *
 *          - name: teaches
 *            description: The teaches relation to saved to the database
 *            in: body
 *            required: true
 *            type: object
 *            schema:
 *              $ref: "#/definitions/Teaches"
 *      responses:
 *          200:
 *              description: Relation saved successfully
 *              schema:
 *                  $ref: "#/definitions/Success"
 *          400:
 *              description: Invalid schema of the teaches object
 *              schema:
 *                  $ref: "#/defintions/Invalid Schema"
 */
router.post("/:name/instructors", (req, res) => {
    const { error } = validateTeaches(req.body);
    if (error) {
        return res.status(400).send({
            message: error.details[0].message
        });
    }

    const insId = req.body.instructor_id;
    const secId = req.body.section_id;
    const sqlQuery = `
    INSERT INTO ${tables.tableNames.teaches}
    (${tables.teachesColumns.instructor_id}, ${tables.teachesColumns.section_id})
    VALUES (${insId}, ${secId})`;

    db.run(sqlQuery, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occured while trying to save the instructor relation"
            });
        }
        res.redirect(`/departments/${req.params.name}/instructors`);
    });
});

/**
 * @swagger
 * /departments/{name}:
 *  delete:
 *      tags:
 *          - departments
 *      description: Delete a single departments by its name
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: name
 *            description: Department's name
 *            in: path
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: Department deleted successfully
 *              schema:
 *                  $ref: "#/definitions/Success"
 *          500:
 *              description: Server error
 *              schema:
 *                  $ref: "#/definitions/Error"
 */
router.delete("/:name", (req, res) => {
    const sqlQuery = `
    DELETE FROM ${tables.tableNames.department}
    WHERE ${tables.deptColumns.deptName} = ?
    COLLATE NOCASE`

    db.run(sqlQuery, [req.params.name], (err) => {
        if (err) {
            return res.status(500).send({
                message: "An error occurred while trying to delete this department"
            });
        }
        res.send({
            message: "Department deleted successfully"
        });
    });
})

module.exports = router;
