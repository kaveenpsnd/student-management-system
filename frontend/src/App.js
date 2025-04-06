"use client"

import { Routes, Route } from "react-router-dom"

// Layout components
import Nav from "./Components/Nav/Nav"

// Student Management Pages
import StudentManagement from "./Components/StudentManagement/StudentManagement"
import StudentEnrollment from "./Components/StudentEnrollment/StudentEnroll"
import StudentProfile from "./Components/StudentProfile/StudentProfile"
import StudentList from "./Components/StudentList/StudentList"
import ClassAttendance from "./Components/Attendance/ClassAttendance"
import ExamResults from "./Components/ExamResults/ExamResults"
import AddExamResult from "./Components/ExamResults/AddExamResult"
import EditExamResult from "./Components/ExamResults/EditExamResult"

// Inventory Management Pages
import Dashboard from "./pages/InventoryDashboard"
import InventoryList from "./pages/InventoryList"
import AddItem from "./pages/AddItems"
import EditItem from "./pages/EditItem"
import ItemDetails from "./pages/ItemDetails"

// Add the import for UpdateStudent
import UpdateStudent from "./Components/StudentEnrollment/UpdateStudent"

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Nav />
      <div className="main-content">
        <main className="p-4">
          <Routes>
            {/* Student Management Routes */}
            <Route path="/" element={<StudentManagement />} />
            <Route path="/student-enrollment" element={<StudentEnrollment />} />
            <Route path="/student-profiles" element={<StudentList />} />
            <Route path="/student-profiles/:studentId" element={<StudentProfile />} />
            {/* Add the route for updating student details inside the Routes component */}
            <Route path="/student-profiles/edit/:studentId" element={<UpdateStudent />} />
            <Route path="/attendance" element={<ClassAttendance />} />
            <Route path="/exam-results/:studentId" element={<ExamResults />} />
            <Route path="/exam-results/:studentId/add" element={<AddExamResult />} />
            <Route path="/exam-results/:studentId/edit/:resultId" element={<EditExamResult />} />

            {/* Inventory Management Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<InventoryList />} />
            <Route path="/inventory/add" element={<AddItem />} />
            <Route path="/inventory/edit/:id" element={<EditItem />} />
            <Route path="/inventory/:id" element={<ItemDetails />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App

