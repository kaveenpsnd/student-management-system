"use client"
import { useNavigate } from "react-router-dom"
import AddItemForm from "../Components/InventoryManagement/AddItemForm"
import { inventoryApi } from "../services/api"

function AddItem() {
  const navigate = useNavigate()

  const handleSubmit = async (formData) => {
    try {
      await inventoryApi.createItem(formData)
      navigate("/inventory")
    } catch (error) {
      alert("Failed to add item. Please try again.")
      console.error(error)
    }
  }

  return (
    <div>
      <AddItemForm onSubmit={handleSubmit} />
    </div>
  )
}

export default AddItem

