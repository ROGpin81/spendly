const { DataTypes } = require('sequelize');
const sequelize = require('../db/conexion');

const Categorias = sequelize.define('categorias', {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  name: {
    type: DataTypes.STRING(60),
    allowNull: false
  },

  owner_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  }

}, {
  tableName: 'categorias',
  timestamps: false
});

module.exports = Categorias;