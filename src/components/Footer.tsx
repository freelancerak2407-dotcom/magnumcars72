import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-magnum-900/30 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
             <h3 className="text-xl font-serif font-bold text-magnum-400 mb-4">MAGNUM CARS</h3>
             <p className="text-gray-400 text-sm leading-relaxed">
               Premium self-drive car rental service in South Tamil Nadu. 
               Experience luxury and comfort with our well-maintained fleet.
             </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-magnum-200 mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-5 h-5 text-magnum-500 shrink-0" />
                <p>L133, Josy Cottage, Anbu Nagar Water Tank 2nd Street, Perumalpuram, Tirunelveli - 627007</p>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-5 h-5 text-magnum-500 shrink-0" />
                <p>+91 78450 12402</p>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-5 h-5 text-magnum-500 shrink-0" />
                <p>carsmagnum583@gmail.com</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-magnum-200 mb-4">Locations</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-magnum-500 rounded-full"></span> Tirunelveli (Head Office)</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-700 rounded-full"></span> Tenkasi (Coming Soon)</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-700 rounded-full"></span> Tuticorin (Coming Soon)</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-700 rounded-full"></span> Kanyakumari (Coming Soon)</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-600 text-xs">
          <p>&copy; {new Date().getFullYear()} Magnum Self Drive Cars. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
