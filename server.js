require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});


async function initializeDatabase() {
    try {
        const sql = fs.readFileSync('db/init.sql', 'utf8'); 
        await pool.query(sql); 
        console.log('Database successfully populated');
    } catch (error) {
        console.error('SQL execution error:', error);
    }
}

initializeDatabase();


app.get('/produtos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Produto');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/produto/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM Produto WHERE id = $1', [id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/produto', async (req, res) => {
    const { descricao, preco, estoque } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Produto (descricao, preco, estoque) VALUES ($1, $2, $3) RETURNING *',
            [descricao, preco, estoque]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/produto/:id', async (req, res) => {
    const { id } = req.params;
    const { descricao, preco, estoque } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Produto SET descricao = $1, preco = $2, estoque = $3 WHERE id = $4 RETURNING *',
            [descricao, preco, estoque, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/produto/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM Produto WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

