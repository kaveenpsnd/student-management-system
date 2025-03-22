import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentManagement from "./Components/StudentManagement/StudentManagement";
import StudentEnrollment from "./Components/StudentEnrollment/StudentEnroll";
import StudentProfile from "./Components/StudentProfile/StudentProfile";
import StudentList from "./Components/StudentList/StudentList";
import Dashboard from "./pages/InventoryDashboard";
import Nav from "./Components/Nav/Nav";

function App() {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<StudentManagement />} />
        <Route path="/student-enrollment" element={<StudentEnrollment />} />
        <Route path="/student-profiles" element={<StudentList />} />
        <Route path="/student-profiles/:studentId" element={<StudentProfile />} />
      </Routes>
    </div>
  );
}


export default App;
