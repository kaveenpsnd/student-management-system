import axios from "axios"

const API_URL = "http://localhost:5000/api/staff"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response:", error.response.data)
      throw new Error(error.response.data.message || "An error occurred")
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request)
      throw new Error("No response received from server")
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request error:", error.message)
      throw new Error("Error setting up request")
    }
  }
)

// Get all staff members
export const getAllStaff = async () => {
  try {
    const response = await api.get("/")
    return response.data.data
  } catch (error) {
    console.error("Error fetching staff:", error)
    throw error
  }
}

// Get staff by ID
export const getStaffById = async (id) => {
  try {
    const response = await api.get(`/${id}`)
    return response.data.data
  } catch (error) {
    console.error(`Error fetching staff with ID ${id}:`, error)
    throw error
  }
}

// Create new staff member
export const createStaff = async (formData) => {
  try {
    const response = await api.post("/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error creating staff:", error)
    throw error
  }
}

// Update staff
export const updateStaff = async (id, formData) => {
  try {
    const response = await api.put(`/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    console.error(`Error updating staff with ID ${id}:`, error)
    throw error
  }
}

// Delete staff
export const deleteStaff = async (id) => {
  try {
    const response = await api.delete(`/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting staff with ID ${id}:`, error)
    throw error
  }
}

// Login staff
export const loginStaff = async (identifier, password) => {
  try {
    const response = await api.post("/login", { identifier, password })
    return response.data
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}

// Change password
export const changePassword = async (staffId, currentPassword, newPassword) => {
  try {
    const response = await api.post(`/change-password/${staffId}`, {
      currentPassword,
      newPassword,
    })
    return response.data
  } catch (error) {
    console.error("Error changing password:", error)
    throw error
  }
}

// Get staff statistics
export const getStaffStats = async () => {
  try {
    const response = await api.get("/")
    return {
      totalStaff: response.data.counts.total || 0,
      academicStaff: response.data.counts.academic || 0,
      nonAcademicStaff: response.data.counts.nonAcademic || 0,
    }
  } catch (error) {
    console.error("Error fetching staff statistics:", error)
    throw error
  }
}

export const staffService = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  loginStaff,
  changePassword,
  getStaffStats,
}
