import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryApi } from '../services/api';
import ItemList from '../Components/InventoryManagement/ItemList';
import LoadingSpinner from '../Components/common/LoadingSpinner';
import ErrorMessage from '../Components/common/ErrorMessage';
function InventoryList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log('Fetching inventory items...');
        const response = await inventoryApi.getAllItems();
        console.log('Received items:', response.data);
        setItems(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to fetch inventory items: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        console.log('Deleting item:', id);
        await inventoryApi.deleteItem(id);
        console.log('Item deleted successfully');
        setItems(items.filter(item => item._id !== id));
      } catch (err) {
        console.error('Error deleting item:', err);
        setError('Failed to delete item: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="inventory-list-page">
      <div className="page-header">
        <h2>Inventory Items</h2>
        <Link to="/inventory/add" className="btn btn-primary">
          Add New Item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>No inventory items found. Click the button above to add your first item.</p>
        </div>
      ) : (
        <ItemList items={items} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default InventoryList;