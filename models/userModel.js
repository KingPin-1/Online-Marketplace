const { DataTypes } = require('sequelize');
const { createDB } = require('../config/db');
const OrderModel = require('./orderModel');

const Users = createDB.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isSeller: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

// One user has many orders
Users.hasMany(OrderModel, { foreignKey: 'id' });

module.exports = { Users };
