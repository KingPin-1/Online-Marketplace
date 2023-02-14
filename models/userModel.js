const { DataTypes } = require('sequelize');
const createDB = require('../config/db');

const Users = createDB.define('users', {
    id: {
        type: DataTypes.STRING,
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

module.exports = Users;
