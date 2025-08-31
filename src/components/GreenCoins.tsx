import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp, Car, Clock, Gift, ArrowRight, Plus, RefreshCw, Target, CheckCircle, MapPin, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from "sonner@2.0.3";
import { ImageWithFallback } from './figma/ImageWithFallback';

// Use singleton Supabase client
import { supabase, api } from '../lib/supabase-client';

interface Vehicle {
  id: string;
  vehicleNumber: string;
  vehicleType: 'twoWheeler' | 'fourWheeler';
  brand: string;
  model: string;
  totalKms: number;
}

interface GreenCoinsData {
  greenCoins: number;
  totalKms: number;
}

interface ServiceCenter {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  services: string[];
  slots: string[];
  image: string;
}

interface GreenCoinsProps {
  onNavigate: (screen: any) => void;
}

export function GreenCoins({ onNavigate }: GreenCoinsProps) {
  const [currentBalance] = useState(1850);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<ServiceCenter | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const bikeTarget = 1500;
  const carTargetMin = 6500;
  const carTargetMax = 8500;

  const transactionHistory = [
    { id: '1', type: 'earned', amount: 5, description: '2W Service Completed', date: '2025-08-16', time: '14:30' },
    { id: '2', type: 'earned', amount: 10, description: '4W Service Completed', date: '2025-08-16', time: '11:15' },
    { id: '3', type: 'redeemed', amount: -50, description: 'Redeemed at AutoCare Center', date: '2025-08-15', time: '16:20' },
    { id: '4', type: 'earned', amount: 5, description: 'Timely Service Bonus', date: '2025-08-15', time: '09:45' },
    { id: '5', type: 'earned', amount: 15, description: 'EV Service Premium', date: '2025-08-14', time: '13:00' },
  ];

  const nearbyServiceCenters: ServiceCenter[] = [
    {
      id: '1',
      name: 'AutoCare Service Hub',
      address: '123 MG Road, Pune',
      distance: '2.5 km',
      rating: 4.8,
      services: ['2W', '4W', 'EV'],
      slots: ['10:00 AM', '2:00 PM', '4:00 PM'],
      image: 'https://images.unsplash.com/photo-1698998882494-57c3e043f340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwc2VydmljZSUyMG1lY2hhbmljJTIwd29ya3Nob3B8ZW58MXx8fHwxNzU1MzE3MjU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '2',
      name: 'Elite Motors Service',
      address: '456 FC Road, Pune',
      distance: '3.1 km',
      rating: 4.6,
      services: ['2W', '4W'],
      slots: ['11:00 AM', '1:00 PM', '5:00 PM'],
      image: 'https://images.unsplash.com/photo-1583773192617-ff7374bc5844?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjYXIlMjBpbnNwZWN0aW9uJTIwYXV0b21vdGl2ZSUyMHNlcnZpY2V8ZW58MXx8fHwxNzU1MzE3MjU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '3',
      name: 'TechDrive Solutions',
      address: '789 JM Road, Pune',
      distance: '4.2 km',
      rating: 4.9,
      services: ['4W', 'EV'],
      slots: ['9:00 AM', '3:00 PM', '6:00 PM'],
      image: 'https://images.unsplash.com/photo-1655754334636-800032b58c47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxhdXRvbW90aXZlJTIwZ2FyYWdlJTIwdG9vbHN8ZW58MXx8fHwxNzU1MzE3MjYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  const handleRedeem = () => {
    if (currentBalance < 100) {
      toast.error('Minimum 100 coins required for redemption');
      return;
    }
    setIsRedeemModalOpen(true);
  };

  const handleSelectCenter = (center: ServiceCenter) => {
    setSelectedCenter(center);
    setIsRedeemModalOpen(false);
    setIsBookingModalOpen(true);
  };

  const handleBookSlot = () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }

    // Simulate booking success with animation
    setIsBookingModalOpen(false);
    
    // Show success animation
    toast.success('🎉 Coins redeemed successfully! Slot booked for tomorrow.', {
      duration: 4000,
      description: `${selectedCenter?.name} - ${selectedSlot}`
    });

    // Simulate coins deduction
    setTimeout(() => {
      toast.info(`-100 Green Coins deducted. New balance: ${currentBalance - 100} coins`);
      // Reset selections
      setSelectedCenter(null);
      setSelectedSlot('');
      // Navigate back to dashboard after successful booking
      setTimeout(() => onNavigate('dashboard'), 2000);
    }, 1500);
  };

  const getBikeProgress = () => Math.min((currentBalance / bikeTarget) * 100, 100);
  const getCarProgress = () => Math.min((currentBalance / carTargetMin) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Green Coins</h1>
        <p className="text-gray-600 mt-1">Earn and redeem coins for vehicle services</p>
      </div>

      {/* Balance & Targets */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current Balance */}
        <Card className="rounded-xl shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coins className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{currentBalance.toLocaleString()}</div>
            <p className="text-gray-600">Green Coins Balance</p>
            
            <Button 
              className="mt-4 bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white hover:shadow-lg transition-all"
              onClick={handleRedeem}
              disabled={currentBalance < 100}
            >
              <Gift className="h-4 w-4 mr-2" />
              Redeem Coins
            </Button>
          </CardContent>
        </Card>

        {/* Bike Target */}
        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium">2W Service Target</h3>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {getBikeProgress().toFixed(0)}%
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Current: {currentBalance}</span>
                <span>Target: {bikeTarget}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${getBikeProgress()}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600">
                {currentBalance >= bikeTarget ? '✅ Target achieved!' : `${bikeTarget - currentBalance} coins to go`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Car Target */}
        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                <h3 className="font-medium">4W Service Target</h3>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {getCarProgress().toFixed(0)}%
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Current: {currentBalance}</span>
                <span>Target: {carTargetMin}-{carTargetMax}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${getCarProgress()}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600">
                {currentBalance >= carTargetMin ? '✅ Target achieved!' : `${carTargetMin - currentBalance} coins to go`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules */}
      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-[#036b61]" />
            Green Coins Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">How to Earn</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  1 timely service = 5 Green Coins
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Quality service bonus = +2 Extra Coins
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  EV service premium = +5 Extra Coins
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Customer 5-star rating = +3 Bonus Coins
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Redemption Benefits</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-blue-500" />
                  100 Coins = Free slot booking
                </li>
                <li className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-blue-500" />
                  500 Coins = 10% service discount
                </li>
                <li className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-blue-500" />
                  1000 Coins = Premium service upgrade
                </li>
                <li className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-blue-500" />
                  2000 Coins = Free annual membership
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#036b61]" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactionHistory.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'earned' ? (
                      <Coins className="h-4 w-4 text-green-600" />
                    ) : (
                      <Gift className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.date} at {transaction.time}</p>
                  </div>
                </div>
                <div className={`font-medium ${
                  transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'earned' ? '+' : ''}{transaction.amount} coins
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Redeem Modal - Service Centers */}
      <Dialog open={isRedeemModalOpen} onOpenChange={setIsRedeemModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#036b61]" />
              Select Service Center
            </DialogTitle>
            <DialogDescription>
              Choose a nearby service center to redeem your coins and book a slot.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Choose a nearby service center to redeem your coins and book a slot.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nearbyServiceCenters.map((center) => (
                <Card key={center.id} className="rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-[#036b61]">
                  <CardContent className="p-0">
                    <ImageWithFallback
                      src={center.image}
                      alt={center.name}
                      className="w-full h-32 object-cover rounded-t-xl"
                    />
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{center.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {center.address}
                        </p>
                        <p className="text-sm text-gray-500">{center.distance}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{center.rating}</span>
                        </div>
                        <div className="flex gap-1">
                          {center.services.map(service => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Available Slots:</p>
                        <div className="flex gap-1 flex-wrap">
                          {center.slots.map(slot => (
                            <Badge key={slot} variant="outline" className="text-xs bg-green-50 text-green-700">
                              {slot}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white"
                        onClick={() => handleSelectCenter(center)}
                      >
                        Select & Book
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Slot Booking</DialogTitle>
            <DialogDescription>
              Review your selection and confirm the booking details
            </DialogDescription>
          </DialogHeader>
          
          {selectedCenter && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">{selectedCenter.name}</h3>
                <p className="text-sm text-gray-600">{selectedCenter.address}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{selectedCenter.rating} rating</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Select Time Slot</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {selectedCenter.slots.map(slot => (
                    <Button
                      key={slot}
                      variant={selectedSlot === slot ? "default" : "outline"}
                      className={selectedSlot === slot ? "bg-gradient-to-r from-[#036b61] to-[#4aa370]" : ""}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 text-sm">
                  <Coins className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">100 Green Coins will be deducted</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  New balance: {currentBalance - 100} coins
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsBookingModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white"
                  onClick={handleBookSlot}
                  disabled={!selectedSlot}
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}