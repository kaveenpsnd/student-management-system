const mongoose = require('mongoose');
const Student = require('../Models/StudentModel');

// Get All Students
const getAllStudents = async (req, res, next) => {
    try {
        const students = await Student.find();

        // Handle no students found
        if (!students) {
            return res.status(404).json({ message: 'No students found' });
        }

        // Send students data
        return res.status(200).json({ students });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Add Students
const addStudent = async (req, res, next) => {
    const { name, age, address } = req.body;

    try {
        const student = new Student({ name, age, address });
        await student.save();
        return res.status(201).json({ message: 'Student added successfully', student });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Invalid data' });
    }
};

// Get Student by ID
const getStudentById = async (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Student ID' });
    }

    try {
        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        return res.status(200).json({ student });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Update Student by ID

const updateStudentById = async (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Student ID' });
    }

    const { name, age, address } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(id, { name, age, address }, { new: true });

    if (!updatedStudent) {
        return res.status(404).json({ message: 'Student not found' });
    }

    return res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });

};

// Delete Student by ID
const deleteStudentById = async (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Student ID' });
    }

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }

    return res.status(200).json({ message: 'Student deleted successfully' });
};


// Export controllers
exports.getAllStudents = getAllStudents;
exports.addStudent = addStudent;
exports.getStudentById = getStudentById;
exports.updateStudentById = updateStudentById;
exports.deleteStudentById = deleteStudentById;
