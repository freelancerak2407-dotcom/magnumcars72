import { Car, City } from '../types';

export const CITIES: City[] = [
  { id: 'tirunelveli', name: 'Tirunelveli (Head Office)', active: true },
  { id: 'tenkasi', name: 'Tenkasi', active: false }, // Admin to add manually
  { id: 'tuticorin', name: 'Tuticorin', active: false }, // Admin to add manually
  { id: 'kanyakumari', name: 'Kanyakumari', active: false }, // Admin to add manually
];

export const INITIAL_CARS: Car[] = [
  // 4 SEATER CARS
  {
    id: 'c1', name: 'Maruti Suzuki Alto', year: 2018, type: '4 Seater',
    gear: 'Manual', fuel: 'Petrol', price24h: 1800, price12h: 1600, mileage: '20–24 KMPL',
    cityId: 'tirunelveli', isAvailable: true,
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c2', name: 'Maruti Suzuki Celerio', year: 2025, type: '4 Seater',
    gear: 'Automatic', fuel: 'Petrol', price24h: 2400, price12h: 2000, mileage: '20–24 KMPL',
    cityId: 'tirunelveli', isAvailable: true,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c3', name: 'Maruti Suzuki Swift', year: 2025, type: '4 Seater',
    gear: 'Manual', fuel: 'Petrol', price24h: 2400, price12h: 2200, mileage: '20–24 KMPL',
    cityId: 'tirunelveli', isAvailable: true,
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c4', name: 'Hyundai i10 Nios', year: 2025, type: '4 Seater',
    gear: 'Manual', fuel: 'Petrol', price24h: 2200, price12h: 2400, mileage: '18–23 KMPL',
    cityId: 'tirunelveli', isAvailable: true,
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c5', name: 'Maruti Suzuki Ignis', year: 2019, type: '4 Seater',
    gear: 'Automatic', fuel: 'Petrol', price24h: 2000, price12h: 2200, mileage: '18–23 KMPL',
    cityId: 'tirunelveli', isAvailable: true,
    image: 'https://images.unsplash.com/photo-1626847037657-fd3622613ce3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c6', name: 'Honda Amaze', year: 2015, type: '4 Seater',
    gear: 'Manual', fuel: 'Diesel', price24h: 2200, price12h: 2000, mileage: '18–23 KMPL',
    cityId: 'tirunelveli', isAvailable: true,
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c7', name: 'Maruti Suzuki Dzire', year: 2019, type: '4 Seater',
    gear: 'Automatic', fuel: 'Petrol', price24h: 2400, price12h: 2200, mileage: '16–20 KMPL',
    cityId: 'tirunelveli', isAvailable: true,
    image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c8', name: 'Maruti Suzuki Dzire', year: 2024, type: '4 Seater',
    gear: 'Manual', fuel: 'Petrol', price24h: 2700, price12h: 2500, mileage: '18–23 KMPL',
    cityId: 'tirunelveli', isAvailable: true,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c9', name: 'Maruti Suzuki Baleno', year: 2024, type: '4 Seater',
    gear: 'Manual', fuel: 'Petrol', price24h: 2700, price12h: 2500, mileage: '18–23 KMPL',
    cityId: 'tirunelveli', isAvailable: true,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c10', name: 'Nissan Magnite', year: 2024, type: '4 Seater',
    gear: 'Manual', fuel: 'Petrol', price24h: 2700, price12h: 2500, mileage: '17–19 KMPL',
    cityId: 'tirunelveli', isAvailable: true,
    image: 'https://images.unsplash.com/photo-1606152421811-aa81130ce0a9?auto=format&fit=crop&q=80&w=800'
  },
  // 6/7 SEATER CARS
  {
    id: 'c11', name: 'Maruti Suzuki Ertiga', year: 2024, type: '6/7 Seater',
    gear: 'Manual', fuel: 'Petrol', price24h: 3800, price12h: 3500, mileage: '13–16 KMPL',
    cityId: 'tirunelveli', isAvailable: true,
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c12', name: 'Maruti Suzuki XL6', year: 2023, type: '6/7 Seater',
    gear: 'Automatic', fuel: 'Petrol', price24h: 4000, price12h: 3800, mileage: '13–16 KMPL',
    cityId: 'tirunelveli', isAvailable: true,
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c13', name: 'KIA Carens', year: 2025, type: '6/7 Seater',
    gear: 'Manual', fuel: 'Petrol', price24h: 4500, price12h: 4000, mileage: '15–19 KMPL',
    cityId: 'tirunelveli', isAvailable: true,
    image: 'https://images.unsplash.com/photo-1678725164647-82d44c322177?auto=format&fit=crop&q=80&w=800'
  },
];
