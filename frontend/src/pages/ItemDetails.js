"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { inventoryApi } from "../services/api"
import LoadingSpinner from "../Components/common/LoadingSpinner"
import ErrorMessage from "../Components/common/ErrorMessage"
import ConfirmationModal from "../Components/common/ConfirmationModal"
import ItemDetail from "../Components/InventoryManagement/ItemDetail"
import { useToast } from "../hooks/use-toast"

function ItemDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await inventoryApi.getItemById(id)
        setItem(response.data)
      } catch (err) {
        setError("Failed to fetch item details")
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id])

  const handleDelete = async () => {
    try {
      await inventoryApi.deleteItem(id)
      toast({
        title: "Success",
        description: "Item deleted successfully",
        variant: "success",
      })
      navigate("/inventory")
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!item) return <ErrorMessage message="Item not found" />

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <Link to="/inventory" className="flex items-center text-gray-600 hover:text-gray-900">
          <span className="mr-1">⬅️</span>
          Back to Inventory
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-700">
          <h2 className="text-2xl font-bold text-white">Item Details</h2>
          <p className="text-indigo-100">View detailed information about this inventory item</p>
        </div>

        <div className="p-6">
          <ItemDetail item={item} />

          <div className="mt-6 flex justify-end space-x-3">
            <Link
              to={`/inventory/edit/${id}`}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
            >
              <span className="mr-2">✏️</span>
              Edit Item
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
            >
              <span className="mr-2">🗑️</span>
              Delete Item
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <ConfirmationModal
          title="Delete Item"
          message={`Are you sure you want to delete ${item.name}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}

export default ItemDetails
