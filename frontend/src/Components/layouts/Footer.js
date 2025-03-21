import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Smart School Management System</p>
      </div>
    </footer>
  );
}

export default Footer;