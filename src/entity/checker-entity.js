const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const CheckerSchema = new mongoose.Schema({
    _id: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

CheckerSchema.plugin(AutoIncrement, {inc_field: '_id', id: 'checkerCounter'});

const Checker = mongoose.model('Checker', CheckerSchema)

module.exports = Checker;