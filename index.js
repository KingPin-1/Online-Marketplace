const express = require('express');
const app = express();
const { connectDB, createDB } = require('./config/db');

const PORT = 1338;

app.use(express.json());
app.use(express.static('content'));
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
    console.log(`App is running on PORT : ${PORT}`);
    connectDB();
});
