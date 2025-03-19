const express = require('express');
const router = express.Router();
//Insert Model
const Student = require('../Models/StudentModel');
//Insert Controller
const StudentController = require('../Controllers/StudentController');

router.get('/', StudentController.getAllStudents);
router.post('/', StudentController.addStudent);
router.get('/:id', StudentController.getStudentById);
router.put('/:id', StudentController.updateStudentById);

//export
module.exports = router;
