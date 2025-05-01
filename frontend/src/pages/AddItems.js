"use client"
import { useNavigate } from "react-router-dom"
import AddItemForm from "../Components/InventoryManagement/AddItemForm"
import { inventoryApi } from "../services/api"
import { useToast } from "../hooks/use-toast"

function AddItem() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (formData) => {
    try {
      await inventoryApi.createItem(formData)
      toast({
        title: "Success",
        description: "Item added successfully",
        variant: "success",
      })
      navigate("/inventory")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      })
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
