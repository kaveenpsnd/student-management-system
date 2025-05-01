import axios from "axios"

const API_URL = "http://localhost:5000/staff-attendance"

// Mark check-in
export const markCheckIn = async (staffId, rfidCode) => {
  try {
    const response = await axios.post(`${API_URL}/check-in`, {
      staffId,
      rfidCode,
    })
    return response.data
  } catch (error) {
    console.error("Error marking check-in:", error)
    throw error
  }
}

// Mark check-out
export const markCheckOut = async (staffId, rfidCode) => {
  try {
    const response = await axios.post(`${API_URL}/check-out`, {
      staffId,
      rfidCode,
    })
    return response.data
  } catch (error) {
    console.error("Error marking check-out:", error)
    throw error
  }
}

// Get attendance for a specific staff member
export const getStaffAttendance = async (staffId, filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/staff/${staffId}`, {
      params: filters,
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching attendance for staff ${staffId}:`, error)
    throw error
  }
}

// Get attendance statistics for a staff member
export const getStaffAttendanceStats = async (staffId, year) => {
  try {
    const response = await axios.get(`${API_URL}/stats/${staffId}`, {
      params: { year },
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching attendance statistics for staff ${staffId}:`, error)
    throw error
  }
}

// Generate attendance report
export const generateAttendanceReport = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/report/generate`, {
      params: filters,
    })
    return response.data
  } catch (error) {
    console.error("Error generating attendance report:", error)
    throw error
  }
}

// Get top attendance performers
export const getTopPerformers = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/top-performers`, {
      params: filters,
    })
    return response.data
  } catch (error) {
    console.error("Error fetching top performers:", error)
    throw error
  }
}

export const staffAttendanceService = {
  markCheckIn,
  markCheckOut,
  getStaffAttendance,
  getStaffAttendanceStats,
  generateAttendanceReport,
  getTopPerformers,
}
