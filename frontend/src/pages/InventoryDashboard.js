import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryApi } from '../services/api';
import LoadingSpinner from '../Components/common/LoadingSpinner';
import ErrorMessage from '../Components/common/ErrorMessage';
import { Badge } from 'react-bootstrap';
import InventoryNav from '../Components/InventoryNav';
import '../pages/InventoryDashboard.css';

function Dashboard() {
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
          <div className="stat-value text-warning">{stats.lowStockItems.length}</div>
          <div className="stat-label">Low Stock Items</div>
        </div>
      </div>

      <InventoryNav />

      {stats.lowStockItems.length > 0 && (
        <div className="low-stock-section mt-4">
          <h3 className="section-title mb-3">Low Stock Items</h3>
          <div className="low-stock-list">
            {stats.lowStockItems.map(item => (
              <div key={item._id} className="low-stock-item">
                <div className="item-details">
                  <span className="item-name">{item.name}</span>
                  <Badge bg="warning" className="quantity-badge">
                    Qty: {item.quantity}
                  </Badge>
                </div>
                <Link 
                  to={`/inventory/edit/${item._id}`} 
                  className="btn btn-primary btn-sm restock-btn"
                >
                  Restock
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;