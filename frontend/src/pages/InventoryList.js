import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryApi } from '../services/api';
import ItemList from '../inventory/ItemList';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

function InventoryList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await inventoryApi.getAllItems();
        setItems(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch inventory items');
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await inventoryApi.deleteItem(id);
        setItems(items.filter(item => item._id !== id));
      } catch (err) {
        setError('Failed to delete item');
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