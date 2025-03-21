import React, { useState } from "react";
import axios from "axios";
import "./StudentEnrollment.css";

const StudentEnrollment = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    grade: "",
    section: "",
    academicYear: "",
    subjects: [],
    guardianName: "",
    relationship: "",
    contactNumber: "",
    emailAddress: "",
    studentPhoto: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, studentPhoto: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      await axios.post("http://localhost:5000/enroll", data);
      alert("Student enrolled successfully!");
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        grade: "",
        section: "",
        academicYear: "",
        subjects: [],
        guardianName: "",
        relationship: "",
        contactNumber: "",
        emailAddress: "",
        studentPhoto: null,
      });
    } catch (error) {
      console.error("Error enrolling student:", error);
      alert("Failed to enroll student.");
    }
  };

  return (
    <div className="enrollment-container">
      <h2>Student Enrollment Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Middle Name</label>
          <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Grade</label>
          <input type="text" name="grade" value={formData.grade} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Section</label>
          <input type="text" name="section" value={formData.section} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Academic Year</label>
          <input type="text" name="academicYear" value={formData.academicYear} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Guardian Name</label>
          <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Relationship</label>
          <input type="text" name="relationship" value={formData.relationship} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Contact Number</label>
          <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="emailAddress" value={formData.emailAddress} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Student Photo</label>
          <input type="file" name="studentPhoto" onChange={handleFileChange} />
        </div>

        <button type="submit">Save Enrollment</button>
      </form>
    </div>
  );
};

export default StudentEnrollment;
