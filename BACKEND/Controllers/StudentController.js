const mongoose = require('mongoose');
const Student = require('../Models/StudentModel');
const { addRecentActivity } = require('./RecentActivityController');
const upload = require('../upload');

const enrollStudent = async (req, res) => {
    try {
        console.log("Received enrollment request:", req.body);
        console.log("Uploaded file:", req.file); 

        // Save the uploaded file path
        const photoPath = req.file ? `/uploads/${req.file.filename}` : "/default-avatar.png";

        // Create a new student with the photo path
        const newStudent = new Student({
            ...req.body,
            photo: photoPath,
        });

        await newStudent.save();

        // Add recent activity
        await addRecentActivity(
            `${req.body.firstName} ${req.body.lastName}`,
            "was enrolled"
        );

        res.status(201).json({ message: "Student enrolled successfully!", studentId: newStudent.studentId });
    } catch (error) {
        console.error("Error enrolling student:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getStudentById = async (req, res) => {
    try {
        const student = await Student.findOne({ studentId: req.params.id });
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const updateStudentById = async (req, res) => {
    try {
        const updatedStudent = await Student.findOneAndUpdate(
            { studentId: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedStudent) return res.status(404).json({ message: "Student not found" });
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const deleteStudentById = async (req, res) => {
    try {
        const deletedStudent = await Student.findOneAndDelete({ studentId: req.params.id });
        if (!deletedStudent) return res.status(404).json({ message: "Student not found" });
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    enrollStudent,
    getAllStudents,
    getStudentById,
    updateStudentById,
    deleteStudentById
};
