const express = require('express');
const sql = require('mssql');

const app = express();
app.use(express.json()); 

const dbConfig = {
    user: 'JEFE',                 
    password: '23393229',  
    server: '127.0.0.1',         
    database: 'ventas', 
    port: 1433,   
    options: {
        encrypt: false,           
        trustServerCertificate: true 
    }
};

app.get('/clientes', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().execute('sp_obtener_clientes');
        res.json(result.recordset); 
    } catch (err) {
        res.status(500).send("Error al obtener clientes: " + err.message);
    }
});

app.post('/clientes', async (req, res) => {
    try {
        const { nombre, apellido1, apellido2, ciudad, categoria } = req.body;
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('nombre', sql.VarChar(100), nombre)
            .input('apellido1', sql.VarChar(100), apellido1)
            .input('apellido2', sql.VarChar(100), apellido2)
            .input('ciudad', sql.VarChar(100), ciudad)
            .input('categoria', sql.Int, categoria)
            .execute('sp_crear_cliente');
        res.send("¡Cliente creado exitosamente!");
    } catch (err) {
        res.status(500).send("Error al crear cliente: " + err.message);
    }
});

app.put('/clientes/:id', async (req, res) => {
    try {
        const { id } = req.params; 
        const { nombre, apellido1, apellido2, ciudad, categoria } = req.body;
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar(100), nombre)
            .input('apellido1', sql.VarChar(100), apellido1)
            .input('apellido2', sql.VarChar(100), apellido2)
            .input('ciudad', sql.VarChar(100), ciudad)
            .input('categoria', sql.Int, categoria)
            .execute('sp_editar_cliente');
        res.send(`¡Cliente con ID ${id} actualizado!`);
    } catch (err) {
        res.status(500).send("Error al actualizar: " + err.message);
    }
});

const PUERTO = 3000;
app.listen(PUERTO, () => {
    console.log(`Ya casi pasaste majo en http://localhost:${PUERTO}`);
});







