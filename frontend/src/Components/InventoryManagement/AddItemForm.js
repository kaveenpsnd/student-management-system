"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Save, X } from "lucide-react"

function AddItemForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required"
    }

    if (!formData.quantity) {
      newErrors.quantity = "Quantity is required"
    } else if (isNaN(formData.quantity) || Number(formData.quantity) < 0) {
      newErrors.quantity = "Quantity must be a positive number"
    }

    if (!formData.price) {
      newErrors.price = "Price is required"
    } else if (isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = "Price must be a positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validate()) {
      onSubmit({
        ...formData,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
        <h2 className="text-xl font-bold text-white">Add New Inventory Item</h2>
        <p className="text-blue-100">Fill in the details to add a new item to inventory</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.name ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.category ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.quantity ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (Rs) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.price ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Link
            to="/inventory"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Add Item
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddItemForm

