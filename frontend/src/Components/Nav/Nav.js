"use client"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faGraduationCap,
  faUserGraduate,
  faChalkboardTeacher,
  faBoxes,
  faMoneyBillWave,
  faCalendarAlt,
  faTachometerAlt,
  faUsers
} from "@fortawesome/free-solid-svg-icons"
import "../../styles/nav.css"

const Nav = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/")
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Define menu items
  const menuItems = [
    { path: "/dashboard", icon: faTachometerAlt, label: "Dashboard" },
    { path: "/", icon: faUserGraduate, label: "Students" },
    { path: "/staff", icon: faUsers, label: "Staff" },
    { path: "/inventory", icon: faBoxes, label: "Assets" },
    { path: "/payments", icon: faMoneyBillWave, label: "Payments" },
    { path: "/calendar", icon: faCalendarAlt, label: "Calendar" },
  ]

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button className="mobile-toggle" onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
        {isMobileMenuOpen ? "✖️" : "☰"}
      </button>

      {/* Sidebar Navigation */}
      <div className={`sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FontAwesomeIcon icon={faGraduationCap} />
          </div>
          <h1 className="sidebar-title">EduAdmin</h1>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-menu-link ${isActive(item.path) ? "active" : ""}`}
              onClick={() => windowWidth < 1024 && setIsMobileMenuOpen(false)}
            >
              <span className="sidebar-menu-icon">
                <FontAwesomeIcon icon={item.icon} />
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && windowWidth < 1024 && <div className="overlay" onClick={toggleMobileMenu} />}
    </>
  )
}

export default Nav
