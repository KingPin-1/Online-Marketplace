const { DataTypes } = require('sequelize');
const { createdDB } = require('../config/db');

const Product = createdDB.define('product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    content: DataTypes.STRING,
});

module.exports = Product;
