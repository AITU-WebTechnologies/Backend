const express = require('express');
const cors = require('cors');
require('dotenv').config();
const orgRouter = require('./routes/org-router');
const checkerRouter = require('./routes/checker-router')
const authRouter = require('./routes/auth-router');
const connectDB = require('./database/connection');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

connectDB();

app.use('/api/organisation',orgRouter);
app.use('/api/checker',checkerRouter);
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}.`);
});
