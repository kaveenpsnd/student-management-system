import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { inventoryApi } from '../services/api';
import LoadingSpinner from '../Components/common/LoadingSpinner';
import ErrorMessage from '../Components/common/ErrorMessage';
import ConfirmationModal from '../Components/common/ConfirmationModal';
import ItemDetail from '../Components/InventoryManagement/ItemDetail';


function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await inventoryApi.getItemById(id);
        setItem(response.data);
      } catch (err) {
        setError('Failed to fetch item details');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    try {
      await inventoryApi.deleteItem(id);
      navigate('/inventory');
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!item) return <ErrorMessage message="Item not found" />;

  return (
    <div className="item-details-page">
      <div className="page-header">
        <h2>Item Details</h2>
        <div className="header-actions">
          <Link to="/inventory" className="btn btn-secondary">Back to List</Link>
        </div>
      </div>

      <ItemDetail item={item} />

      <div className="item-actions">
        <Link to={`/inventory/edit/${id}`} className="btn btn-primary">Edit Item</Link>
        <button onClick={() => setShowDeleteModal(true)} className="btn btn-danger">Delete Item</button>
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
  );
}

export default ItemDetails;
