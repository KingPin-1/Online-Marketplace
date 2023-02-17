require('dotenv').config();
const express = require('express');
const app = express();
const { connectDB, createDB } = require('./config/db');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const swaggerUi = require('swagger-ui-express');
const swaggerjsdoc = require('swagger-jsdoc');

const PORT = process.env.PORT;

const specs = swaggerjsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Photo Store API',
            version: '1.0.0',
            description: 'Buy and Sell Photos',
        },
        servers: [
            {
                url: process.env.BASE_URL,
            },
        ],
    },
    apis: ['./routes/*.js'],
});

// middelewares
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
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
