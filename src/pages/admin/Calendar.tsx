import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { adminApi } from '../../services/adminApi';
import { Booking, Car } from '../../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, addDays } from 'date-fns';
import { Loader2, X, AlertTriangle, Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarView() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Modal State
  const [selectedSlot, setSelectedSlot] = useState<{ car: Car, date: Date } | null>(null);
  const [blockReason, setBlockReason] = useState('Maintenance');
  const [blockEndDate, setBlockEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bData, cData] = await Promise.all([
        api.bookings.list(),
        api.cars.list()
      ]);
      setBookings(bData);
      setCars(cData);
    } catch (error) {
      console.error("Failed to load calendar data", error);
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const getStatusForDay = (carId: string, day: Date) => {
    const booking = bookings.find(b => 
      b.carId === carId && 
      b.status !== 'Rejected' &&
      isWithinInterval(day, { start: new Date(b.startDate), end: new Date(b.endDate) })
    );
    return booking || null;
  };

  const handleCellClick = (car: Car, date: Date, existingBooking: Booking | null) => {
    if (existingBooking) {
      alert(`This slot is already booked by: ${existingBooking.customerName} (${existingBooking.status})`);
      return;
    }
    // Open Modal
    setSelectedSlot({ car, date });
    setBlockEndDate(format(date, 'yyyy-MM-dd')); // Default to same day
  };

  const handleBlockConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setIsSubmitting(true);
    try {
      // Set times to start of day and end of day
      const start = new Date(selectedSlot.date);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(blockEndDate);
      end.setHours(23, 59, 59, 999);

      await adminApi.calendar.blockDate(
        selectedSlot.car.id,
        start.toISOString(),
        end.toISOString(),
        blockReason
      );

      await loadData(); // Refresh grid
      setSelectedSlot(null); // Close modal
    } catch (error) {
      alert('Failed to block dates. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-magnum-500" size={32} /></div>;

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-white">Availability Calendar</h1>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-400"><span className="w-3 h-3 bg-dark-700 border border-gray-700 rounded-sm"></span> Available</div>
          <div className="flex items-center gap-2 text-gray-400"><span className="w-3 h-3 bg-red-500/50 rounded-sm"></span> Booked</div>
          <div className="flex items-center gap-2 text-gray-400"><span className="w-3 h-3 bg-gray-500/50 rounded-sm"></span> Maintenance</div>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[1200px]">
            {/* Header Row */}
            <div className="flex border-b border-gray-800 bg-dark-900/50">
              <div className="w-56 p-4 text-gray-400 font-bold text-xs uppercase tracking-wider sticky left-0 bg-dark-900 z-10 border-r border-gray-800 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
                Vehicle Fleet
              </div>
              {daysInMonth.map(day => (
                <div key={day.toISOString()} className="flex-1 min-w-[40px] py-3 text-center border-l border-gray-800/50">
                  <div className="text-[10px] text-gray-500 uppercase font-bold">{format(day, 'EEE')}</div>
                  <div className={`text-sm font-bold mt-1 ${isWithinInterval(new Date(), {start: day, end: day}) ? 'text-magnum-500' : 'text-gray-300'}`}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>

            {/* Car Rows */}
            {cars.map(car => (
              <div key={car.id} className="flex border-b border-gray-800/50 hover:bg-dark-700/20 transition-colors group">
                <div className="w-56 p-4 sticky left-0 bg-dark-800 z-10 border-r border-gray-800 group-hover:bg-dark-800 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
                  <div className="font-bold text-white text-sm truncate">{car.name}</div>
                  <div className="text-xs text-magnum-500 mt-1 font-mono">{car.registrationNumber || 'No Reg #'}</div>
                </div>
                {daysInMonth.map(day => {
                  const booking = getStatusForDay(car.id, day);
                  let bgClass = 'hover:bg-magnum-500/10 cursor-pointer';
                  let content = null;
                  
                  if (booking) {
                    if (booking.status === 'Maintenance') {
                      bgClass = 'bg-gray-600/30 cursor-not-allowed striped-bg-gray';
                    } else {
                      bgClass = 'bg-red-500/30 cursor-pointer hover:bg-red-500/40 border-l border-red-500/20';
                    }
                  }

                  return (
                    <div 
                      key={day.toISOString()} 
                      onClick={() => handleCellClick(car, day, booking)}
                      className={`flex-1 min-w-[40px] border-l border-gray-800/30 transition-all relative ${bgClass}`}
                      title={booking ? `${booking.status}: ${booking.customerName}` : 'Click to block'}
                    >
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Block Date Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-800 rounded-xl border border-gray-700 w-full max-w-md shadow-2xl overflow-hidden transform transition-all scale-100">
            <div className="bg-dark-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-magnum-500" />
                Block Dates
              </h3>
              <button onClick={() => setSelectedSlot(null)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleBlockConfirm} className="p-6 space-y-5">
              <div className="bg-dark-900/50 p-4 rounded-lg border border-gray-800">
                <div className="text-sm text-gray-400 mb-1">Selected Vehicle</div>
                <div className="text-white font-bold text-lg">{selectedSlot.car.name}</div>
                <div className="text-xs text-magnum-500">{selectedSlot.car.registrationNumber}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Start Date</label>
                  <div className="bg-dark-900 border border-gray-700 rounded px-3 py-2 text-gray-300 text-sm">
                    {format(selectedSlot.date, 'dd MMM yyyy')}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">End Date</label>
                  <input 
                    type="date" 
                    required
                    min={format(selectedSlot.date, 'yyyy-MM-dd')}
                    value={blockEndDate}
                    onChange={(e) => setBlockEndDate(e.target.value)}
                    className="w-full bg-dark-900 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-magnum-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Reason</label>
                <select 
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full bg-dark-900 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-magnum-500 outline-none"
                >
                  <option value="Maintenance">Maintenance / Service</option>
                  <option value="Personal Use">Personal Use</option>
                  <option value="Repair">Repair Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-magnum-600 hover:bg-magnum-500 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-magnum-900/20 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Confirm Block'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
