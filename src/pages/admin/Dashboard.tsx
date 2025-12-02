import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Booking, Car } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Car as CarIcon, Calendar } from 'lucide-react';

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    api.bookings.list().then(setBookings);
    api.cars.list().then(setCars);
  }, []);

  // Calculate Stats
  const totalRevenue = bookings.reduce((acc, b) => b.status === 'Completed' || b.status === 'Approved' ? acc + b.totalAmount : acc, 0);
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const activeCars = cars.filter(c => c.isAvailable).length;

  // Mock Data for Graphs (Replace with real aggregation in production)
  const revenueData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 2000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
  ];

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-dark-800 p-6 rounded-xl border border-gray-800">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={color} size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-white">Dashboard Overview</h1>
        <div className="text-sm text-gray-400">Welcome back, Admin</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={TrendingUp} color="text-green-500" />
        <StatCard title="Pending Requests" value={pendingBookings} icon={Calendar} color="text-yellow-500" />
        <StatCard title="Active Cars" value={activeCars} icon={CarIcon} color="text-blue-500" />
        <StatCard title="Total Bookings" value={bookings.length} icon={Users} color="text-purple-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-dark-800 p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-6">Weekly Revenue</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Bar dataKey="revenue" fill="#D6A534" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-dark-800 p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-6">Booking Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
