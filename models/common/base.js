const AddressSchema = require('./address');
const SymptomSchema = require('./symptom');


const baseFields = {
    firstName: { type: String, required: true, max: 100 },
    middleName: { type: String, max: 100 },
    lastName: { type: String, required: true, max: 100 },
    age: { type: Number, required: true },
    sex: { type: String, required: true },
    address: { type: AddressSchema },
    symptom: { type: SymptomSchema },
    phoneNumber: { type: String }
};

module.exports = baseFields
