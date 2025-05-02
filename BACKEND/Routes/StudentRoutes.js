const express = require('express');
const router = express.Router();
const StudentController = require('../Controllers/StudentController');
const upload = require('../upload');

router.get('/', StudentController.getAllStudents);
router.post('/enroll', upload.single('studentPhoto'), StudentController.enrollStudent); // Use Multer middleware
router.get('/:id', StudentController.getStudentById);
router.put('/:id', StudentController.updateStudentById);
router.delete('/:id', StudentController.deleteStudentById);

module.exports = router;