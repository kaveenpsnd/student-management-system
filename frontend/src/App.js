import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StudentManagement from "./Components/StudentManagement/StudentManagement";
import StudentEnrollment from "./Components/StudentEnrollment/StudentEnrollment"; // Check this import

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<StudentManagement />} />
          <Route path="/student-enrollment" element={<StudentEnrollment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
