const express = require('express');
const router = express.Router();
const Student = require('../Models/StudentModel');
const StudentController = require('../Controllers/StudentController');

router.get('/', StudentController.getAllStudents);
router.post('/', StudentController.addStudent);
router.get('/:id', StudentController.getStudentById);
router.put('/:id', StudentController.updateStudentById);
router.delete('/:id', StudentController.deleteStudentById);

//export
module.exports = router;
