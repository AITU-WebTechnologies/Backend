const connectDB = require('../configurations/database');

module.exports = async () => {
    await connectDB();
};