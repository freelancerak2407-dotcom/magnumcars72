import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Car, Calendar, FileText, TrendingUp, Settings, Image as ImageIcon, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();

  // Protect Route
  React.useEffect(() => {
    const token = localStorage.getItem('magnum_admin_token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Car, label: 'Fleet Management', path: '/admin/cars' },
    { icon: FileText, label: 'Bookings', path: '/admin/bookings' },
    { icon: Calendar, label: 'Calendar', path: '/admin/calendar' },
    { icon: TrendingUp, label: 'Revenue', path: '/admin/revenue' },
    // { icon: ImageIcon, label: 'Media', path: '/admin/media' },
    // { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-96px)] bg-dark-900">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-800 border-r border-gray-800 hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Main Menu</h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-magnum-900/20 text-magnum-400 border border-magnum-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-dark-700'}
                `}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-gray-800">
          <button 
            onClick={() => {
              localStorage.removeItem('magnum_admin_token');
              navigate('/');
            }}
            className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition-colors text-sm font-medium w-full"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
