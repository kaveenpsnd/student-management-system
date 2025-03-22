import axios from "axios";

export const inventoryApi = axios.create({
  baseURL: "/inventory", // Using proxy configuration
  timeout: 5000,
  headers: {
    "Content-Type": "application/json"
  }
});