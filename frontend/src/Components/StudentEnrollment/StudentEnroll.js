import React, { useState } from "react";
import axios from "axios";
import "./StudentEnroll.css";

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
    subjects: "",
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

    // Append non-file fields
    data.append("firstName", formData.firstName);
    data.append("middleName", formData.middleName);
    data.append("lastName", formData.lastName);
    data.append("dateOfBirth", formData.dateOfBirth);
    data.append("gender", formData.gender);
    data.append("grade", formData.grade);
    data.append("section", formData.section);
    data.append("academicYear", formData.academicYear);
    data.append("subjects", formData.subjects);
    data.append("guardianName", formData.guardianName);
    data.append("relationship", formData.relationship);
    data.append("contactNumber", formData.contactNumber);
    data.append("emailAddress", formData.emailAddress);

    // Append the file (if exists)
    if (formData.studentPhoto) {
      data.append("studentPhoto", formData.studentPhoto);
    }
    // Send the request
    try {
      await axios.post("http://localhost:5000/student/enroll", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
        subjects: "",
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
      <p className="sub-title">Please fill in all the required information</p>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          {/* Left Side - Student Information */}
          <div className="left-section">
            <h3 className="section-title">Student Information</h3>
            <div className="form-group-row">
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
            </div>

            <div className="form-group-row">
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
            </div>

            {/* Academic Details Section */}
            <h3 className="section-title">Academic Details</h3>
            <div className="form-group-row">
              <div className="form-group">
                <label>Grade</label>
                <select name="grade" value={formData.grade} onChange={handleChange} required>
                  <option value="">Select Grade</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                </select>
              </div>
              <div className="form-group">
                <label>Section</label>
                <select name="section" value={formData.section} onChange={handleChange} required>
                  <option value="">Select Section</option>
                  <option value="Section A">Section A</option>
                  <option value="Section B">Section B</option>
                  <option value="Section C">Section C</option>
                </select>
              </div>
              <div className="form-group">
                <label>Academic Year</label>
                <input type="number" name="academicYear" value={formData.academicYear} onChange={handleChange} required />
              </div>
            </div>

            {/* Subjects Section */}
            <div className="form-group">
              <label>Subjects</label>
              <textarea name="subjects" value={formData.subjects} onChange={handleChange} placeholder="Enter subjects separated by commas"></textarea>
            </div>

            {/* Guardian Information */}
            <h3 className="section-title">Guardian Information</h3>
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
          </div>

          {/* Right Side - Photo Upload */}
          <div className="right-section">
            <h3 className="section-title">Student Photo</h3>
            <div className="photo-upload">
              {formData.studentPhoto ? (
                <img src={URL.createObjectURL(formData.studentPhoto)} alt="Student" />
              ) : (
                <span>📷</span>
              )}
            </div>
            <div className="file-upload">
              <label htmlFor="fileInput">Choose File</label>
              <input type="file" id="fileInput" name="studentPhoto" onChange={handleFileChange} />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button type="button" className="cancel-btn">Cancel</button>
          <button type="submit" className="submit-btn">Save Enrollment</button>
        </div>
      </form>
    </div>
  );
};

export default StudentEnrollment;