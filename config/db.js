const { Sequelize } = require('sequelize');

const createDB = new Sequelize('test-db', 'user', 'pass', {
    dialect: 'sqlite',
    host: './config/db.sqlite',
});

const connectDB = () => {
    createDB
        .sync()
        .then(() => {
            console.log('Database Connected!!!');
        })
        .catch((err) => {
            console.log('DB Connection Error: ', err);
        });
};

module.exports = { connectDB, createDB };
