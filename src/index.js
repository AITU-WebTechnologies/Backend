const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./database/connection');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDB();

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}.`);
});