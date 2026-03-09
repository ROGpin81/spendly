require('dotenv').config();
const express = require('express');
const sequelize = require('./db/connection');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hola desde el backend de Spendly+');
});

app.use('/api/auth', authRoutes);

const PORT = process.env.APP_PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});