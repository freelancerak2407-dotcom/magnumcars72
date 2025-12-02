import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Booking, Car } from '../../types';
import { CheckCircle, XCircle, FileText, Phone, Search, Filter } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.bookings.list().then(setBookings);
    api.cars.list().then(setCars);
  }, []);

  const updateStatus = async (id: string, status: Booking['status']) => {
    await api.bookings.updateStatus(id, status);
    setBookings(await api.bookings.list());
  };

  const generateInvoice = (booking: Booking) => {
    const car = cars.find(c => c.id === booking.carId);
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(20, 20, 20);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(214, 165, 52);
    doc.setFontSize(22);
    doc.text('MAGNUM SELF DRIVE CARS', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('L133, Josy Cottage, Anbu Nagar, Tirunelveli - 627007', 105, 30, { align: 'center' });
    doc.text('Ph: +91 7845012402 | Email: carsmagnum583@gmail.com', 105, 35, { align: 'center' });

    // Customer Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Invoice #${booking.id.slice(0,8).toUpperCase()}`, 14, 55);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 62);
    
    doc.setFontSize(11);
    doc.text('Bill To:', 14, 75);
    doc.setFontSize(10);
    doc.text(booking.customerName, 14, 82);
    doc.text(booking.phone, 14, 87);
    doc.text(booking.address, 14, 92);

    // Table
    autoTable(doc, {
      startY: 100,
      head: [['Description', 'Details', 'Amount']],
      body: [
        ['Vehicle Model', car?.name || 'Unknown Car', ''],
        ['Registration No', car?.registrationNumber || 'N/A', ''],
        ['Rental Period', `${new Date(booking.startDate).toLocaleDateString()} to ${new Date(booking.endDate).toLocaleDateString()}`, ''],
        ['Total Duration', 'Days', ''],
        ['Total Amount', '', `Rs. ${booking.totalAmount}`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [214, 165, 52], textColor: [0,0,0] }
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.text('Terms & Conditions:', 14, finalY);
    doc.setFontSize(8);
    doc.text('1. Fuel charges are borne by the customer.', 14, finalY + 6);
    doc.text('2. Any damage to the vehicle will be charged as per actuals.', 14, finalY + 11);
    
    doc.save(`Invoice_${booking.id}.pdf`);
  };

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = filter === 'All' || b.status === filter;
    const matchesSearch = b.customerName.toLowerCase().includes(search.toLowerCase()) || b.phone.includes(search);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-white">Booking Management</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-dark-800 p-4 rounded-xl border border-gray-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search customer name or phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-dark-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-magnum-500 outline-none"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Pending', 'Approved', 'Completed', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status 
                  ? 'bg-magnum-600 text-white' 
                  : 'bg-dark-900 text-gray-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-800 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-dark-900 text-gray-200 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Car</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredBookings.map((booking) => {
                const car = cars.find(c => c.id === booking.carId);
                return (
                  <tr key={booking.id} className="hover:bg-dark-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{booking.customerName}</div>
                      <div className="text-xs">{booking.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{car?.name}</div>
                      <div className="text-xs text-magnum-400">{car?.registrationNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                      <div className="text-xs">to {new Date(booking.endDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${booking.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                          booking.status === 'Approved' ? 'bg-green-500/20 text-green-400' : 
                          booking.status === 'Rejected' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      {booking.status === 'Pending' && (
                        <>
                          <button onClick={() => updateStatus(booking.id, 'Approved')} className="p-1 text-green-400 hover:bg-green-400/10 rounded" title="Approve"><CheckCircle size={18} /></button>
                          <button onClick={() => updateStatus(booking.id, 'Rejected')} className="p-1 text-red-400 hover:bg-red-400/10 rounded" title="Reject"><XCircle size={18} /></button>
                        </>
                      )}
                      <button onClick={() => generateInvoice(booking)} className="p-1 text-magnum-400 hover:bg-magnum-400/10 rounded" title="Invoice"><FileText size={18} /></button>
                      <a href={`https://wa.me/91${booking.phone}`} target="_blank" rel="noreferrer" className="p-1 text-green-500 hover:bg-green-500/10 rounded" title="WhatsApp"><Phone size={18} /></a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
