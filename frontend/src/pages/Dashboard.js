import { Users, UserPlus, Briefcase, DollarSign, Calendar, AlertCircle, FileText } from "lucide-react"
import "../styles/dashboard.css"

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search..." />
        </div>
        <div className="dashboard-actions">
          <div className="dashboard-action">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </div>
          <div className="dashboard-action">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 8v4"></path>
              <path d="M12 16h.01"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Total Students</div>
            <div className="stat-icon">
              <Users size={20} />
            </div>
          </div>
          <div className="stat-value">2,543</div>
          <div className="stat-change positive">+12% from last month</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Total Staff</div>
            <div className="stat-icon">
              <Briefcase size={20} />
            </div>
          </div>
          <div className="stat-value">128</div>
          <div className="stat-change">+3 new this month</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Total Assets</div>
            <div className="stat-icon">
              <FileText size={20} />
            </div>
          </div>
          <div className="stat-value">1,890</div>
          <div className="stat-change">95% in good condition</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Total Fund</div>
            <div className="stat-icon">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="stat-value">$847,245</div>
          <div className="stat-change positive">+8.5% this quarter</div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Recent Activities */}
        <div className="content-card">
          <h2 className="content-header">Recent Activities</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">
                <UserPlus size={20} />
              </div>
              <div className="activity-content">
                <div className="activity-title">New student registration completed</div>
                <div className="activity-time">2 hours ago</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">
                <DollarSign size={20} />
              </div>
              <div className="activity-content">
                <div className="activity-title">Fee payment received</div>
                <div className="activity-time">5 hours ago</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">
                <Calendar size={20} />
              </div>
              <div className="activity-content">
                <div className="activity-title">Staff meeting scheduled</div>
                <div className="activity-time">Yesterday at 15:00</div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="content-card">
          <h2 className="content-header">Alerts</h2>
          <div className="alert-list">
            <div className="alert-item">
              <div className="alert-icon">
                <AlertCircle size={16} />
              </div>
              <div className="alert-content">Fee payment pending for 15 students</div>
            </div>

            <div className="alert-item">
              <div className="alert-icon">
                <AlertCircle size={16} />
              </div>
              <div className="alert-content">5 assets require maintenance</div>
            </div>

            <div className="alert-item">
              <div className="alert-icon">
                <AlertCircle size={16} />
              </div>
              <div className="alert-content">Staff evaluation due next week</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
