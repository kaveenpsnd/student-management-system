import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./StudentList.css";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [gradeFilter, setGradeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/student");
        setStudents(response.data);
        setFilteredStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    let filtered = students;
    if (gradeFilter) {
      filtered = filtered.filter((student) => student.grade === gradeFilter);
    }
    if (sectionFilter) {
      filtered = filtered.filter((student) => student.section === sectionFilter);
    }
    setFilteredStudents(filtered);
  }, [gradeFilter, sectionFilter, students]);

  return (
    <div className="student-list">
      <h2>Student List</h2>

      {/* Filters */}
      <div className="filters">
        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
        >
          <option value="">All Grades</option>
          <option value="Grade 6">Grade 6</option>
          <option value="Grade 7">Grade 7</option>
          <option value="Grade 8">Grade 8</option>
        </select>

        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
        >
          <option value="">All Sections</option>
          <option value="Section A">Section A</option>
          <option value="Section B">Section B</option>
          <option value="Section C">Section C</option>
        </select>
      </div>

      {/* Student Table */}
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Grade</th>
            <th>Section</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.studentId}>
              <td>{student.studentId}</td>
              <td>{`${student.firstName} ${student.lastName}`}</td>
              <td>{student.grade}</td>
              <td>{student.section}</td>
              <td>
                <Link
                  to={`/student-profiles/${student.studentId}`}
                  className="view-button"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;