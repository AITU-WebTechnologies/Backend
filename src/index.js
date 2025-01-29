const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const orgRouter = require('./routes/org-router');
const checkerRouter = require('./routes/checker-router')
const authRouter = require('./routes/auth-router');
const eventRouter = require('./routes/event-router')
const connectDB = require('./database/connection');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: '37.151.225.71:4000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(express.json());
app.use(cookieParser()); 
app.use(morgan('dev'));

connectDB();

app.use('/api/organisation',orgRouter);
app.use('/api/checker', checkerRouter);
app.use('/api/auth', authRouter);
app.use('/api/event', eventRouter);

if (require.main === module) {
    app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}.`);
    });
}

module.exports = app;