import axios from "axios"

const API_URL = "http://localhost:5000/api/leave"

// Apply for leave
export const applyLeave = async (leaveData) => {
  try {
    const response = await axios.post(`${API_URL}`, leaveData)
    return response.data
  } catch (error) {
    console.error("Error applying for leave:", error)
    throw error
  }
}

// Get all leave requests (admin)
export const getAllLeaves = async (filters = {}) => {
  try {
    const response = await axios.get(API_URL, { params: filters })
    return response.data
  } catch (error) {
    console.error("Error fetching leave requests:", error)
    throw error
  }
}

// Get leave requests for a specific staff member
export const getStaffLeaves = async (staffId) => {
  try {
    const response = await axios.get(`${API_URL}/staff/${staffId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching leave requests for staff ${staffId}:`, error)
    throw error
  }
}

// Get leave request by ID
export const getLeaveById = async (leaveId) => {
  try {
    const response = await axios.get(`${API_URL}/${leaveId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching leave request with ID ${leaveId}:`, error)
    throw error
  }
}

// Update leave request
export const updateLeave = async (leaveId, leaveData) => {
  try {
    const response = await axios.put(`${API_URL}/${leaveId}`, leaveData)
    return response.data
  } catch (error) {
    console.error(`Error updating leave request with ID ${leaveId}:`, error)
    throw error
  }
}

// Delete leave request
export const deleteLeave = async (leaveId) => {
  try {
    const response = await axios.delete(`${API_URL}/${leaveId}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting leave request with ID ${leaveId}:`, error)
    throw error
  }
}

// Process leave request (approve/reject)
export const processLeave = async (leaveId, status, adminId, rejectionReason) => {
  try {
    const response = await axios.put(`${API_URL}/${leaveId}/process`, {
      status,
      adminId,
      rejectionReason,
    })
    return response.data
  } catch (error) {
    console.error(`Error processing leave request with ID ${leaveId}:`, error)
    throw error
  }
}

// Get leave statistics for a staff member
export const getStaffLeaveStats = async (staffId, year) => {
  try {
    const response = await axios.get(`${API_URL}/stats/${staffId}`, {
      params: { year },
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching leave statistics for staff ${staffId}:`, error)
    throw error
  }
}

// Generate leave report
export const generateLeaveReport = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/report/generate`, {
      params: filters,
    })
    return response.data
  } catch (error) {
    console.error("Error generating leave report:", error)
    throw error
  }
}

// Predict leave trends
export const predictLeavesTrend = async (staffId) => {
  try {
    const response = await axios.get(`${API_URL}/predict/${staffId}`)
    return response.data
  } catch (error) {
    console.error(`Error predicting leave trends for staff ${staffId}:`, error)
    throw error
  }
}

export const leaveService = {
  applyLeave,
  getAllLeaves,
  getStaffLeaves,
  getLeaveById,
  updateLeave,
  deleteLeave,
  processLeave,
  getStaffLeaveStats,
  generateLeaveReport,
  predictLeavesTrend,
}
