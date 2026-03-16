require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db/connection');

const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const movementRoutes = require('./routes/movement.routes');
const reportRoutes = require('./routes/report.routes');
const statsRoutes = require('./routes/stats.routes');

// Importar asociaciones entre modelos
require('./models/associations');

const app = express();
app.use(cors());

app.use(express.json());

// Prueba de conexión a la base de datos
app.get('/', (req, res) => {
  res.send('Hola desde el backend de Spendly+');
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/movements', movementRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/stats', statsRoutes);

const PORT = process.env.APP_PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});