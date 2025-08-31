import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Coins, TrendingUp } from 'lucide-react';
import { toast } from "sonner@2.0.3";

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

interface AddKilometersProps {
  onKilometersAdded?: () => void;
}

export function AddKilometers({ onKilometersAdded }: AddKilometersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [kilometers, setKilometers] = useState('');

  // Fetch user's vehicles when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchVehicles();
    }
  }, [isOpen]);

  const fetchVehicles = async () => {
    try {
      const response = await api.request('/vehicles');
      setVehicles(response.vehicles || []);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
      toast.error('Failed to load vehicles');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVehicle || !kilometers || parseInt(kilometers) <= 0) {
      toast.error('Please select a vehicle and enter valid kilometers');
      return;
    }

    const kms = parseInt(kilometers);
    if (kms > 10000) {
      toast.error('Maximum 10,000 km can be added at once');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.request('/coins/add-kms', {
        method: 'POST',
        body: JSON.stringify({
          vehicleId: selectedVehicle,
          kms: kms
        }),
      });

      toast.success(`🎉 ${kms} km added! Earned ${kms} Green Coins`, {
        description: `New balance: ${response.greenCoins} coins`
      });
      
      setIsOpen(false);
      setSelectedVehicle('');
      setKilometers('');
      
      if (onKilometersAdded) {
        onKilometersAdded();
      }
    } catch (error) {
      console.error('Add kilometers error:', error);
      toast.error('Failed to add kilometers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedVehicleInfo = () => {
    if (!selectedVehicle) return null;
    return vehicles.find(v => v.id === selectedVehicle);
  };

  const getCoinsToEarn = () => {
    const kms = parseInt(kilometers) || 0;
    return kms; // 1 coin per km
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-[#036b61] text-[#036b61] hover:bg-[#036b61]/10">
          <Plus className="h-4 w-4 mr-2" />
          Add Kilometers
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#036b61]" />
            Add Kilometers
          </DialogTitle>
          <DialogDescription>
            Update your vehicle's mileage and earn Green Coins
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vehicle">Select Vehicle *</Label>
            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">
                    No vehicles found. Please register a vehicle first.
                  </div>
                ) : (
                  vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{vehicle.vehicleNumber}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {vehicle.brand} {vehicle.model}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          {getSelectedVehicleInfo() && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm">
                <p className="font-medium">{getSelectedVehicleInfo()?.vehicleNumber}</p>
                <p className="text-gray-600">
                  {getSelectedVehicleInfo()?.brand} {getSelectedVehicleInfo()?.model}
                </p>
                <p className="text-xs text-gray-500">
                  Current: {getSelectedVehicleInfo()?.totalKms.toLocaleString()} km
                </p>
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="kilometers">Kilometers Driven *</Label>
            <Input
              id="kilometers"
              type="number"
              placeholder="Enter kilometers"
              value={kilometers}
              onChange={(e) => setKilometers(e.target.value)}
              min="1"
              max="10000"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum 10,000 km can be added at once
            </p>
          </div>
          
          {kilometers && parseInt(kilometers) > 0 && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-sm text-green-800">
                <Coins className="h-4 w-4" />
                <span className="font-medium">
                  You'll earn {getCoinsToEarn()} Green Coins
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                1 kilometer = 1 Green Coin
              </p>
            </div>
          )}
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 mb-1">How it works:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Drive your vehicle and track kilometers</li>
              <li>• Earn 1 Green Coin for every kilometer</li>
              <li>• Use coins for free services and discounts</li>
              <li>• Accurate reporting helps maintain your vehicle</li>
            </ul>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white"
              disabled={loading || vehicles.length === 0}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Coins className="h-4 w-4 mr-2" />
                  Add & Earn Coins
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}