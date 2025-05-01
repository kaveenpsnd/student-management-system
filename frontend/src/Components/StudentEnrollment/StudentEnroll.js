"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useToast } from "../../hooks/use-toast"
import "../../styles/student-enrollment.css"

const StudentEnrollment = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    grade: "",
    section: "",
    academicYear: new Date().getFullYear().toString(),
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

  const availableSubjects = ["Mathematics", "Science", "English", "History", "IT", "Geography" , "Physical Education", "Art" , "Music" , "Economics", "Sinhala" , "English Literature", "Business Studies"]

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

      await axios.post("http://localhost:5000/student/enroll", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      toast({
        title: "Success",
        description: "Student enrolled successfully!",
        variant: "success",
      })

      navigate("/student-profiles")
    } catch (error) {
      console.error("Error enrolling student:", error)
      toast({
        title: "Error",
        description: "Failed to enroll student. Please try again.",
        variant: "destructive",
      })
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

  return (
    <div className="enrollment-container">
      <div className="enrollment-header">
        <h1 className="enrollment-title">Student Enrollment Form</h1>
        <p className="enrollment-subtitle">Please fill in all the required information</p>
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
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
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
                <option value="Section D">Section D</option>
                <option value="Section E">Section E</option>
                <option value="Section F">Section F</option>
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
                Choose File
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
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" onClick={() => navigate("/")} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Save Enrollment
          </button>
        </div>
      </form>
    </div>
  )
}

export default StudentEnrollment
