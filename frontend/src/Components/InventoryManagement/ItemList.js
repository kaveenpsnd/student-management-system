import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ItemCard from './ItemCard';

function ItemList({ items, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Get unique categories
  const categories = [...new Set(items.map(item => item.category))];

  // Filter items based on search term and category
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesCategory = filterCategory === '' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="item-list">
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="category-filter">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <p>No items match your search criteria.</p>
      ) : (
        <div className="items-grid">
          {filteredItems.map(item => (
            <ItemCard
              key={item._id}
              item={item}
              onDelete={() => onDelete(item._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ItemList;