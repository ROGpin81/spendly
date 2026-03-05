require('dotenv').config();
const express = require('express');
const sequelize = require('./db/connection');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hola desde el backend de Spendly+');
});


const PORT = process.env.APP_PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});