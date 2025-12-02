import { supabase } from '../lib/supabase';
import { Car, Booking, City } from '../types';

// Helper to upload file
export const uploadFile = async (file: File, path: string) => {
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(path, file);
  
  if (error) throw new Error(error.message);
  
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(path);
    
  return publicUrl;
};

export const api = {
  cars: {
    list: async (cityId?: string): Promise<Car[]> => {
      let query = supabase.from('cars').select('*');
      if (cityId) {
        query = query.eq('city_id', cityId);
      }
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      
      // Map DB columns to frontend types
      return data.map((car: any) => ({
        ...car,
        cityId: car.city_id,
        price24h: car.price24h,
        price12h: car.price12h,
        registrationNumber: car.registration_number,
        // Map Owner Details
        ownerName: car.owner_name,
        ownerPhone: car.owner_phone,
        ownerSharePercentage: car.owner_share_percentage
      }));
    },
    get: async (id: string): Promise<Car | undefined> => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) return undefined;
      return {
        ...data,
        cityId: data.city_id,
        registrationNumber: data.registration_number,
        ownerName: data.owner_name,
        ownerPhone: data.owner_phone,
        ownerSharePercentage: data.owner_share_percentage
      };
    },
    // Admin functions
    create: async (car: Partial<Car>) => {
       // Implementation for admin add car
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
         is_available: car.isAvailable,
         // Owner details
         owner_name: car.ownerName || 'Magnum',
         owner_phone: car.ownerPhone || '7845012402',
         owner_share_percentage: car.ownerSharePercentage || 100
       };
       const { data, error } = await supabase.from('cars').insert(dbCar).select().single();
       if (error) throw new Error(error.message);
       return data;
    },
    delete: async (id: string) => {
      const { error } = await supabase.from('cars').delete().eq('id', id);
      if (error) throw new Error(error.message);
    }
  },
  bookings: {
    create: async (booking: any): Promise<Booking> => {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
            car_id: booking.carId,
            city_id: booking.cityId,
            customer_name: booking.customerName,
            phone: booking.phone,
            email: booking.email,
            occupation: booking.occupation,
            address: booking.address,
            start_date: booking.startDate,
            end_date: booking.endDate,
            total_amount: booking.totalAmount,
            status: 'Pending',
            id_proof_url: booking.idProofUrl,
            live_photo_url: booking.livePhotoUrl,
            signature_url: booking.signatureUrl
        })
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      return data;
    },
    list: async (): Promise<Booking[]> => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
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
        createdAt: b.created_at
      }));
    },
    updateStatus: async (id: string, status: Booking['status']): Promise<void> => {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);
      if (error) throw new Error(error.message);
    }
  },
  cities: {
    list: async (): Promise<City[]> => {
      const { data, error } = await supabase.from('cities').select('*').order('name');
      if (error) throw new Error(error.message);
      return data;
    }
  }
};
