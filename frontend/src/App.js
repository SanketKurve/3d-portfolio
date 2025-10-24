import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import 3D Portfolio page
import PortfolioHome from './pages/PortfolioHome';

// Import Admin components
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminPanel from './admin2/AdminPanel';

// Import Auth Context
import { AuthProvider } from './contexts/AuthContext';

// Import Custom Cursor
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        {/* Custom Cursor - Global */}
        <CustomCursor />

        <BrowserRouter>
          <Routes>
            {/* 3D Portfolio Route */}
            <Route path="/" element={<PortfolioHome />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/admin2/*" element={<AdminPanel />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
