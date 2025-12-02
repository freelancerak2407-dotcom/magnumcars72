import { supabase } from '../lib/supabase';
import { Car, Booking } from '../types';

// Admin Service Layer
export const adminApi = {
  stats: {
    getDashboardStats: async () => {
      const { data: bookings, error: bookingsError } = await supabase.from('bookings').select('*');
      if (bookingsError) throw new Error(bookingsError.message);

      const { data: cars, error: carsError } = await supabase.from('cars').select('*');
      if (carsError) throw new Error(carsError.message);
      
      const pending = bookings?.filter(b => b.status === 'Pending').length || 0;
      const approved = bookings?.filter(b => b.status === 'Approved').length || 0;
      const completed = bookings?.filter(b => b.status === 'Completed').length || 0;
      const revenue = bookings?.reduce((acc, b) => acc + (b.status === 'Completed' ? (b.total_amount || 0) : 0), 0) || 0;
      
      return {
        totalBookings: bookings?.length || 0,
        pending,
        approved,
        completed,
        totalRevenue: revenue,
        totalCars: cars?.length || 0,
        activeCars: cars?.filter(c => c.is_available).length || 0
      };
    }
  },
  
  cars: {
    create: async (car: Partial<Car>) => {
       const dbCar = {
         name: car.name,
         type: car.type,
         year: car.year,
         gear: car.gear,
         fuel: car.fuel,
         price24h: car.price24h,
         price12h: car.price12h,
         mileage: car.mileage,
         image: car.image,
         city_id: car.cityId,
         registration_number: car.registrationNumber,
         is_available: car.isAvailable !== undefined ? car.isAvailable : true,
         owner_name: car.ownerName || 'Magnum',
         owner_phone: car.ownerPhone || '7845012402',
         owner_share_percentage: car.ownerSharePercentage || 100
       };
       const { data, error } = await supabase.from('cars').insert(dbCar).select().single();
       if (error) throw new Error(error.message);
       return data;
    },
    update: async (id: string, updates: Partial<Car>) => {
       const dbUpdates: any = { ...updates };
       // Map frontend camelCase to DB snake_case
       if (updates.cityId) dbUpdates.city_id = updates.cityId;
       if (updates.registrationNumber) dbUpdates.registration_number = updates.registrationNumber;
       if (updates.isAvailable !== undefined) dbUpdates.is_available = updates.isAvailable;
       if (updates.ownerName) dbUpdates.owner_name = updates.ownerName;
       if (updates.ownerPhone) dbUpdates.owner_phone = updates.ownerPhone;
       if (updates.ownerSharePercentage !== undefined) dbUpdates.owner_share_percentage = updates.ownerSharePercentage;
       
       // Remove frontend keys
       delete dbUpdates.cityId;
       delete dbUpdates.registrationNumber;
       delete dbUpdates.isAvailable;
       delete dbUpdates.ownerName;
       delete dbUpdates.ownerPhone;
       delete dbUpdates.ownerSharePercentage;

       const { data, error } = await supabase.from('cars').update(dbUpdates).eq('id', id).select().single();
       if (error) throw new Error(error.message);
       return data;
    },
    delete: async (id: string) => {
      const { error } = await supabase.from('cars').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    
    // Specific method for revenue page to update share quickly
    updateOwnerShare: async (id: string, percentage: number) => {
      if (percentage < 0 || percentage > 100) throw new Error("Percentage must be between 0 and 100");
      
      const { error } = await supabase
        .from('cars')
        .update({ owner_share_percentage: percentage })
        .eq('id', id);
        
      if (error) throw new Error(error.message);
    }
  },

  bookings: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, cars(name, registration_number)')
        .order('created_at', { ascending: false });
        
      if (error) throw new Error(error.message);
      return data.map((b: any) => ({
        ...b,
        carId: b.car_id,
        cityId: b.city_id,
        customerName: b.customer_name,
        totalAmount: b.total_amount,
        startDate: b.start_date,
        endDate: b.end_date,
        idProofUrl: b.id_proof_url,
        livePhotoUrl: b.live_photo_url,
        signatureUrl: b.signature_url,
        createdAt: b.created_at,
        carName: b.cars?.name,
        carReg: b.cars?.registration_number
      }));
    },
    update: async (id: string, updates: any) => {
      const { error } = await supabase.from('bookings').update(updates).eq('id', id);
      if (error) throw new Error(error.message);
    },
    updateStatus: async (id: string, status: Booking['status']) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);
      if (error) throw new Error(error.message);
    }
  },
  
  calendar: {
    blockDate: async (carId: string, start: string, end: string, reason: string = 'Maintenance') => {
      // Fetch car to get valid city_id
      const { data: car, error: carError } = await supabase
        .from('cars')
        .select('city_id')
        .eq('id', carId)
        .single();
      
      if (carError) throw new Error(carError.message);

      // We create a "Maintenance" booking
      const { error } = await supabase.from('bookings').insert({
        car_id: carId,
        city_id: car.city_id,
        customer_name: 'ADMIN_BLOCK',
        phone: '0000000000',
        email: 'admin@magnum.com',
        occupation: 'Admin',
        address: 'Admin',
        start_date: start,
        end_date: end,
        total_amount: 0,
        status: reason // Using status to store "Maintenance" or "Blocked"
      });
      if (error) throw new Error(error.message);
    }
  }
};
