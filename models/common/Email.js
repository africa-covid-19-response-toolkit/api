const mongoose = require('mongoose');
const {Schema} = mongoose;

const EmailSchema = new Schema({
    type: String,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
});

module.exports = EmailSchema;
