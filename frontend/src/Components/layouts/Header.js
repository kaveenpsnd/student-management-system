import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <h1>Smart School Management</h1>
        </Link>
      </div>
      <div className="header-right">
        <span>Inventory Management System</span>
      </div>
    </header>
  );
}

export default Header;