const Joi = require('joi');

const deptSchema = {
    deptName: Joi.string().min(2).max(50).required(),
    building: Joi.string().min(2).max(50).required(),
    budget: Joi.number().min(0).required()
};

const instructorSchema = {
    name: Joi.string().min(2).max(100).required(),
    salary: Joi.string().min(0).required(),
    department_name: Joi.string().min(2).max(50).required()
};

const studentSchema = {
    name: Joi.string().min(2).max(100).required(),
    total_credits: Joi.number().min(0).required(),
    department_name: Joi.string().max(50).required()
};

const sectionSchema = {
    id: Joi.number().required(),
    semester: Joi.number().min(0).max(8).required(),
    year: Joi.number().min(0).max(4).required()
};

const teachesSchema = {
    instructor_id: Joi.number().min(0).required(),
    section_id: Joi.number().min(0).required()
};

module.exports.validateDepartment = (department) => {
    return Joi.validate(department, deptSchema);
};

module.exports.validateInstructor = (instructor) => {
    return Joi.validate(instructor, instructorSchema);
};

module.exports.validateStudent = (student) => {
    return Joi.validate(student, studentSchema);
};

module.exports.validateSection = (section) => {
    return Joi.validate(section, sectionSchema);
};

module.exports.validateTeaches = (teaches) => {
    return Joi.validate(teaches, teachesSchema);
};
