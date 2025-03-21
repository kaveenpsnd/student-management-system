const mongoose = require('mongoose');
const Student = require('../Models/StudentModel');
const { addRecentActivity } = require('./RecentActivityController');

// Get All Students
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        return res.status(200).json({ students });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Add Student Enrollment
const addStudent = async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        await addRecentActivity(student.firstName + ' ' + student.lastName, 'was enrolled');
        return res.status(201).json({ message: 'Student enrolled successfully', student });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Invalid data' });
    }
};

// Get Student by ID
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        return student ? res.status(200).json({ student }) : res.status(404).json({ message: 'Student not found' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Update Student
const updateStudentById = async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return updatedStudent ? res.status(200).json({ message: 'Student updated', student: updatedStudent }) : res.status(404).json({ message: 'Student not found' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Delete Student
const deleteStudentById = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        return student ? res.status(200).json({ message: 'Student deleted' }) : res.status(404).json({ message: 'Student not found' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAllStudents, addStudent, getStudentById, updateStudentById, deleteStudentById };
