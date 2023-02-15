const { DataTypes } = require('sequelize');
const { createDB } = require('../config/db');

const Product = createDB.define('product', {
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
