import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentProfile.css";

const StudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/student/${studentId}`);
        setStudent(response.data);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };
    fetchStudent();
  }, [studentId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/student/${studentId}`);
      alert("Student deleted successfully!");
      navigate("/student-profiles");
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student.");
    }
  };

  const handleEdit = () => {
    navigate(`/student-profiles/${studentId}/edit`);
  };

  if (!student) return <p>Loading student profile...</p>;

  return (
    <div className="student-profile">
      <div className="profile-header">
        <img
          src={student.photo ? `http://localhost:5000${student.photo}` : "/default-avatar.png"}
          alt="Student"
          className="student-photo"
        />
        <h2>{student.firstName} {student.middleName} {student.lastName}</h2>
        <p>Student ID: {student.studentId}</p>
      </div>

      <div className="profile-details">
        <h3>Personal Information</h3>
        <p><strong>Date of Birth:</strong> {new Date(student.dateOfBirth).toLocaleDateString()}</p>
        <p><strong>Gender:</strong> {student.gender}</p>
      </div>

      <div className="profile-details">
        <h3>Academic Information</h3>
        <p><strong>Grade:</strong> {student.grade}</p>
        <p><strong>Section:</strong> {student.section}</p>
        <p><strong>Academic Year:</strong> {student.academicYear}</p>
        <p><strong>Subjects:</strong> {student.subjects.join(", ")}</p>
      </div>

      <div className="profile-details">
        <h3>Guardian Information</h3>
        <p><strong>Guardian Name:</strong> {student.guardianName}</p>
        <p><strong>Relationship:</strong> {student.relationship}</p>
        <p><strong>Contact Number:</strong> {student.contactNumber}</p>
        <p><strong>Email Address:</strong> {student.emailAddress}</p>
      </div>

      <div className="button-group">
        <button onClick={handleEdit} className="edit-btn">Edit</button>
        <button onClick={handleDelete} className="delete-btn">Delete</button>
      </div>
    </div>
  );
};

export default StudentProfile;
