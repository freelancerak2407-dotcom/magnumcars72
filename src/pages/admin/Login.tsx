import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail } from 'lucide-react';
import { adminAuth } from '../../services/adminAuth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = adminAuth.login(email, password);
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-96px)] flex items-center justify-center bg-dark-900 px-4">
      <div className="bg-dark-800 p-8 rounded-2xl border border-gray-800 w-full max-w-md shadow-2xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-magnum-600 via-magnum-400 to-magnum-600"></div>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-dark-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-magnum-900/50 shadow-inner">
            <Shield className="w-8 h-8 text-magnum-500" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">Admin Portal</h2>
          <p className="text-gray-500 text-sm mt-2">Restricted Access Area</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-dark-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-magnum-500 outline-none transition-colors"
                placeholder="admin@magnum.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-dark-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-magnum-500 outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-magnum-600 to-magnum-500 hover:from-magnum-500 hover:to-magnum-400 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-magnum-900/20 mt-2">
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}
