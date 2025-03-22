import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Nav.css";

const Nav = () => {
  const location = useLocation();

  return (
    <div className="nav-container">
      <h1 className="logo">EduAdmin</h1>

      <div className="nav-links">
        <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>📊 Dashboard</Link>
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>🎓 Students</Link>
        <Link to="/staff" className={location.pathname === "/staff" ? "active" : ""}>👨‍🏫 Staff</Link>
        <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>💼 Assets</Link>
        <Link to="/payments" className={location.pathname === "/payments" ? "active" : ""}>💰 Payments</Link>
        <Link to="/events" className={location.pathname === "/events" ? "active" : ""}>📅 Events</Link>
      </div>
    </div>
  );
};

export default Nav;

