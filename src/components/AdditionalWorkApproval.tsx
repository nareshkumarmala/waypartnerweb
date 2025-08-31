import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  IndianRupee, 
  Percent,
  Clock,
  FileText,
  Phone
} from 'lucide-react';
import { AdditionalWork } from '../App';
import { toast } from 'sonner@2.0.3';

export function AdditionalWorkApproval() {
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  
  // Mock data for demonstration
  const [additionalWorks, setAdditionalWorks] = useState<AdditionalWork[]>([
    {
      id: '1',
      serviceName: 'Brake Pad Replacement',
      description: 'Replace worn brake pads - Recommended for safety',
      originalPrice: 1200,
      discountedPrice: 800,
      discountPercentage: 33,
      isApproved: false,
      notes: 'Brake pads are 80% worn and need immediate replacement for safety'
    },
    {
      id: '2',
      serviceName: 'Air Filter Replacement',
      description: 'Replace clogged air filter for better performance',
      originalPrice: 300,
      discountedPrice: 200,
      discountPercentage: 33,
      isApproved: false,
      notes: 'Current filter is heavily clogged, affecting engine performance'
    },
    {
      id: '3',
      serviceName: 'Engine Oil Top-up',
      description: 'Additional engine oil required',
      originalPrice: 500,
      discountedPrice: 350,
      discountPercentage: 30,
      isApproved: true,
      notes: 'Master has approved this additional work'
    }
  ]);

  const vehicleNumber = 'TS09EA1234';
  const serviceCenter = 'WayPartner Service Center - Hyderabad';

  const handleReject = (workId: string) => {
    const reason = rejectionReasons[workId] || '';
    if (!reason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    setAdditionalWorks(works => 
      works.map(work => 
        work.id === workId 
          ? { ...work, isApproved: false } 
          : work
      )
    );
    
    toast.success('Additional work rejected');
  };

  const handleApprove = (workId: string) => {
    setAdditionalWorks(works => 
      works.map(work => 
        work.id === workId 
          ? { ...work, isApproved: true } 
          : work
      )
    );
    
    toast.success('Additional work approved');
  };

  const totalOriginalPrice = additionalWorks.reduce((sum, work) => sum + work.originalPrice, 0);
  const totalDiscountedPrice = additionalWorks.reduce((sum, work) => sum + work.discountedPrice, 0);
  const totalSavings = totalOriginalPrice - totalDiscountedPrice;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            <div>
              <CardTitle>Additional Work Recommendations for Master</CardTitle>
              <p className="text-gray-600">Vehicle: {vehicleNumber} | Service Center: {serviceCenter}</p>
              <p className="text-sm text-orange-600 mt-1">📞 Waiting for master's approval via phone/WhatsApp</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Free Service Reminder */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-700">Your free Engine Maintenance is confirmed and included.</span>
          </div>
        </CardContent>
      </Card>

      {/* Additional Works */}
      <div className="space-y-4">
        {additionalWorks.map((work) => (
          <Card key={work.id} className="border-l-4 border-l-orange-400">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3>{work.serviceName}</h3>
                  <p className="text-gray-600 mt-1">{work.description}</p>
                  {work.notes && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-blue-800">Service Center Notes:</p>
                          <p className="text-sm text-blue-700">{work.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-right ml-4">
                  <Badge variant="destructive" className="mb-2">
                    {work.discountPercentage}% OFF
                  </Badge>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-gray-500 line-through">
                      <IndianRupee className="h-4 w-4" />
                      <span>{work.originalPrice}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <IndianRupee className="h-4 w-4" />
                      <span>{work.discountedPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex gap-2 mb-4">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Percent className="h-3 w-3" />
                  <span>Discount: ₹{work.originalPrice - work.discountedPrice}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span>Est. Time: 30-45 mins</span>
                </div>
              </div>

              {!work.isApproved && (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Master's reason for declining (if applicable)..."
                    value={rejectionReasons[work.id] || ''}
                    onChange={(e) => setRejectionReasons(prev => ({
                      ...prev,
                      [work.id]: e.target.value
                    }))}
                    className="min-h-[60px]"
                  />
                  
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-[#c56321] to-[#088145] hover:from-[#b85a1f] hover:to-[#077a3e]"
                      onClick={() => handleApprove(work.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Master Approved
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => handleReject(work.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Master Declined
                    </Button>
                  </div>
                </div>
              )}

              {work.isApproved && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span>Master Approved - Work will be completed</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Free Engine Maintenance</span>
              <span className="text-green-600">₹0 (FREE)</span>
            </div>
            
            <div className="flex justify-between">
              <span>Additional Works (Original Price)</span>
              <span className="line-through text-gray-500">₹{totalOriginalPrice}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Additional Works (After Discount)</span>
              <span>₹{totalDiscountedPrice}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between">
              <span>Total Savings</span>
              <span className="text-green-600">₹{totalSavings}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Final Amount</span>
              <span>₹{totalDiscountedPrice}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-blue-800">Need clarification about any work?</p>
              <p className="text-blue-600 text-sm">Call service center: +91 9999999999</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}