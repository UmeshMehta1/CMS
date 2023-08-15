module.exports.tableNames = {
    department: "department",
    student: "student",
    section: "section",
    instructor: "instructor",
    teaches: "teaches"
};

module.exports.deptColumns = {
    deptName: "deptName",
    building: "building",
    budget: "budget"
};

module.exports.instructorColumns = {
    id: "id",
    name: "name",
    salary: "salary",
    department_name: "department_name"
};

module.exports.studentColumns = {
    id: "id",
    name: "name",
    total_credits: "total_credits",
    instructor_id: "instructor_id",
    department_name: "department_name"
};

module.exports.sectionColumns = {
    id: "id",
    semester: "semester",
    year: "year"
};

module.exports.teachesColumns = {
    instructor_id: "instructor_id",
    section_id: "section_id"
};