const tables = require('./tables');

const tableNames = tables.tableNames;
const deptColumns = tables.deptColumns;
const createDeptSql = `CREATE TABLE IF NOT EXISTS ${tableNames.department}(
        ${deptColumns.deptName} TEXT PRIMARY KEY NOT NULL,
        ${deptColumns.building} TEXT NOT NULL,
        ${deptColumns.budget} INTEGER NOT NULL
    );`


/**
 * The department_name is a foreign key on the instructors table
 * which enables us to query for the inst_dept relationship set.
 */
const instructorColumns = tables.instructorColumns;
const createInstructorSql = `CREATE TABLE IF NOT EXISTS ${tableNames.instructor}(
        ${instructorColumns.id} INTEGER PRIMARY KEY NOT NULL,
        ${instructorColumns.name} TEXT NOT NULL,
        ${instructorColumns.salary} INTEGER NOT NULL,
        ${instructorColumns.department_name} TEXT,
        FOREIGN KEY (${instructorColumns.department_name}) REFERENCES ${tableNames.department}(${deptColumns.deptName})
    );`


/**
 * The Instructor ID is a foreign key on the students table which 
 * enables us to query for the 'advisor' relationship set.
 * 
 * The department name is a foreign key on the students table which
 * enables us to query for the student_department relationship set
 */
const studentColumns = tables.studentColumns;
const createStudentsSql = `CREATE TABLE IF NOT EXISTS ${tableNames.student}(
        ${studentColumns.id} INTEGER PRIMARY KEY NOT NULL,
        ${studentColumns.name} TEXT NOT NULL,
        ${studentColumns.total_credits} INTEGER NOT NULL,
        ${studentColumns.instructor_id} INTEGER,
        ${studentColumns.department_name} TEXT,
        FOREIGN KEY(${studentColumns.instructor_id}) REFERENCES ${tableNames.instructor}(${instructorColumns.id}),
        FOREIGN KEY(${studentColumns.department_name}) REFERENCES ${tableNames.department}(${deptColumns.deptName})
    );`


const sectionColumns = tables.sectionColumns;
const createSectionsSql = `CREATE TABLE IF NOT EXISTS ${tableNames.section}(
    ${sectionColumns.id} INTEGER PRIMARY KEY NOT NULL,
    ${sectionColumns.semester} INTEGER NOT NULL CHECK(${sectionColumns.semester} <= 8),
    ${sectionColumns.year} INTEGER NOT NULL CHECK(${sectionColumns.year} <= 4)
)`;

/**
 * The "teaches" table is a relationship set between an instructor and section,
 * and can be used to query which teacher teaches which section.
 */
const teachesColumns = tables.teachesColumns;
const createTeachesSql = `CREATE TABLE IF NOT EXISTS ${tableNames.teaches}(
    ${teachesColumns.instructor_id} INTEGER NOT NULL,
    ${teachesColumns.section_id} INTEGER NOT NULL,
    PRIMARY KEY (${teachesColumns.instructor_id}, ${teachesColumns.section_id}),
    FOREIGN KEY (${teachesColumns.instructor_id}) REFERENCES ${tableNames.instructor}(${instructorColumns.id}),
    FOREIGN KEY (${teachesColumns.section_id}) REFERENCES ${tableNames.section}(${sectionColumns.id})
);`

module.exports = {
    createDepartments: createDeptSql,
    createInstructors: createInstructorSql,
    createStudents: createStudentsSql,
    createSections: createSectionsSql,
    createTeaches: createTeachesSql
};