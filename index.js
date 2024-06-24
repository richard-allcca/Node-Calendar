const path = require('path');
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
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/event', require('./routes/events.routes'));

// Excepción de ruta para evitar el error de cl 434
// Asi el index con el router indica que hacer en la ruta seleccionada
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Escuchar peticiones
app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Servidor escuchando en el puerto 4000');
});
