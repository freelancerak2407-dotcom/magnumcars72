import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Menu, X, Phone } from 'lucide-react';
import { adminAuth } from '../services/adminAuth';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [clickCount, setClickCount] = useState(0);

  // Hidden Trigger Logic
  useEffect(() => {
    if (clickCount === 0) return;
    
    const timer = setTimeout(() => setClickCount(0), 2000);
    
    if (clickCount === 2) {
      navigate('/admin/login');
      setClickCount(0);
    }
    
    return () => clearTimeout(timer);
  }, [clickCount, navigate]);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (!isAdminRoute) {
      e.preventDefault();
      setClickCount(prev => prev + 1);
    }
  };

  return (
    <nav className="bg-dark-800 border-b border-magnum-900/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo Section with Hidden Trigger */}
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3 group select-none">
            <div className="relative w-12 h-12 flex items-center justify-center">
               <Shield className="w-full h-full text-magnum-500 drop-shadow-[0_0_10px_rgba(214,165,52,0.3)]" strokeWidth={1.5} />
               <span className="absolute inset-0 flex items-center justify-center font-serif font-bold text-dark-900 text-2xl pt-1">M</span>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-magnum-300 via-magnum-100 to-magnum-400 tracking-wide drop-shadow-sm">
                MAGNUM
              </h1>
              <span className="text-[10px] font-sans font-bold text-magnum-500 tracking-[0.4em] uppercase ml-0.5">
                CARS
              </span>
            </div>
          </Link>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {!isAdminRoute ? (
                <>
                  <Link to="/" className="text-gray-300 hover:text-magnum-400 px-3 py-2 text-sm font-medium tracking-wide transition-colors uppercase">Home</Link>
                  <Link to="/cars/tirunelveli" className="text-gray-300 hover:text-magnum-400 px-3 py-2 text-sm font-medium tracking-wide transition-colors uppercase">Fleet</Link>
                  <a href="tel:+917845012402" className="bg-gradient-to-r from-magnum-600 to-magnum-500 hover:from-magnum-500 hover:to-magnum-400 text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-magnum-900/20">
                    <Phone size={16} />
                    +91 78450 12402
                  </a>
                </>
              ) : (
                <div className="flex items-center gap-4">
                   <span className="text-magnum-400 text-xs font-bold uppercase tracking-wider border border-magnum-500/30 px-3 py-1 rounded bg-magnum-500/10">Admin Mode</span>
                   <button 
                     onClick={() => {
                       adminAuth.logout();
                       navigate('/');
                     }}
                     className="text-gray-400 hover:text-white px-3 py-2 uppercase text-xs tracking-widest"
                   >
                     Logout
                   </button>
                </div>
              )}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-900 border-b border-magnum-900/30">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/cars/tirunelveli" className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>Fleet</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
