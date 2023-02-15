const { DataTypes } = require('sequelize');
const { createDB } = require('../config/db');
const { Users } = require('./userModel');

const Order = createDB.define('order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    productId: DataTypes.INTEGER,
    buyerId: DataTypes.INTEGER,
});

Order.associations = () => {
    Order.belongsTo(Users, { foreignKey: 'buyerId' });
};

module.exports = Order;
