const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerSetup = (app) => {
    const swaggerOptions = {
        swaggerDefinition: {
            openapi: '3.0.0',
            info: {
                title: 'Estudantes API',
                version: '1.0.0',
                description: 'CRUD API for managing estudantes',
            },
            servers: [
                {
                    url: 'http://localhost:3000/api/v1',
                },
            ],
        },
        apis: ['./api/estudante.js'],
    };

    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = swaggerSetup;
