import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentManagement from "./Components/StudentManagement/StudentManagement";
import StudentEnrollment from "./Components/StudentEnrollment/StudentEnroll";
import StudentProfile from "./Components/StudentProfile/StudentProfile";
import StudentList from "./Components/StudentList/StudentList"; // Import the new component

function App() {
  return (
    <Routes>
      <Route path="/" element={<StudentManagement />} />
      <Route path="/student-enrollment" element={<StudentEnrollment />} />
      <Route path="/student-profiles" element={<StudentList />} /> {/* Add this route */}
      <Route path="/student-profiles/:studentId" element={<StudentProfile />} />
    </Routes>
  );
}

export default App;