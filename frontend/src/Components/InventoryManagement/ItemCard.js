"use client"

import { Link } from "react-router-dom"
import { Eye, Edit, Trash2, Package } from "lucide-react"

function ItemCard({ item, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all animate-fade-in">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">{item.name}</h3>
        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
          {item.category}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-3">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Value</p>
            <p className="font-medium">Rs.{(item.price * item.quantity).toFixed(2)}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Quantity:</span>
            <span className="font-medium">{item.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Price:</span>
            <span className="font-medium">Rs.{item.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between">
        <Link
          to={`/inventory/${item._id}`}
          className="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded hover:bg-indigo-200 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 mr-1" />
          View
        </Link>
        <Link
          to={`/inventory/edit/${item._id}`}
          className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200 transition-colors"
        >
          <Edit className="w-3.5 h-3.5 mr-1" />
          Edit
        </Link>
        <button
          onClick={onDelete}
          className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Delete
        </button>
      </div>
    </div>
  )
}

export default ItemCard

