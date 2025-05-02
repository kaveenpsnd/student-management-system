import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditItemForm from '../Components/InventoryManagement/EditItemForm';
import { inventoryApi } from '../services/api';
import LoadingSpinner from '../Components/common/LoadingSpinner';
import ErrorMessage from '../Components/common/ErrorMessage';

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await inventoryApi.getItemById(id);
        setItem(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch item details');
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await inventoryApi.updateItem(id, formData);
      navigate('/inventory');
    } catch (error) {
      alert('Failed to update item. Please try again.');
      console.error(error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!item) return <ErrorMessage message="Item not found" />;

  return (
    <div className="edit-item-page">
      <div className="page-header">
        <h2>Edit Inventory Item</h2>
      </div>
      <EditItemForm item={item} onSubmit={handleSubmit} />
    </div>
  );
}

export default EditItem;