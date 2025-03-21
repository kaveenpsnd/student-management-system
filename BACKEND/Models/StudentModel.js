const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    grade: { type: String, required: true },
    section: { type: String, required: true },
    academicYear: { type: String, required: true },
    subjects: [{ type: String }],
    guardianName: { type: String, required: true },
    relationship: { type: String, required: true },
    contactNumber: { type: String, required: true },
    emailAddress: { type: String, required: true },
    photo: { type: String },
});

module.exports = mongoose.model('Student', StudentSchema);