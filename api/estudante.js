const { sql } = require('@vercel/postgres');
const express = require('express');
const app = express();
const createTable = require('./createTable');
const swaggerSetup = require('./swagger');

app.use(express.json());
swaggerSetup(app);

// Ensure the table is created on start
createTable();

/**
 * GET /api/estudante
 */
app.get('/api/estudante', async (req, res) => {
    try {
        const { rows } = await sql`SELECT * FROM Estudantes`;
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * GET /api/estudante/:id
 */
app.get('/api/estudante/:id', async (req, res) => {
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
 * POST /api/estudante
 */
app.post('/api/estudante', async (req, res) => {
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
 * PUT /api/estudante/:id
 */
app.put('/api/estudante/:id', async (req, res) => {
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
 * DELETE /api/estudante/:id
 */
app.delete('/api/estudante/:id', async (req, res) => {
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

module.exports = app;
