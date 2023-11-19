const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config();

// Crear el servidor
const app = express();

// DB connect
dbConnection();

// Public
app.use(express.static('public'));

// Lectura y parseo de body
app.use(express.json());

// Cors
app.use(cors());

// Rutas
app.use('/api/auth', require('./routes/auth.route'));

// Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log('Servidor escuchando en el puerto 4000');
});
