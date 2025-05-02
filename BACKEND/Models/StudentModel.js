const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    studentId: { type: String, unique: true },
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
    photo: { type: String, default: "/default-avatar.png" },
});

// Auto-generate Student ID before saving
StudentSchema.pre('save', async function (next) {
    if (!this.studentId) { // Only generate if not already set
        try {
            const lastStudent = await this.constructor.findOne().sort({ studentId: -1 });

            let newStudentId = "STD00001"; // Default first ID

            if (lastStudent && lastStudent.studentId) {
                const lastIdNumber = parseInt(lastStudent.studentId.replace("STD", ""), 10);
                newStudentId = `STD${String(lastIdNumber + 1).padStart(5, '0')}`;
            }

            this.studentId = newStudentId;
            next();
        } catch (error) {
            console.error("Error generating Student ID:", error);
            next(error);
        }
    } else {
        next();
    }
});

module.exports = mongoose.model('Student', StudentSchema);
