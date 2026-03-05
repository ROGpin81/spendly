const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    }
);

sequelize.authenticate()
    .then(() => {
        console.log('Conexión establecida correctamente');
    })
    .catch((error) => {
        console.log('Error de conexión: ', error);
    });

module.exports = sequelize;