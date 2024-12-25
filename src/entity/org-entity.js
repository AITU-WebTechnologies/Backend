const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const OrgSchema = new mongoose.Schema({
    _id: {
        type: Number,
        unique: true
    },
    title: {
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

OrgSchema.plugin(AutoIncrement, {inc_field: '_id', id: 'orgCounter'});

const Organisation = mongoose.model('Organisation', OrgSchema);

module.exports = Organisation;