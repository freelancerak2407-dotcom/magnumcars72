import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import SignatureCanvas from 'react-signature-canvas';
import { differenceInHours } from 'date-fns';
import { api, uploadFile } from '../services/api';
import { Car } from '../types';
import { IndianRupee, Upload, Loader2 } from 'lucide-react';

export default function BookingPage() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const sigPad = useRef<any>(null);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  // File states
  const [idProof, setIdProof] = useState<File | null>(null);
  const [livePhoto, setLivePhoto] = useState<File | null>(null);

  useEffect(() => {
    if (carId) api.cars.get(carId).then(setCar);
  }, [carId]);

  const calculateTotal = () => {
    if (!startDate || !endDate || !car) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const hours = differenceInHours(end, start);
    
    if (hours <= 0) return 0;
    
    const days = Math.ceil(hours / 24);
    if (hours <= 12) return car.price12h;
    return days * car.price24h;
  };

  const totalAmount = calculateTotal();

  const onSubmit = async (data: any) => {
    if (!car) return;
    if (!idProof || !livePhoto) {
      alert('Please upload both ID Proof and Live Photo');
      return;
    }
    if (sigPad.current.isEmpty()) {
      alert('Please provide your signature');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Upload Files
      const timestamp = Date.now();
      const idProofUrl = await uploadFile(idProof, `id_proofs/${timestamp}_${data.phone}`);
      const livePhotoUrl = await uploadFile(livePhoto, `live_photos/${timestamp}_${data.phone}`);
      
      // 2. Upload Signature
      const signatureBlob = await new Promise(resolve => sigPad.current.toBlob(resolve));
      // @ts-ignore
      const signatureUrl = await uploadFile(signatureBlob, `signatures/${timestamp}_${data.phone}.png`);

      // 3. Create Booking
      const bookingData = {
        carId: car.id,
        cityId: car.cityId,
        ...data,
        totalAmount,
        idProofUrl,
        livePhotoUrl,
        signatureUrl
      };

      await api.bookings.create(bookingData);
      
      // 4. WhatsApp Notification
      const message = `New Booking Request!%0A%0ACar: ${car.name}%0ACustomer: ${data.customerName}%0APhone: ${data.phone}%0ADates: ${new Date(data.startDate).toLocaleString()} to ${new Date(data.endDate).toLocaleString()}%0ATotal: ₹${totalAmount}`;
      window.open(`https://wa.me/917845012402?text=${message}`, '_blank');
      
      alert('Booking Request Sent Successfully!');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!car) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-magnum-500" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-dark-800 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
        <div className="bg-dark-900 p-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold text-white">Booking Request</h1>
            <p className="text-magnum-400">{car.name} ({car.year})</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Total Estimate</div>
            <div className="text-2xl font-bold text-white flex items-center justify-end">
              <IndianRupee size={20} /> {totalAmount}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Start Date & Time</label>
              <input 
                type="datetime-local" 
                {...register('startDate', { required: true })}
                className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-magnum-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">End Date & Time</label>
              <input 
                type="datetime-local" 
                {...register('endDate', { required: true })}
                className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-magnum-500 outline-none"
              />
            </div>
          </div>

          {/* Personal Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Full Name" {...register('customerName', { required: true })} className="bg-dark-900 border border-gray-700 rounded-lg px-4 py-3 text-white" />
              <input placeholder="Phone Number" {...register('phone', { required: true })} className="bg-dark-900 border border-gray-700 rounded-lg px-4 py-3 text-white" />
              <input placeholder="Email" type="email" {...register('email', { required: true })} className="bg-dark-900 border border-gray-700 rounded-lg px-4 py-3 text-white" />
              <input placeholder="Occupation" {...register('occupation', { required: true })} className="bg-dark-900 border border-gray-700 rounded-lg px-4 py-3 text-white" />
            </div>
            <textarea placeholder="Full Address" {...register('address', { required: true })} className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-3 text-white h-24" />
          </div>

          {/* Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-magnum-500 transition-colors relative">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setIdProof(e.target.files?.[0] || null)}
                  accept="image/*"
                />
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-300">{idProof ? idProof.name : "Upload ID Proof (Aadhar/License)"}</p>
              </div>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-magnum-500 transition-colors relative">
                 <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setLivePhoto(e.target.files?.[0] || null)}
                  accept="image/*"
                />
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-300">{livePhoto ? livePhoto.name : "Upload Live Photo"}</p>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Digital Signature</h3>
            <div className="border border-gray-700 rounded-lg bg-white overflow-hidden">
              <SignatureCanvas 
                ref={sigPad}
                penColor="black"
                canvasProps={{width: 500, height: 150, className: 'sigCanvas w-full'}} 
              />
            </div>
            <button type="button" onClick={() => sigPad.current.clear()} className="text-xs text-red-400 mt-2 hover:underline">Clear Signature</button>
          </div>

          {/* T&C */}
          <div className="flex items-start gap-3 bg-magnum-900/10 p-4 rounded-lg border border-magnum-900/30">
            <input type="checkbox" {...register('terms', { required: true })} className="mt-1" />
            <div className="text-sm text-gray-300">
              I agree to the <span className="text-magnum-400 underline cursor-pointer">Terms and Conditions</span>. 
              I confirm that I hold a valid driving license.
            </div>
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className="w-full bg-magnum-600 hover:bg-magnum-500 disabled:bg-gray-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-magnum-900/20 transition-all flex justify-center items-center gap-2"
          >
            {submitting ? <Loader2 className="animate-spin" /> : 'Confirm Booking Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
