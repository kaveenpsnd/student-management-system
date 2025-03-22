import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function EditItemForm({ item, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || '',
        quantity: item.quantity || '',
        price: item.price || '',
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(formData.quantity) || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        ...formData,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
      });
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Item Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? 'input-error' : ''}
          />
          {errors.category && <span className="error">{errors.category}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className={errors.quantity ? 'input-error' : ''}
          />
          {errors.quantity && <span className="error">{errors.quantity}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price (Rs)</label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className={errors.price ? 'input-error' : ''}
          />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Update Item
          </button>
          <Link to="/inventory" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default EditItemForm;