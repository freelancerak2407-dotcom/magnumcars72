import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Car, City } from '../../types';
import { Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function CarsManager() {
  const [cars, setCars] = useState<Car[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [carsData, citiesData] = await Promise.all([
      api.cars.list(),
      api.cities.list()
    ]);
    setCars(carsData);
    setCities(citiesData);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await api.cars.create({
        ...data,
        isAvailable: true,
        year: parseInt(data.year),
        price24h: parseInt(data.price24h),
        price12h: parseInt(data.price12h),
        ownerSharePercentage: parseInt(data.ownerSharePercentage || '100')
      });
      await loadData();
      setIsAdding(false);
      reset();
    } catch (e) {
      alert('Failed to add car');
    }
    setLoading(false);
  };

  const deleteCar = async (id: string) => {
    if (confirm('Are you sure you want to delete this car?')) {
      await api.cars.delete(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-white">Fleet Management</h1>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-magnum-600 hover:bg-magnum-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Add New Car
        </button>
      </div>

      {isAdding && (
        <div className="bg-dark-800 p-6 rounded-xl border border-gray-800 mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Add New Vehicle</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input {...register('name')} placeholder="Car Name" className="bg-dark-900 border border-gray-700 rounded p-3 text-white" required />
            <select {...register('cityId')} className="bg-dark-900 border border-gray-700 rounded p-3 text-white">
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select {...register('type')} className="bg-dark-900 border border-gray-700 rounded p-3 text-white">
              <option value="4 Seater">4 Seater</option>
              <option value="6/7 Seater">6/7 Seater</option>
            </select>
            <input {...register('year')} placeholder="Year" type="number" className="bg-dark-900 border border-gray-700 rounded p-3 text-white" required />
            <select {...register('gear')} className="bg-dark-900 border border-gray-700 rounded p-3 text-white">
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
            <select {...register('fuel')} className="bg-dark-900 border border-gray-700 rounded p-3 text-white">
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
            </select>
            <input {...register('price24h')} placeholder="Price 24h" type="number" className="bg-dark-900 border border-gray-700 rounded p-3 text-white" required />
            <input {...register('price12h')} placeholder="Price 12h" type="number" className="bg-dark-900 border border-gray-700 rounded p-3 text-white" required />
            <input {...register('mileage')} placeholder="Mileage (e.g. 20-24 KMPL)" className="bg-dark-900 border border-gray-700 rounded p-3 text-white" required />
            <input {...register('image')} placeholder="Image URL" className="bg-dark-900 border border-gray-700 rounded p-3 text-white md:col-span-3" required />
            <input {...register('registrationNumber')} placeholder="Registration Number (Admin Only)" className="bg-dark-900 border border-gray-700 rounded p-3 text-white md:col-span-3" />
            
            {/* New Owner Details Section */}
            <div className="md:col-span-3 border-t border-gray-800 pt-4 mt-2">
              <h4 className="text-sm font-bold text-gray-400 uppercase mb-3">Owner Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input {...register('ownerName')} placeholder="Owner Name (Default: Magnum)" className="bg-dark-900 border border-gray-700 rounded p-3 text-white" />
                <input {...register('ownerPhone')} placeholder="Owner Phone" className="bg-dark-900 border border-gray-700 rounded p-3 text-white" />
                <input {...register('ownerSharePercentage')} placeholder="Revenue Share % (Default: 100)" type="number" min="0" max="100" className="bg-dark-900 border border-gray-700 rounded p-3 text-white" />
              </div>
            </div>

            <div className="md:col-span-3 flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button type="submit" disabled={loading} className="bg-magnum-600 text-white px-6 py-2 rounded-lg">
                {loading ? <Loader2 className="animate-spin" /> : 'Save Car'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map(car => (
          <div key={car.id} className="bg-dark-800 rounded-xl border border-gray-800 overflow-hidden group">
            <div className="relative h-48">
              <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-magnum-400 font-bold">
                {car.registrationNumber || 'No Reg #'}
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white text-lg">{car.name}</h3>
                <span className="text-xs bg-dark-700 px-2 py-1 rounded text-gray-300">{car.cityId}</span>
              </div>
              <div className="text-sm text-gray-400 mb-4">
                {car.year} • {car.gear} • {car.fuel}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                <span className="text-magnum-400 font-bold">₹{car.price24h}/day</span>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-400 hover:bg-blue-400/10 rounded"><Edit2 size={16} /></button>
                  <button onClick={() => deleteCar(car.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
