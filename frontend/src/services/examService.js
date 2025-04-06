import axios from "axios"

const API_URL = "http://localhost:5000/exam-results"

// Get all exam results for a student
export const getStudentExamResults = async (studentId) => {
  try {
    const response = await axios.get(`${API_URL}/${studentId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching exam results for student ${studentId}:`, error)
    throw error
  }
}

// Get specific exam result
export const getExamResultById = async (resultId) => {
  try {
    const response = await axios.get(`${API_URL}/result/${resultId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching exam result with ID ${resultId}:`, error)
    throw error
  }
}

// Create new exam result
export const createExamResult = async (examData) => {
  try {
    const response = await axios.post(API_URL, examData)
    return response.data
  } catch (error) {
    console.error("Error creating exam result:", error)
    throw error
  }
}

// Update exam result
export const updateExamResult = async (resultId, examData) => {
  try {
    const response = await axios.put(`${API_URL}/${resultId}`, examData)
    return response.data
  } catch (error) {
    console.error(`Error updating exam result with ID ${resultId}:`, error)
    throw error
  }
}

// Delete exam result
export const deleteExamResult = async (resultId) => {
  try {
    const response = await axios.delete(`${API_URL}/${resultId}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting exam result with ID ${resultId}:`, error)
    throw error
  }
}

