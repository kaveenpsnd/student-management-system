import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';

// Layout components
import Header from './components/layouts/Header';
import Sidebar from './components/layouts/Sidebar';
import Footer from './components/layouts/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import InventoryList from './pages/InventoryList';
import AddItem from './pages/AddItems';
import EditItem from './pages/EditItem';
import ItemDetails from './pages/ItemDetails';

// Additional Pages
import StudentManagement from "./Components/StudentManagement/StudentManagement";
import StudentEnrollment from "./Components/StudentEnrollment/StudentEnrollment";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<InventoryList />} />
              <Route path="/inventory/add" element={<AddItem />} />
              <Route path="/inventory/edit/:id" element={<EditItem />} />
              <Route path="/inventory/:id" element={<ItemDetails />} />
              <Route path="/student-management" element={<StudentManagement />} />
              <Route path="/student-enrollment" element={<StudentEnrollment />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
