import React from 'react';

function ItemDetail({ item }) {
  return (
    <div className="item-detail-container">
      <div className="item-detail-card">
        <div className="item-header">
          <h3>{item.name}</h3>
          <span className="category-badge">{item.category}</span>
        </div>
        
        <div className="item-info">
          <div className="info-row">
            <span className="info-label">Quantity:</span>
            <span className="info-value">{item.quantity}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Price:</span>
            <span className="info-value">Rs.{item.price.toFixed(2)}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Total Value:</span>
            <span className="info-value">Rs.{(item.price * item.quantity).toFixed(2)}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Item ID:</span>
            <span className="info-value">{item._id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;