const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();
const port = 3000;


const dbConfig = {
    user: 'Impacta',
    password: 'zaq1xsw2***',
    server: 'DESKTOP-DACG012',
    database: 'ImpactaProject',
    port: 1433,
    options: {
        encrypt: false,  
        trustServerCertificate: true,
    }
};
app.use(cors());
app.use(express.json());

// Endpoint para obter a lista de jogos
app.get('/games', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query('SELECT * FROM Jogos');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor acessível externamente na porta ${port}`);
});

// Cadastro de novo usuário
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        await sql.connect(dbConfig);
        await sql.query`INSERT INTO Usuarios (username, password) VALUES (${username}, ${password})`;
        res.status(201).send('Usuário registrado com sucesso!');
    } catch (err) {
        res.status(500).send('Erro ao registrar usuário: ' + err.message);
    }
});


// Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        await sql.connect(dbConfig);
        const result = await sql.query`SELECT * FROM Usuarios WHERE username = ${username} AND password = ${password}`;
        if (result.recordset.length > 0) {
            res.json({ success: true, username });
        } else {
            res.status(401).send('Usuário ou senha inválidos');
        }
    } catch (err) {
        res.status(500).send('Erro ao fazer login: ' + err.message);
    }
});

// Favoritar jogo
app.post('/favoritar', async (req, res) => {
    const { username, jogoId } = req.body;
    try {
        await sql.connect(dbConfig);
        const user = await sql.query`SELECT id FROM Usuarios WHERE username = ${username}`;
        if (user.recordset.length === 0) return res.status(404).send('Usuário não encontrado');

        const userId = user.recordset[0].id;
        await sql.query`INSERT INTO Favoritos (userId, jogoId) VALUES (${userId}, ${jogoId})`;
        res.send('Jogo favoritado com sucesso!');
    } catch (err) {
        res.status(500).send('Erro ao favoritar jogo: ' + err.message);
    }
});

// Listar favoritos do usuário
app.get('/favoritos/:username', async (req, res) => {
    const { username } = req.params;
    try {
        await sql.connect(dbConfig);
        const user = await sql.query`SELECT id FROM Usuarios WHERE username = ${username}`;
        if (user.recordset.length === 0) return res.status(404).send('Usuário não encontrado');

        const userId = user.recordset[0].id;
        const result = await sql.query`
            SELECT J.* FROM Favoritos F
            JOIN Jogos J ON J.id = F.jogoId
            WHERE F.userId = ${userId}
        `;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Erro ao buscar favoritos: ' + err.message);
    }
});

app.post('/desfavoritar', async (req, res) => {
    const { username, jogoId } = req.body;
    try {
        await sql.connect(dbConfig);
        const user = await sql.query`SELECT id FROM Usuarios WHERE username = ${username}`;
        if (user.recordset.length === 0) return res.status(404).send('Usuário não encontrado');

        const userId = user.recordset[0].id;
        await sql.query`DELETE FROM Favoritos WHERE userId = ${userId} AND jogoId = ${jogoId}`;
        res.send('Jogo removido dos favoritos!');
    } catch (err) {
        res.status(500).send('Erro ao remover favorito: ' + err.message);
    }
});
