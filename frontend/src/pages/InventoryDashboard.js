import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryApi } from '../services/api';
import LoadingSpinner from '../Components/common/LoadingSpinner';
import ErrorMessage from '../Components/common/ErrorMessage';

function InventoryDashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventoryStats = async () => {
      try {
        const response = await inventoryApi.getAllItems();
        const items = response.data;
        
        // Calculate total items
        const totalItems = items.length;
        
        // Calculate total inventory value
        const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Find items with low stock (less than 10)
        const lowStockItems = items.filter(item => item.quantity < 10);
        
        setStats({
          totalItems,
          totalValue,
          lowStockItems,
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch inventory statistics');
        setLoading(false);
      }
    };

    fetchInventoryStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h2>Inventory Dashboard</h2>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-value">{stats.totalItems}</div>
          <div className="stat-label">Total Items</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">Rs.{stats.totalValue.toFixed(2)}</div>
          <div className="stat-label">Total Value</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.lowStockItems.length}</div>
          <div className="stat-label">Low Stock Items</div>
        </div>
      </div>

      {stats.lowStockItems.length > 0 && (
        <div className="low-stock-section">
          <h3>Low Stock Items</h3>
          <ul className="low-stock-list">
            {stats.lowStockItems.map(item => (
              <li key={item.id} className="low-stock-item">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">Qty: {item.quantity}</span>
                <Link to={`/inventory/edit/${item.id}`} className="restock-link">Restock</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default InventoryDashboard;
