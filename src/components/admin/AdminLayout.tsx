import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { adminAuth } from '../../services/adminAuth';

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminAuth.isAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-dark-900">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
