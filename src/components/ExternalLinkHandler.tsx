import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, Clock, MapPin, Car, Bike } from 'lucide-react';
import { Screen } from '../App';

interface ExternalLinkHandlerProps {
  onNavigate: (screen: Screen) => void;
}

export function ExternalLinkHandler({ onNavigate }: ExternalLinkHandlerProps) {
  const [linkData, setLinkData] = useState<{
    vehicleType: '2-wheeler' | '4-wheeler';
    vehicleNumber: string;
    greenCoinsEarned: number;
    freeServiceType: string;
    validUntil: string;
  } | null>(null);

  useEffect(() => {
    // Simulate checking for external link parameters
    const urlParams = new URLSearchParams(window.location.search);
    const externalToken = urlParams.get('token');
    const vehicleType = urlParams.get('vehicleType') as '2-wheeler' | '4-wheeler';
    
    if (externalToken && vehicleType) {
      // Simulate fetching data based on token
      setLinkData({
        vehicleType: vehicleType,
        vehicleNumber: vehicleType === '2-wheeler' ? 'AP 39 XX 1234' : 'AP 39 YY 5678',
        greenCoinsEarned: vehicleType === '2-wheeler' ? 1250 : 2800,
        freeServiceType: 'Engine Maintenance',
        validUntil: '2024-02-15'
      });
    }
  }, []);

  if (!linkData) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3>No Active Free Service Link</h3>
            <p className="text-gray-600 mt-2">
              Please use the link provided from your Green Coins app when you complete your target.
            </p>
            <Button 
              className="mt-4 bg-gradient-to-r from-[#036b61] to-[#4aa370] hover:from-[#025850] hover:to-[#3d8f5f]"
              onClick={() => onNavigate('dashboard')}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {linkData.vehicleType === '2-wheeler' ? (
              <Bike className="h-16 w-16 text-[#036b61]" />
            ) : (
              <Car className="h-16 w-16 text-[#036b61]" />
            )}
          </div>
          <CardTitle className="text-2xl">🎉 Congratulations!</CardTitle>
          <p className="text-gray-600">You've earned a free service!</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5" />
              <span>Free Service Eligible</span>
            </div>
            <h3 className="text-xl">{linkData.freeServiceType}</h3>
            <p className="text-sm opacity-90">Completely FREE - No charges</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Vehicle:</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{linkData.vehicleType}</Badge>
                <span>{linkData.vehicleNumber}</span>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Green Coins Used:</span>
              <span className="text-green-600">{linkData.greenCoinsEarned} coins</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Valid Until:</span>
              <span className="text-red-600">{linkData.validUntil}</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h4 className="text-sm">Important Note:</h4>
            <p className="text-sm text-gray-600 mt-1">
              This covers only <strong>{linkData.freeServiceType}</strong>. Additional services (if needed) will be offered with special discounts.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-[#036b61] to-[#4aa370] hover:from-[#025850] hover:to-[#3d8f5f]"
              onClick={() => onNavigate('slot-booking')}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Book Service Slot
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onNavigate('dashboard')}
            >
              View Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}