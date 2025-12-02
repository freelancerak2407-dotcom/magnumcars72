import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CarList from './pages/CarList';
import BookingPage from './pages/Booking';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import CarsManager from './pages/admin/Cars';
import BookingsManager from './pages/admin/Bookings';
import CalendarView from './pages/admin/Calendar';
import Revenue from './pages/admin/Revenue';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-900 text-gray-100 font-sans selection:bg-magnum-500/30">
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/cars/:cityId" element={<CarList />} />
            <Route path="/booking/:carId" element={<BookingPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route path="/admin" element={<AdminLayout />}>
               <Route index element={<Dashboard />} />
               <Route path="dashboard" element={<Dashboard />} />
               <Route path="cars" element={<CarsManager />} />
               <Route path="bookings" element={<BookingsManager />} />
               <Route path="calendar" element={<CalendarView />} />
               <Route path="revenue" element={<Revenue />} />
               {/* Placeholders for other routes */}
               <Route path="media" element={<div className="p-8 text-gray-400">Media Library Coming Soon</div>} />
               <Route path="settings" element={<div className="p-8 text-gray-400">Settings Module Coming Soon</div>} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
