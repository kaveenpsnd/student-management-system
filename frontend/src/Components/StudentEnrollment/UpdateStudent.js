"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import "../../styles/student-enrollment.css"

const UpdateStudent = () => {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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
  })

  const [photoPreview, setPhotoPreview] = useState(null)
  const [fileName, setFileName] = useState("No file chosen")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const availableSubjects = ["Mathematics", "Science", "English", "History", "IT"]

  // Fetch student data
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:5000/student/${studentId}`)
        const student = response.data

        // Format date to YYYY-MM-DD for input[type="date"]
        const formattedDate = student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split("T")[0] : ""

        // Convert subjects to array if it's a string
        let subjectsArray = student.subjects || []
        if (typeof subjectsArray === "string") {
          try {
            subjectsArray = JSON.parse(subjectsArray)
          } catch (e) {
            subjectsArray = subjectsArray.split(",").map((s) => s.trim())
          }
        }

        setFormData({
          firstName: student.firstName || "",
          middleName: student.middleName || "",
          lastName: student.lastName || "",
          dateOfBirth: formattedDate,
          gender: student.gender || "",
          grade: student.grade || "",
          section: student.section || "",
          academicYear: student.academicYear || "",
          subjects: subjectsArray,
          guardianName: student.guardianName || "",
          relationship: student.relationship || "",
          contactNumber: student.contactNumber || "",
          emailAddress: student.emailAddress || "",
          studentPhoto: null,
        })

        // Set photo preview if available
        if (student.photo && student.photo !== "/default-avatar.png") {
          setPhotoPreview(`http://localhost:5000${student.photo}`)
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching student data:", err)
        setError("Failed to load student data. Please try again.")
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [studentId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubjectToggle = (subject) => {
    const updatedSubjects = [...formData.subjects]

    if (updatedSubjects.includes(subject)) {
      // Remove subject if already selected
      const index = updatedSubjects.indexOf(subject)
      updatedSubjects.splice(index, 1)
    } else {
      // Add subject if not already selected
      updatedSubjects.push(subject)
    }

    setFormData({ ...formData, subjects: updatedSubjects })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, studentPhoto: file })
      setFileName(file.name)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const formDataToSend = new FormData()

      // Append all form data
      Object.keys(formData).forEach((key) => {
        if (key === "studentPhoto" && formData[key]) {
          formDataToSend.append(key, formData[key])
        } else if (key === "subjects") {
          formDataToSend.append(key, JSON.stringify(formData[key]))
        } else {
          formDataToSend.append(key, formData[key])
        }
      })

      await axios.put(`http://localhost:5000/student/${studentId}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      alert("Student information updated successfully!")
      navigate(`/student-profiles/${studentId}`)
    } catch (error) {
      console.error("Error updating student:", error)
      alert("Failed to update student information. Please try again.")
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (loading) {
    return (
      <div className="enrollment-container">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="enrollment-container">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      </div>
    )
  }

  return (
    <div className="enrollment-container">
      <div className="enrollment-header">
        <h1 className="enrollment-title">Update Student Information</h1>
        <p className="enrollment-subtitle">Edit student details and save changes</p>
      </div>

      <form onSubmit={handleSubmit} className="enrollment-form">
        {/* Student Information */}
        <div className="form-section">
          <h2 className="section-title">Student Information</h2>
          <div className="form-grid form-grid-3">
            <div className="form-field">
              <label className="field-label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="field-input"
              />
            </div>
            <div className="form-field">
              <label className="field-label">Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="field-input"
              />
            </div>
            <div className="form-field">
              <label className="field-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="field-input"
              />
            </div>
          </div>

          <div className="form-grid form-grid-2">
            <div className="form-field">
              <label className="field-label">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="field-input"
              />
            </div>
            <div className="form-field">
              <label className="field-label">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required className="field-select">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="form-section">
          <h2 className="section-title">Academic Details</h2>
          <div className="form-grid form-grid-3">
            <div className="form-field">
              <label className="field-label">Grade</label>
              <select name="grade" value={formData.grade} onChange={handleChange} required className="field-select">
                <option value="">Select Grade</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>
            <div className="form-field">
              <label className="field-label">Section</label>
              <select name="section" value={formData.section} onChange={handleChange} required className="field-select">
                <option value="">Select Section</option>
                <option value="Section A">Section A</option>
                <option value="Section B">Section B</option>
                <option value="Section C">Section C</option>
              </select>
            </div>
            <div className="form-field">
              <label className="field-label">Academic Year</label>
              <input
                type="number"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                required
                className="field-input"
              />
            </div>
          </div>

          <div className="form-field">
            <label className="field-label">Subjects</label>
            <div className="multiselect-container" ref={dropdownRef}>
              <div className="multiselect" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {formData.subjects.length > 0 ? (
                  formData.subjects.map((subject) => (
                    <div key={subject} className="selected-item">
                      {subject}
                      <span
                        className="remove-item"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSubjectToggle(subject)
                        }}
                      >
                        ×
                      </span>
                    </div>
                  ))
                ) : (
                  <span style={{ color: "#6b7280", padding: "0.25rem" }}>Select subjects...</span>
                )}
              </div>

              {dropdownOpen && (
                <div className="multiselect-dropdown">
                  {availableSubjects.map((subject) => (
                    <div
                      key={subject}
                      className={`dropdown-item ${formData.subjects.includes(subject) ? "selected" : ""}`}
                      onClick={() => handleSubjectToggle(subject)}
                    >
                      {subject}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-grid form-grid-3">
          {/* Guardian Information */}
          <div className="form-section md-col-span-2">
            <h2 className="section-title">Guardian Information</h2>
            <div className="form-grid form-grid-2">
              <div className="form-field">
                <label className="field-label">Guardian Name</label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  required
                  className="field-input"
                />
              </div>
              <div className="form-field">
                <label className="field-label">Relationship</label>
                <select
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  required
                  className="field-select"
                >
                  <option value="">Select Relationship</option>
                  <option value="Parent">Parent</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-field">
                <label className="field-label">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  className="field-input"
                />
              </div>
              <div className="form-field">
                <label className="field-label">Email Address</label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  required
                  className="field-input"
                />
              </div>
            </div>
          </div>

          {/* Student Photo */}
          <div className="form-section">
            <h2 className="section-title">Student Photo</h2>
            <div className="photo-container">
              <div className="photo-preview">
                {photoPreview ? (
                  <img src={photoPreview || "/placeholder.svg"} alt="Student preview" />
                ) : (
                  <svg
                    className="photo-placeholder"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                )}
              </div>
              <button
                type="button"
                className="photo-button"
                onClick={() => document.getElementById("studentPhoto").click()}
              >
                Choose New Photo
              </button>
              <input
                type="file"
                id="studentPhoto"
                name="studentPhoto"
                onChange={handleFileChange}
                accept="image/*"
                className="photo-input"
              />
              <p className="photo-filename">{fileName}</p>
              <p className="text-xs text-gray-500 mt-1">Leave empty to keep current photo</p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" onClick={() => navigate(`/student-profiles/${studentId}`)} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Update Student
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateStudent

