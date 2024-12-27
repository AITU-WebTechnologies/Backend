const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const OrgSchema = new mongoose.Schema({
    organisationId: {
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

OrgSchema.plugin(AutoIncrement, {inc_field: 'organisationId'});

const Organisation = mongoose.model('Organisation', OrgSchema);

module.exports = Organisation;