import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Car, Bike, Plus, CheckCircle } from 'lucide-react';
import { toast } from "sonner@2.0.3";

// Use singleton Supabase client
import { supabase, api } from '../lib/supabase-client';

// Backend API base URL
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-b855a2f3`;

interface VehicleRegistrationProps {
  onVehicleAdded?: () => void;
}

export function VehicleRegistration({ onVehicleAdded }: VehicleRegistrationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: '',
    brand: '',
    model: '',
    year: new Date().getFullYear()
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vehicleNumber || !formData.vehicleType || !formData.brand || !formData.model) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.request('/vehicles/register', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      toast.success('Vehicle registered successfully! 🎉');
      setIsOpen(false);
      setFormData({
        vehicleNumber: '',
        vehicleType: '',
        brand: '',
        model: '',
        year: new Date().getFullYear()
      });
      
      if (onVehicleAdded) {
        onVehicleAdded();
      }
    } catch (error) {
      console.error('Vehicle registration error:', error);
      toast.error('Failed to register vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Register Vehicle
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-[#036b61]" />
            Register New Vehicle
          </DialogTitle>
          <DialogDescription>
            Add a new vehicle to your fleet and start earning Green Coins
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
            <Input
              id="vehicleNumber"
              placeholder="e.g., TS09EA1234"
              value={formData.vehicleNumber}
              onChange={(e) => handleInputChange('vehicleNumber', e.target.value.toUpperCase())}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="vehicleType">Vehicle Type *</Label>
            <Select value={formData.vehicleType} onValueChange={(value) => handleInputChange('vehicleType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twoWheeler">
                  <div className="flex items-center gap-2">
                    <Bike className="h-4 w-4" />
                    2-Wheeler
                  </div>
                </SelectItem>
                <SelectItem value="fourWheeler">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    4-Wheeler
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="brand">Brand *</Label>
            <Input
              id="brand"
              placeholder="e.g., Honda, Maruti, etc."
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="model">Model *</Label>
            <Input
              id="model"
              placeholder="e.g., Activa, Swift, etc."
              value={formData.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="year">Year</Label>
            <Select value={formData.year.toString()} onValueChange={(value) => handleInputChange('year', parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Benefits after registration:</span>
            </div>
            <ul className="text-xs text-blue-700 mt-1 ml-6 space-y-1">
              <li>• Earn 1 Green Coin per kilometer driven</li>
              <li>• Free engine maintenance eligibility</li>
              <li>• Priority booking for services</li>
              <li>• Exclusive discounts and offers</li>
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
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registering...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Register Vehicle
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}