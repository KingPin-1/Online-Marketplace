require('dotenv').config();
const express = require('express');
const app = express();
const { connectDB, createDB } = require('./config/db');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');

const PORT = 1338;

// middelewares
app.use(express.json());
// app.use(express.static('content'));
app.use(express.urlencoded({ extended: false }));

// Sign Up / Sign In route
app.use('/api/v1/user', userRoutes);

// products middleware
app.use('/api/v1/product', productRoutes);

app.listen(PORT, () => {
    console.log(`App is running on PORT : ${PORT}`);
    connectDB();
});
