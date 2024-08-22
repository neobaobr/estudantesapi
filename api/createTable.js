const { sql } = require('@vercel/postgres');

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

module.exports = createTable;
