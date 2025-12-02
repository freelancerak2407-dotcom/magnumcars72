import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { City } from '../types';

export default function Home() {
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    api.cities.list().then(setCities);
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      {/* Hero Section */}
      <div className="relative flex-1 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center">
        <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight">
            Drive Your <span className="text-magnum-500">Dreams</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 font-light">
            Premium self-drive car rentals in South Tamil Nadu. <br/>
            Choose your city to start your journey.
          </p>

          <div className="bg-dark-800/90 p-6 rounded-2xl border border-magnum-500/30 backdrop-blur-md shadow-2xl">
            <h3 className="text-magnum-400 font-medium mb-4 text-left flex items-center gap-2">
              <MapPin size={18} /> Select Your City
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => city.active && navigate(`/cars/${city.id}`)}
                  disabled={!city.active}
                  className={`
                    group relative p-4 rounded-xl border text-left transition-all duration-300
                    ${city.active 
                      ? 'border-magnum-500/50 bg-dark-700/50 hover:bg-magnum-900/20 hover:border-magnum-400 cursor-pointer' 
                      : 'border-gray-800 bg-dark-900/50 opacity-50 cursor-not-allowed'}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${city.active ? 'text-white' : 'text-gray-500'}`}>
                      {city.name}
                    </span>
                    {city.active && <ChevronRight className="text-magnum-500 group-hover:translate-x-1 transition-transform" size={18} />}
                  </div>
                  {!city.active && <span className="text-xs text-red-400 mt-1 block">Currently Unavailable</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
