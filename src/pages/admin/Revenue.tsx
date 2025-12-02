import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { adminApi } from '../../services/adminApi';
import { Booking, Car } from '../../types';
import { Search, Save, Loader2, User, Phone, Download } from 'lucide-react';

interface CarRevenueStats extends Car {
  totalBookings: number;
  totalRevenue: number;
  ownerEarnings: number;
  companyEarnings: number;
}

export default function Revenue() {
  const [cars, setCars] = useState<CarRevenueStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempShare, setTempShare] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch all cars
      const carsDataRaw = await api.cars.list();
      
      // Fetch all bookings
      const bookingsData = await api.bookings.list();

      // Process Data
      const processedCars = carsDataRaw.map((car: any) => {
        // Filter bookings for this car that are completed (Revenue Realized)
        const carBookings = bookingsData.filter(b => b.carId === car.id && (b.status === 'Completed' || b.status === 'Approved'));
        
        const totalRevenue = carBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
        const totalBookings = carBookings.length;
        
        // Use mapped fields from api.ts
        const ownerShare = car.ownerSharePercentage ?? 100; 
        const ownerEarnings = (totalRevenue * ownerShare) / 100;
        const companyEarnings = totalRevenue - ownerEarnings;

        return {
          ...car,
          ownerName: car.ownerName || 'Magnum',
          ownerPhone: car.ownerPhone || '7845012402',
          ownerSharePercentage: ownerShare,
          totalBookings,
          totalRevenue,
          ownerEarnings,
          companyEarnings
        };
      });

      setCars(processedCars);
    } catch (error) {
      console.error("Failed to load revenue data", error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (car: CarRevenueStats) => {
    setEditingId(car.id);
    setTempShare(car.ownerSharePercentage || 100);
  };

  const saveShare = async (id: string) => {
    setSaving(true);
    try {
      await adminApi.cars.updateOwnerShare(id, tempShare);
      
      // Update local state immediately for UI responsiveness
      setCars(prev => prev.map(c => {
        if (c.id === id) {
          const newOwnerEarnings = (c.totalRevenue * tempShare) / 100;
          const newCompanyEarnings = c.totalRevenue - newOwnerEarnings;
          return {
            ...c,
            ownerSharePercentage: tempShare,
            ownerEarnings: newOwnerEarnings,
            companyEarnings: newCompanyEarnings
          };
        }
        return c;
      }));
      
      setEditingId(null);
    } catch (error) {
      alert("Failed to update share percentage");
    } finally {
      setSaving(false);
    }
  };

  const filteredCars = cars.filter(car => {
    const matchesCity = filterCity === 'All' || car.cityId === filterCity;
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          car.ownerName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCity && matchesSearch;
  });

  // Grand Totals
  const grandTotalRevenue = filteredCars.reduce((sum, c) => sum + c.totalRevenue, 0);
  const grandTotalOwner = filteredCars.reduce((sum, c) => sum + c.ownerEarnings, 0);
  const grandTotalCompany = filteredCars.reduce((sum, c) => sum + c.companyEarnings, 0);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-magnum-500" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Revenue Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">Manage owner shares and track earnings per vehicle.</p>
        </div>
        
        {/* Summary Cards */}
        <div className="flex gap-4">
          <div className="bg-dark-800 p-4 rounded-xl border border-magnum-500/30">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Total Revenue</div>
            <div className="text-xl font-bold text-magnum-400">₹{grandTotalRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-dark-800 p-4 rounded-xl border border-gray-800">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Owner Payout</div>
            <div className="text-xl font-bold text-white">₹{grandTotalOwner.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-dark-800 p-4 rounded-xl border border-gray-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search car or owner..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-magnum-500 outline-none"
          />
        </div>
        <select 
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className="bg-dark-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-magnum-500 outline-none"
        >
          <option value="All">All Cities</option>
          <option value="tirunelveli">Tirunelveli</option>
          <option value="tenkasi">Tenkasi</option>
          <option value="tuticorin">Tuticorin</option>
          <option value="kanyakumari">Kanyakumari</option>
        </select>
      </div>

      {/* Revenue Table */}
      <div className="bg-dark-800 rounded-xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-dark-900 text-gray-400 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Vehicle Details</th>
                <th className="px-6 py-4">Owner Info</th>
                <th className="px-6 py-4 text-center">Bookings</th>
                <th className="px-6 py-4 text-right">Total Revenue</th>
                <th className="px-6 py-4 text-center">Owner Share %</th>
                <th className="px-6 py-4 text-right">Owner Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredCars.map((car) => (
                <tr key={car.id} className="hover:bg-dark-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={car.image} alt={car.name} className="w-10 h-10 rounded object-cover border border-gray-700" />
                      <div>
                        <div className="font-bold text-white">{car.name}</div>
                        <div className="text-xs text-magnum-500">{car.registrationNumber || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-gray-300">
                        <User size={12} className="text-gray-500" /> {car.ownerName}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <Phone size={12} className="text-gray-500" /> {car.ownerPhone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-dark-900 px-2 py-1 rounded text-gray-300 font-mono">{car.totalBookings}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-magnum-400">
                    ₹{car.totalRevenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {editingId === car.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <input 
                          type="number" 
                          min="0" 
                          max="100"
                          value={tempShare}
                          onChange={(e) => setTempShare(Number(e.target.value))}
                          className="w-16 bg-dark-900 border border-magnum-500 rounded px-2 py-1 text-center text-white outline-none"
                          autoFocus
                        />
                        <button 
                          onClick={() => saveShare(car.id)}
                          disabled={saving}
                          className="p-1 bg-magnum-600 text-white rounded hover:bg-magnum-500"
                        >
                          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => startEditing(car)}
                        className="text-gray-300 hover:text-magnum-400 border-b border-dashed border-gray-600 hover:border-magnum-400 transition-colors"
                      >
                        {car.ownerSharePercentage}%
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-white">
                    ₹{car.ownerEarnings.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCars.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No vehicles found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
