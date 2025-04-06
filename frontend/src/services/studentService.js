import axios from "axios"

const API_URL = "http://localhost:5000/student"

// Get all students
export const getAllStudents = async () => {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    console.error("Error fetching students:", error)
    throw error
  }
}

// Get student by ID
export const getStudentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching student with ID ${id}:`, error)
    throw error
  }
}

// Create new student
export const createStudent = async (studentData) => {
  try {
    const formData = new FormData()

    // Append all student data to FormData
    Object.keys(studentData).forEach((key) => {
      if (key === "studentPhoto" && studentData[key]) {
        formData.append(key, studentData[key])
      } else {
        formData.append(key, studentData[key])
      }
    })

    const response = await axios.post(`${API_URL}/enroll`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    return response.data
  } catch (error) {
    console.error("Error creating student:", error)
    throw error
  }
}

// Update student
export const updateStudent = async (id, studentData) => {
  try {
    const formData = new FormData()

    // Append all student data to FormData
    Object.keys(studentData).forEach((key) => {
      if (key === "studentPhoto" && studentData[key]) {
        formData.append(key, studentData[key])
      } else {
        formData.append(key, studentData[key])
      }
    })

    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    return response.data
  } catch (error) {
    console.error(`Error updating student with ID ${id}:`, error)
    throw error
  }
}

// Delete student
export const deleteStudent = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting student with ID ${id}:`, error)
    throw error
  }
}

export const studentService = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
}

