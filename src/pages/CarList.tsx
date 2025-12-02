import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Car } from '../types';
import { Fuel, Settings, Users, IndianRupee } from 'lucide-react';

export default function CarList() {
  const { cityId } = useParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cityId) {
      api.cars.list(cityId).then(data => {
        setCars(data);
        setLoading(false);
      });
    }
  }, [cityId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-magnum-500">Loading Fleet...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-white">Available Cars in <span className="text-magnum-500 capitalize">{cityId}</span></h2>
        <p className="text-gray-400 mt-2">Choose from our premium fleet of well-maintained vehicles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map((car) => (
          <div key={car.id} className="bg-dark-800 rounded-2xl overflow-hidden border border-gray-800 hover:border-magnum-500/50 transition-all duration-300 group">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={car.image} 
                alt={car.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full border border-magnum-500/30">
                <span className="text-magnum-400 text-xs font-bold tracking-wider">{car.year}</span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{car.name}</h3>
                  <span className="text-xs text-gray-500 uppercase tracking-wider border border-gray-700 px-2 py-0.5 rounded">{car.type}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 text-sm text-gray-400">
                <div className="flex items-center gap-2"><Settings size={14} className="text-magnum-600" /> {car.gear}</div>
                <div className="flex items-center gap-2"><Fuel size={14} className="text-magnum-600" /> {car.fuel}</div>
                <div className="flex items-center gap-2"><Users size={14} className="text-magnum-600" /> {car.type}</div>
                <div className="flex items-center gap-2"><span className="text-magnum-600 font-bold">Avg</span> {car.mileage}</div>
              </div>

              <div className="border-t border-gray-700/50 pt-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center text-magnum-400 font-bold text-lg">
                    <IndianRupee size={16} /> {car.price24h}
                    <span className="text-xs text-gray-500 font-normal ml-1">/ 24hr</span>
                  </div>
                  <div className="text-xs text-gray-500">
                     ₹{car.price12h} / 12hr
                  </div>
                </div>
                <Link 
                  to={`/booking/${car.id}`}
                  className="bg-magnum-600 hover:bg-magnum-500 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
