const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Movimientos = sequelize.define('movimientos', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('INGRESO', 'GASTO'), 
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    movement_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    note: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    location_lat: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true
    },
    location_lng: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true, 
        
    }
}, {
    tableName: 'movimientos', 
    timestamps: false 
});

module.exports = Movimientos;