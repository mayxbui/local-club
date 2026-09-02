import './App.css';
import React from 'react';
import LogIn from './components/logIn/LogIn';
import Locals from './components/locals/Locals';
import Home from './components/home/Home';
import NavBar from './components/navBar/NavBar';
import Register from './components/register/Register';
import Scan from './components/scan/Scan';
import Deals from './components/deals/Deals';
import CheckIn from './components/checkin/CheckIn';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useUser } from './components/contexts/UserContext';

function AppWrapper() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const { loading } = useUser();
  const location = useLocation();
  const hideNavBarOn = ['/login', '/register', '/checkin'];

  if (loading) return <p>Loading...</p>;

  return (
    <div className="App">
      {!hideNavBarOn.includes(location.pathname) && <NavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/locals" element={<Locals />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/checkin" element={<CheckIn />} />
        {/* <Route path="/upload" element={<UploadData />} /> */}
      </Routes>

      <ToastContainer />
    </div>
  );
}

export default AppWrapper;
