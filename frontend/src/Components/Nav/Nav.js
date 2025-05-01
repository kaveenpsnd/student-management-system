import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import "../../styles/nav.css"

const Nav = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [expandedMenus, setExpandedMenus] = useState({})

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

  const toggleSubmenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }))
  }

  const menuItems = [
    { path: "/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/", icon: "👨‍🎓", label: "Students" },
    { path: "/staff", icon: "👨‍🏫", label: "Staff" },
    { path: "/inventory", icon: "📦", label: "Inventory" },
    { path: "/payments", icon: "💰", label: "Payments" },
    { path: "/calendar", icon: "📅", label: "Calendar" },
  ]

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button className="mobile-toggle" onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
        {isMobileMenuOpen ? "✖️" : "☰"}
      </button>

      {/* Sidebar Navigation */}
      <div className={`sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span>🎓</span>
            <h2>Smart School</h2>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <div key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </div>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && windowWidth < 1024 && <div className="overlay" onClick={toggleMobileMenu} />}
    </>
  )
}

export default Nav
