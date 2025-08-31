import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Calendar, Clock, Plus, Edit, Ban, Car, User, Coins, Search, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { WayPartnerAPI, RealTimeSubscriptions, NotificationHelper } from '../lib/supabase-client';

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
  registration_number: string;
  owner_name: string;
  phone: string;
  green_coins_balance: number;
}

export function SlotBooking() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [vehicleSearching, setVehicleSearching] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  
  const [newBooking, setNewBooking] = useState({
    vehicleNo: '',
    owner: '',
    phone: '',
    service: '',
    greenCoins: 0,
    coinsToRedeem: 0
  });

  // Initialize component
  useEffect(() => {
    initializeComponent();
    
    return () => {
      RealTimeSubscriptions.unsubscribeAll();
    };
  }, []);

  const initializeComponent = async () => {
    try {
      // Request notification permission
      await NotificationHelper.requestPermission();
      
      // Load today's slots
      await loadTodaysSlots();
      
      // Setup real-time subscriptions
      setupRealTimeSubscriptions();
      
      // Check backend health
      await checkBackendHealth();
      
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Initialization failed:', error);
      setConnectionStatus('disconnected');
      toast.error('Failed to connect to backend services');
    }
  };

  const checkBackendHealth = async () => {
    try {
      const health = await WayPartnerAPI.healthCheck();
      console.log('Backend health:', health);
      
      if (health.status === 'healthy') {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('connected'); // Still connected, just might be demo
      }
    } catch (error) {
      console.warn('Backend health check failed:', error);
      setConnectionStatus('disconnected');
    }
  };

  const setupRealTimeSubscriptions = () => {
    try {
      // Subscribe to booking changes
      RealTimeSubscriptions.subscribeToBookings((payload) => {
        console.log('Real-time booking update:', payload);
        
        if (payload.eventType === 'INSERT') {
          // New booking notification
          NotificationHelper.showBookingNotification(
            payload.new?.vehicle_registration || 'Unknown',
            payload.new?.service_type || 'Unknown Service'
          );
          
          // Refresh slots
          loadTodaysSlots();
          
          toast.success(`New booking: ${payload.new?.vehicle_registration || 'Unknown'}`);
        } else if (payload.eventType === 'DELETE') {
          // Booking cancelled
          loadTodaysSlots();
          toast.info('Booking cancelled');
        }
      });
    } catch (error) {
      console.warn('Failed to setup real-time subscriptions:', error);
    }
  };

  const loadTodaysSlots = async () => {
    try {
      setLoading(true);
      const response = await WayPartnerAPI.getTodayBookings();
      
      if (response.success) {
        setSlots(response.slots);
        setConnectionStatus('connected');
      } else {
        throw new Error(response.error || 'Failed to load slots');
      }
    } catch (error) {
      console.error('Error loading slots:', error);
      setConnectionStatus('disconnected');
      toast.error('Failed to load today\'s slots - using demo data');
      
      // Fallback to demo data if backend fails
      setSlots(generateFallbackSlots());
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackSlots = (): Slot[] => {
    const today = new Date().toISOString().split('T')[0];
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
    
    return timeSlots.map(time => ({
      id: time,
      date: today,
      time: time,
      status: 'available' as const
    }));
  };

  const searchVehicle = async () => {
    if (!newBooking.vehicleNo.trim()) {
      toast.error('Please enter vehicle number');
      return;
    }

    setVehicleSearching(true);
    try {
      const response = await WayPartnerAPI.searchVehicle(newBooking.vehicleNo.toUpperCase());
      
      if (response.success && response.vehicle) {
        const vehicle: VehicleData = response.vehicle;
        
        setNewBooking(prev => ({
          ...prev,
          owner: vehicle.owner_name,
          phone: vehicle.phone,
          greenCoins: vehicle.green_coins_balance
        }));
        
        toast.success('Vehicle details loaded successfully!');
      } else {
        toast.info('Vehicle not found in database. Please enter details manually.');
      }
    } catch (error) {
      console.error('Vehicle search error:', error);
      toast.error('Error searching vehicle. Please enter details manually.');
    } finally {
      setVehicleSearching(false);
    }
  };

  const handleAddBooking = async (slot: Slot) => {
    if (!newBooking.vehicleNo || !newBooking.owner || !newBooking.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!newBooking.service) {
      toast.error('Please select service type');
      return;
    }

    if (newBooking.coinsToRedeem > newBooking.greenCoins) {
      toast.error('Cannot redeem more coins than available');
      return;
    }

    setBookingInProgress(true);
    try {
      const bookingData = {
        vehicleRegistration: newBooking.vehicleNo.toUpperCase(),
        customerName: newBooking.owner,
        customerPhone: newBooking.phone,
        serviceType: newBooking.service,
        bookingDate: slot.date,
        bookingTime: slot.time,
        greenCoinsUsed: newBooking.coinsToRedeem || 0
      };

      const response = await WayPartnerAPI.createBooking(bookingData);
      
      if (response.success) {
        // Update local state immediately for responsive UI
        setSlots(prev => prev.map(s => 
          s.id === slot.id 
            ? { 
                ...s, 
                vehicleNo: newBooking.vehicleNo,
                owner: newBooking.owner,
                phone: newBooking.phone,
                service: newBooking.service,
                status: 'booked' as const,
                booking_id: response.booking?.id || `booking_${Date.now()}`,
                green_coins_used: newBooking.coinsToRedeem 
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
        
        toast.success('Booking created successfully! WhatsApp confirmation sent.');
      } else {
        throw new Error(response.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking creation error:', error);
      
      if (error instanceof Error && error.message.includes('already booked')) {
        toast.error('This time slot is already booked. Please choose another time.');
      } else {
        toast.error('Failed to create booking. Please try again.');
      }
    } finally {
      setBookingInProgress(false);
    }
  };

  const handleCancelBooking = async (slot: Slot) => {
    if (!slot.booking_id) {
      toast.error('Booking ID not found');
      return;
    }

    try {
      const response = await WayPartnerAPI.cancelBooking(slot.booking_id);
      
      if (response.success) {
        // Update local state
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
        
        toast.success('Booking cancelled successfully! Green coins refunded.');
      } else {
        throw new Error(response.error || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      toast.error('Failed to cancel booking. Please try again.');
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-[#036b61] mx-auto mb-4" />
          <p className="text-gray-600">Loading today's slots...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Connection Status */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Slot Booking Management</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-600">Book slots for customers and manage availability</p>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
                connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                'bg-red-500'
              }`}></div>
              <span className={`text-xs ${
                connectionStatus === 'connected' ? 'text-green-600' :
                connectionStatus === 'connecting' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {connectionStatus === 'connected' ? 'Live' :
                 connectionStatus === 'connecting' ? 'Connecting' :
                 'Offline'}
              </span>
            </div>
          </div>
        </div>
        
        <Button 
          className="bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white hover:shadow-lg transition-all"
          onClick={loadTodaysSlots}
          disabled={loading}
        >
          {loading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
          Refresh Slots
        </Button>
      </div>

      {/* Real-time Status Card */}
      <Card className={`rounded-xl shadow-lg border-l-4 ${
        connectionStatus === 'connected' ? 'border-l-green-500' :
        connectionStatus === 'connecting' ? 'border-l-yellow-500' :
        'border-l-red-500'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {connectionStatus === 'connected' ? 
                <CheckCircle className="h-5 w-5 text-green-600" /> :
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              }
              <div>
                <p className="font-medium">
                  {connectionStatus === 'connected' ? 'Real-time Data Active' :
                   connectionStatus === 'connecting' ? 'Connecting to Database' :
                   'Using Offline Mode'}
                </p>
                <p className="text-sm text-gray-600">
                  {connectionStatus === 'connected' ? 'Live bookings, WhatsApp notifications, and instant updates' :
                   connectionStatus === 'connecting' ? 'Establishing connection...' :
                   'Limited functionality available'}
                </p>
              </div>
            </div>
            {connectionStatus === 'connected' && (
              <Badge className="bg-green-100 text-green-800">
                Production Ready
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Date Filter */}
      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#036b61]" />
            Today's Slots - {formatDate(new Date().toISOString().split('T')[0])}
          </CardTitle>
        </CardHeader>
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
                    disabled={connectionStatus === 'disconnected'}
                  >
                    Book Slot
                  </Button>
                )}

                {slot.status === 'booked' && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleCancelBooking(slot)}
                      disabled={connectionStatus === 'disconnected'}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="p-2"
                      disabled={connectionStatus === 'disconnected'}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </>
                )}

                <Button 
                  size="sm" 
                  variant="outline"
                  className={`p-2 ${slot.status === 'blocked' ? 'text-green-600' : 'text-red-600'}`}
                  onClick={() => {
                    // Block/unblock slot functionality
                    toast.info('Block/unblock functionality coming soon!');
                  }}
                  disabled={connectionStatus === 'disconnected'}
                >
                  <Ban className="h-3 w-3" />
                </Button>
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
            <DialogTitle>Create Booking - {selectedSlot?.time}</DialogTitle>
            <DialogDescription>
              Real-time booking with WhatsApp confirmation
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
                  disabled={vehicleSearching || !newBooking.vehicleNo}
                >
                  {vehicleSearching ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500">Search loads existing customer data and green coins</p>
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
              <p className="text-xs text-gray-500">WhatsApp confirmation will be sent to this number</p>
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
                disabled={bookingInProgress}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white"
                onClick={() => selectedSlot && handleAddBooking(selectedSlot)}
                disabled={bookingInProgress || connectionStatus === 'disconnected'}
              >
                {bookingInProgress ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Booking'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Summary with Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <p className="text-xs text-gray-500 mt-1">WhatsApp sent to customers</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {slots.reduce((sum, s) => sum + (s.green_coins_used || 0), 0)}
            </div>
            <p className="text-sm text-gray-600">Coins Redeemed</p>
            <p className="text-xs text-gray-500 mt-1">₹{slots.reduce((sum, s) => sum + (s.green_coins_used || 0), 0)} discount given</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {connectionStatus === 'connected' ? '🟢' : connectionStatus === 'connecting' ? '🟡' : '🔴'}
            </div>
            <p className="text-sm text-gray-600">System Status</p>
            <p className="text-xs text-gray-500 mt-1">
              {connectionStatus === 'connected' ? 'All services online' :
               connectionStatus === 'connecting' ? 'Connecting...' :
               'Limited functionality'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}