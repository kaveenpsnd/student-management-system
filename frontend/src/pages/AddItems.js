import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddItemForm from '../Components/inventory/AddItemForm';
import { inventoryApi } from '../services/api';

function AddItem() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await inventoryApi.createItem(formData);
      navigate('/inventory');
    } catch (error) {
      alert('Failed to add item. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="add-item-page">
      <div className="page-header">
        <h2>Add New Inventory Item</h2>
      </div>
      <AddItemForm onSubmit={handleSubmit} />
    </div>
  );
}

export default AddItem;