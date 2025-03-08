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

