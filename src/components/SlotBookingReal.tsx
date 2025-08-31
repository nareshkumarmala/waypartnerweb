import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Calendar, Clock, Plus, Edit, Ban, Car, User, Coins, Search, Loader } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Real implementation with database integration
import { supabase } from '../lib/supabase-client';

interface Slot {
  id: string;
  date: string;
  time: string;
  vehicleNo?: string;
  owner?: string;
  phone?: string;
  service?: string;
  status: 'available' | 'booked' | 'blocked';
  booking_id?: string;
  green_coins_used?: number;
}

interface VehicleData {
  id: string;
  registration_number: string;
  owner_name: string;
  phone: string;
  green_coins_balance: number;
  last_service_date: string;
}

export function SlotBookingReal() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [vehicleSearching, setVehicleSearching] = useState(false);
  const [newBooking, setNewBooking] = useState({
    vehicleNo: '',
    owner: '',
    phone: '',
    service: '',
    greenCoins: 0,
    coinsToRedeem: 0
  });

  // 🔥 REAL DATABASE INTEGRATION
  useEffect(() => {
    loadTodaysSlots();
    
    // Real-time subscription for booking updates
    const subscription = supabase
      .channel('booking-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'service_bookings'
      }, (payload) => {
        console.log('Real-time booking update:', payload);
        loadTodaysSlots(); // Refresh slots on any booking change
        
        // Show notification for new bookings
        if (payload.eventType === 'INSERT') {
          toast.success(`New booking received: ${payload.new.vehicle_registration}`);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 📊 LOAD REAL SLOTS FROM DATABASE
  const loadTodaysSlots = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Generate time slots for today
      const timeSlots = [
        '09:00', '10:00', '11:00', '12:00', 
        '14:00', '15:00', '16:00', '17:00'
      ];

      // Get existing bookings from database
      const { data: bookings, error } = await supabase
        .from('service_bookings')
        .select(`
          id,
          booking_time,
          vehicle_registration,
          customer_name,
          customer_phone,
          service_type,
          green_coins_used,
          status
        `)
        .eq('booking_date', today);

      if (error) throw error;

      // Create slots array with booking data
      const slotsData = timeSlots.map(time => {
        const booking = bookings?.find(b => b.booking_time === time);
        
        if (booking) {
          return {
            id: time,
            date: today,
            time: time,
            vehicleNo: booking.vehicle_registration,
            owner: booking.customer_name,
            phone: booking.customer_phone,
            service: booking.service_type,
            status: 'booked' as const,
            booking_id: booking.id,
            green_coins_used: booking.green_coins_used
          };
        }
        
        return {
          id: time,
          date: today,
          time: time,
          status: 'available' as const
        };
      });

      setSlots(slotsData);
    } catch (error) {
      console.error('Error loading slots:', error);
      toast.error('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  // 🔍 REAL VEHICLE SEARCH
  const searchVehicle = async () => {
    if (!newBooking.vehicleNo.trim()) {
      toast.error('Please enter vehicle number');
      return;
    }

    setVehicleSearching(true);
    try {
      const { data: vehicle, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('registration_number', newBooking.vehicleNo.toUpperCase())
        .single();

      if (error) {
        // Vehicle not found, allow manual entry
        toast.info('Vehicle not found in database. Please enter details manually.');
        return;
      }

      // Auto-fill vehicle data
      setNewBooking(prev => ({
        ...prev,
        owner: vehicle.owner_name,
        phone: vehicle.phone,
        greenCoins: vehicle.green_coins_balance
      }));

      toast.success('Vehicle details loaded successfully!');
    } catch (error) {
      console.error('Vehicle search error:', error);
      toast.error('Error searching vehicle');
    } finally {
      setVehicleSearching(false);
    }
  };

  // 💾 REAL BOOKING CREATION
  const handleAddBooking = async (slot: Slot) => {
    if (!newBooking.vehicleNo || !newBooking.owner || !newBooking.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // 1. Create booking in database
      const { data: booking, error: bookingError } = await supabase
        .from('service_bookings')
        .insert({
          vehicle_registration: newBooking.vehicleNo.toUpperCase(),
          customer_name: newBooking.owner,
          customer_phone: newBooking.phone,
          service_type: newBooking.service,
          booking_date: slot.date,
          booking_time: slot.time,
          green_coins_used: newBooking.coinsToRedeem || 0,
          status: 'confirmed'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // 2. Update vehicle record if exists
      if (newBooking.coinsToRedeem > 0) {
        const { error: vehicleError } = await supabase
          .from('vehicles')
          .update({
            green_coins_balance: supabase.sql`green_coins_balance - ${newBooking.coinsToRedeem}`
          })
          .eq('registration_number', newBooking.vehicleNo.toUpperCase());

        if (vehicleError) console.error('Error updating coins:', vehicleError);
      }

      // 3. Send SMS notification (integrate with your SMS service)
      await sendBookingConfirmationSMS(booking);

      // 4. Update local state
      setSlots(prev => prev.map(s => 
        s.id === slot.id 
          ? { 
              ...s, 
              ...newBooking, 
              status: 'booked' as const,
              booking_id: booking.id 
            }
          : s
      ));

      // Reset form
      setNewBooking({ 
        vehicleNo: '', 
        owner: '', 
        phone: '', 
        service: '', 
        greenCoins: 0, 
        coinsToRedeem: 0 
      });
      setSelectedSlot(null);
      setIsAddSlotOpen(false);
      
      toast.success('Booking created successfully!');
    } catch (error) {
      console.error('Booking creation error:', error);
      toast.error('Failed to create booking');
    }
  };

  // 📱 SMS NOTIFICATION FUNCTION
  const sendBookingConfirmationSMS = async (booking: any) => {
    try {
      // This would integrate with your SMS service (Twilio, etc.)
      const smsData = {
        phone: booking.customer_phone,
        message: `Booking confirmed! Vehicle: ${booking.vehicle_registration}, Date: ${booking.booking_date}, Time: ${booking.booking_time}. Service: ${booking.service_type}. Thank you!`
      };

      // Call your SMS API
      await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smsData)
      });

      console.log('SMS sent successfully');
    } catch (error) {
      console.error('SMS sending failed:', error);
    }
  };

  // 🚫 REAL BOOKING CANCELLATION
  const handleCancelBooking = async (slot: Slot) => {
    if (!slot.booking_id) return;

    try {
      // 1. Delete booking from database
      const { error: deleteError } = await supabase
        .from('service_bookings')
        .delete()
        .eq('id', slot.booking_id);

      if (deleteError) throw deleteError;

      // 2. Refund green coins if used
      if (slot.green_coins_used && slot.green_coins_used > 0) {
        const { error: refundError } = await supabase
          .from('vehicles')
          .update({
            green_coins_balance: supabase.sql`green_coins_balance + ${slot.green_coins_used}`
          })
          .eq('registration_number', slot.vehicleNo);

        if (refundError) console.error('Error refunding coins:', refundError);
      }

      // 3. Update local state
      setSlots(prev => prev.map(s => 
        s.id === slot.id 
          ? { 
              id: s.id, 
              date: s.date, 
              time: s.time, 
              status: 'available' as const 
            }
          : s
      ));

      // 4. Send cancellation SMS
      if (slot.phone) {
        await sendCancellationSMS(slot);
      }

      toast.success('Booking cancelled successfully!');
    } catch (error) {
      console.error('Cancellation error:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const sendCancellationSMS = async (slot: Slot) => {
    try {
      const smsData = {
        phone: slot.phone,
        message: `Your booking for ${slot.vehicleNo} on ${slot.date} at ${slot.time} has been cancelled. Please contact us to reschedule.`
      };

      await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smsData)
      });
    } catch (error) {
      console.error('Cancellation SMS failed:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Available</Badge>;
      case 'booked':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Booked</Badge>;
      case 'blocked':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Blocked</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="h-8 w-8 animate-spin text-[#036b61]" />
        <span className="ml-2">Loading today's slots...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Real-Time Slot Booking</h1>
          <p className="text-gray-600 mt-1">Live booking management with database integration</p>
        </div>
      </div>

      {/* Real-time Status Indicator */}
      <Card className="rounded-xl shadow-lg border-l-4 border-l-green-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Live Data - Connected to Database</span>
          </div>
        </CardContent>
      </Card>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {slots.map((slot) => (
          <Card key={slot.id} className={`rounded-xl shadow-lg hover:shadow-xl transition-all border-l-4 ${
            slot.status === 'available' ? 'border-green-500' :
            slot.status === 'booked' ? 'border-blue-500' :
            'border-red-500'
          }`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{slot.time}</span>
                </div>
                {getStatusBadge(slot.status)}
              </div>

              {slot.status === 'booked' && (
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="h-3 w-3 text-gray-500" />
                    <span className="font-medium">{slot.vehicleNo}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-3 w-3 text-gray-500" />
                    <span>{slot.owner}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {slot.phone} • {slot.service}
                  </div>
                  {slot.green_coins_used && slot.green_coins_used > 0 && (
                    <div className="flex items-center gap-1 text-xs text-yellow-600">
                      <Coins className="h-3 w-3" />
                      {slot.green_coins_used} coins used
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                {slot.status === 'available' && (
                  <Button 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white"
                    onClick={() => {
                      setSelectedSlot(slot);
                      setIsAddSlotOpen(true);
                    }}
                  >
                    Book Slot
                  </Button>
                )}

                {slot.status === 'booked' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleCancelBooking(slot)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Booking Modal */}
      <Dialog open={isAddSlotOpen} onOpenChange={(open) => {
        setIsAddSlotOpen(open);
        if (!open) {
          setSelectedSlot(null);
          setNewBooking({ vehicleNo: '', owner: '', phone: '', service: '', greenCoins: 0, coinsToRedeem: 0 });
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Real Booking - {selectedSlot?.time}</DialogTitle>
            <DialogDescription>
              This will save to database and send SMS confirmation
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleNo">Vehicle Number *</Label>
              <div className="flex gap-2">
                <Input
                  id="vehicleNo"
                  placeholder="e.g., TS09EA1234"
                  value={newBooking.vehicleNo}
                  onChange={(e) => setNewBooking(prev => ({ ...prev, vehicleNo: e.target.value.toUpperCase() }))}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={searchVehicle}
                  disabled={vehicleSearching}
                >
                  {vehicleSearching ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500">Search will load existing customer data</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="owner">Customer Name *</Label>
              <Input
                id="owner"
                placeholder="Enter customer name"
                value={newBooking.owner}
                onChange={(e) => setNewBooking(prev => ({ ...prev, owner: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                value={newBooking.phone}
                onChange={(e) => setNewBooking(prev => ({ ...prev, phone: e.target.value }))}
              />
              <p className="text-xs text-gray-500">SMS confirmation will be sent to this number</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service">Service Type *</Label>
              <Select onValueChange={(value) => setNewBooking(prev => ({ ...prev, service: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2W Full Service">2W Full Service</SelectItem>
                  <SelectItem value="4W Full Service">4W Full Service</SelectItem>
                  <SelectItem value="Oil Change">Oil Change</SelectItem>
                  <SelectItem value="General Checkup">General Checkup</SelectItem>
                  <SelectItem value="Brake Service">Brake Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Enhanced Green Coins Section */}
            {newBooking.greenCoins > 0 && (
              <div className="space-y-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="h-4 w-4 text-yellow-600" />
                  <Label className="text-yellow-800">Customer's Green Coins</Label>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Available Balance:</span>
                  <Badge className="bg-yellow-100 text-yellow-800">{newBooking.greenCoins} coins</Badge>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coinsToRedeem">Redeem Coins (₹1 = 1 coin)</Label>
                  <Input
                    id="coinsToRedeem"
                    type="number"
                    min="0"
                    max={newBooking.greenCoins}
                    placeholder="Enter coins to redeem"
                    value={newBooking.coinsToRedeem || ''}
                    onChange={(e) => setNewBooking(prev => ({ 
                      ...prev, 
                      coinsToRedeem: parseInt(e.target.value) || 0 
                    }))}
                  />
                  <div className="text-xs text-green-600">
                    Discount: ₹{newBooking.coinsToRedeem} • Remaining: {newBooking.greenCoins - newBooking.coinsToRedeem} coins
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsAddSlotOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white"
                onClick={() => selectedSlot && handleAddBooking(selectedSlot)}
              >
                Save & Send SMS
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Summary with Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {slots.filter(s => s.status === 'available').length}
            </div>
            <p className="text-sm text-gray-600">Available Slots</p>
            <p className="text-xs text-gray-500 mt-1">Ready for booking</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {slots.filter(s => s.status === 'booked').length}
            </div>
            <p className="text-sm text-gray-600">Confirmed Bookings</p>
            <p className="text-xs text-gray-500 mt-1">SMS sent to customers</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {slots.reduce((sum, s) => sum + (s.green_coins_used || 0), 0)}
            </div>
            <p className="text-sm text-gray-600">Coins Redeemed Today</p>
            <p className="text-xs text-gray-500 mt-1">₹{slots.reduce((sum, s) => sum + (s.green_coins_used || 0), 0)} discount given</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}