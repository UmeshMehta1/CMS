const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    swaggerDefinition: {
        info: {
            title: "College Management System API",
            version: "1.0.0",
            description: "A basic college management system",
        },
    },

    apis: ['./routes/*.js']
};

const specs = swaggerJsDoc(options);

module.exports = (app) => {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports.specs = swaggerJsDoc(options);