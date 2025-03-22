import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li className={isActive('/')}>
          <Link to="/">Dashboard</Link>
        </li>
        <li className={isActive('/inventory')}>
          <Link to="/inventory">Inventory List</Link>
        </li>
        <li className={isActive('/inventory/add')}>
          <Link to="/inventory/add">Add New Item</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;