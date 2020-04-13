const mongoose = require('mongoose');

const EmailSchema = {
    type: String,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
};

module.exports = EmailSchema;
