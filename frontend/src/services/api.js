import axios from "axios"

const baseURL = "http://localhost:5000"

const api = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
})

export const inventoryApi = {
  getAllItems: () => api.get("/inventory"),
  getItemById: (id) => api.get(`/inventory/${id}`),
  createItem: (data) => api.post("/inventory", data),
  updateItem: (id, data) => api.put(`/inventory/${id}`, data),
  deleteItem: (id) => api.delete(`/inventory/${id}`),
}

export default api

