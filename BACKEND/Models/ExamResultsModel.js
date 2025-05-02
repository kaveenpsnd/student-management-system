const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SubjectSchema = new Schema({
  name: { type: String, required: true },
  marksObtained: { type: Number, required: true },
  maximumMarks: { type: Number, required: true, default: 100 },
  grade: { type: String, required: true },
  status: { type: String, required: true },
})

const ExamResultSchema = new Schema({
  studentId: {
    type: String,
    required: true,
    ref: "Student",
  },
  examName: { type: String, required: true },
  term: { type: String, required: true },
  year: { type: String, required: true },
  subjects: [SubjectSchema],
  totalMarks: { type: Number, required: true },
  maximumTotalMarks: { type: Number, required: true },
  percentage: { type: Number, required: true },
  finalGrade: { type: String, required: true },
  rank: { type: Number },
  teacherRemarks: { type: String },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("ExamResult", ExamResultSchema)

