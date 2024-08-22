const express = require('express');
const { sql } = require('@vercel/postgres');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

// DDL script to create the table if it doesn't exist
const createTable = async () => {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS Estudantes (
                estudanteid SERIAL PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                idade INT NOT NULL,
                nota1 NUMERIC(5,2),
                nota2 NUMERIC(5,2),
                nomeprofessor VARCHAR(255),
                numerosala INT
            );
        `;
        console.log('Estudantes table is ready');
    } catch (err) {
        console.error('Error creating table:', err);
    }
};

// Run the createTable function on startup
createTable();

// Swagger setup
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
    apis: ['./app.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   schemas:
 *     Estudante:
 *       type: object
 *       required:
 *         - nome
 *         - idade
 *       properties:
 *         estudanteid:
 *           type: integer
 *           description: The auto-generated id of the estudante
 *         nome:
 *           type: string
 *           description: The name of the estudante
 *         idade:
 *           type: integer
 *           description: The age of the estudante
 *         nota1:
 *           type: number
 *           format: float
 *           description: The first grade of the estudante
 *         nota2:
 *           type: number
 *           format: float
 *           description: The second grade of the estudante
 *         nomeprofessor:
 *           type: string
 *           description: The name of the professor
 *         numerosala:
 *           type: integer
 *           description: The room number
 */

/**
 * @swagger
 * /estudante:
 *   get:
 *     summary: Retrieves a list of estudantes
 *     tags: [Estudante]
 *     responses:
 *       200:
 *         description: List of estudantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Estudante'
 */
app.get('/api/v1/estudante', async (req, res) => {
    try {
        const { rows } = await sql`SELECT * FROM Estudantes`;
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @swagger
 * /estudante/{id}:
 *   get:
 *     summary: Get estudante by ID
 *     tags: [Estudante]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The estudante id
 *     responses:
 *       200:
 *         description: Estudante by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudante'
 *       404:
 *         description: Estudante not found
 */
app.get('/api/v1/estudante/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await sql`SELECT * FROM Estudantes WHERE estudanteid = ${id}`;
        if (rows.length === 0) {
            return res.status(404).send('Estudante not found');
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @swagger
 * /estudante:
 *   post:
 *     summary: Create a new estudante
 *     tags: [Estudante]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Estudante'
 *     responses:
 *       201:
 *         description: Estudante created
 */
app.post('/api/v1/estudante', async (req, res) => {
    const { nome, idade, nota1, nota2, nomeprofessor, numerosala } = req.body;
    try {
        await sql`
            INSERT INTO Estudantes (nome, idade, nota1, nota2, nomeprofessor, numerosala)
            VALUES (${nome}, ${idade}, ${nota1}, ${nota2}, ${nomeprofessor}, ${numerosala})
        `;
        res.status(201).send('Estudante created');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @swagger
 * /estudante/{id}:
 *   put:
 *     summary: Update an estudante by ID
 *     tags: [Estudante]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The estudante id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Estudante'
 *     responses:
 *       200:
 *         description: Estudante updated
 *       404:
 *         description: Estudante not found
 */
app.put('/api/v1/estudante/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, idade, nota1, nota2, nomeprofessor, numerosala } = req.body;
    try {
        const { rowCount } = await sql`
            UPDATE Estudantes
            SET nome = ${nome}, idade = ${idade}, nota1 = ${nota1}, nota2 = ${nota2}, nomeprofessor = ${nomeprofessor}, numerosala = ${numerosala}
            WHERE estudanteid = ${id}
        `;
        if (rowCount === 0) {
            return res.status(404).send('Estudante not found');
        }
        res.send('Estudante updated');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @swagger
 * /estudante/{id}:
 *   delete:
 *     summary: Delete an estudante by ID
 *     tags: [Estudante]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The estudante id
 *     responses:
 *       200:
 *         description: Estudante deleted
 *       404:
 *         description: Estudante not found
 */
app.delete('/api/v1/estudante/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await sql`DELETE FROM Estudantes WHERE estudanteid = ${id}`;
        if (rowCount === 0) {
            return res.status(404).send('Estudante not found');
        }
        res.send('Estudante deleted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));