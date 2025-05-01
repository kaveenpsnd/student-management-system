"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { inventoryApi } from "../services/api"
import ItemList from "../Components/InventoryManagement/ItemList"
import LoadingSpinner from "../Components/common/LoadingSpinner"
import ErrorMessage from "../Components/common/ErrorMessage"
import { useToast } from "../hooks/use-toast"

function InventoryList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await inventoryApi.getAllItems()
        setItems(response.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch inventory items")
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await inventoryApi.deleteItem(id)
        setItems(items.filter((item) => item._id !== id))
        toast({
          title: "Success",
          description: "Item deleted successfully",
          variant: "success",
        })
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete item",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <div>
          <h1 className="inventory-title">Inventory Items</h1>
          <p className="inventory-subtitle">Manage your inventory items and stock levels</p>
        </div>
        <Link to="/inventory/add" className="add-item-button">
          <span className="add-icon">➕</span>
          Add New Item
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6">
          {items.length === 0 ? (
            <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Inventory Items</h3>
              <p className="text-gray-600 mb-4">You haven't added any inventory items yet.</p>
              <Link
                to="/inventory/add"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 inline-flex items-center"
              >
                <span className="mr-2">➕</span>
                Add Your First Item
              </Link>
            </div>
          ) : (
            <ItemList items={items} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </div>
  )
}

export default InventoryList
