import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, Calendar, FileText, DollarSign, Settings, Image } from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Car, label: 'Fleet Management', path: '/admin/cars' },
  { icon: FileText, label: 'Bookings', path: '/admin/bookings' },
  { icon: Calendar, label: 'Availability', path: '/admin/calendar' },
  { icon: DollarSign, label: 'Revenue', path: '/admin/revenue' },
  { icon: Image, label: 'Media', path: '/admin/media' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-dark-800 border-r border-gray-800 min-h-[calc(100vh-96px)] hidden md:block">
      <div className="p-4">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-4">Menu</div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-magnum-500/10 text-magnum-400 border border-magnum-500/20' 
                    : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
