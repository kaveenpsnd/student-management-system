import React from 'react';
import { Link } from 'react-router-dom';

function ItemCard({ item, onDelete }) {
  return (
    <div className="item-card">
      <div className="item-header">
        <h3>{item.name}</h3>
        <span className="category-badge">{item.category}</span>
      </div>
      <div className="item-body">
        <div className="item-detail">
          <span className="label">Quantity:</span>
          <span className="value">{item.quantity}</span>
        </div>
        <div className="item-detail">
          <span className="label">Price:</span>
          <span className="value">Rs.{item.price.toFixed(2)}</span>
        </div>
      </div>
      <div className="item-actions">
        <Link to={`/inventory/${item._id}`} className="btn btn-small btn-view">
          View
        </Link>
        <Link to={`/inventory/edit/${item._id}`} className="btn btn-small btn-edit">
          Edit
        </Link>
        <button onClick={onDelete} className="btn btn-small btn-delete">
          Delete
        </button>
      </div>
    </div>
  );
}

export default ItemCard;