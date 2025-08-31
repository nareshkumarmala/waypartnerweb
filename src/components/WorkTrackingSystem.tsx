import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CheckCircle, XCircle, Clock, AlertCircle, FileText, Send } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface WorkItem {
  id: string;
  vehicleNumber: string;
  vehicleType: '2-wheeler' | '4-wheeler';
  serviceName: string;
  description: string;
  assignedTechnician: string;
  status: 'pending' | 'in-progress' | 'completed' | 'ignored' | 'approved';
  priority: 'low' | 'medium' | 'high';
  estimatedTime: string;
  actualTime?: string;
  cost: number;
  notes: string;
  createdAt: string;
  completedAt?: string;
  reasonForIgnoring?: string;
}

interface InvoiceItem {
  serviceName: string;
  description: string;
  cost: number;
  discount?: number;
}

export function WorkTrackingSystem() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [invoiceData, setInvoiceData] = useState<InvoiceItem[]>([]);

  const [workItems] = useState<WorkItem[]>([
    {
      id: '1',
      vehicleNumber: 'TS09EA1234',
      vehicleType: '2-wheeler',
      serviceName: 'Engine Oil Change',
      description: 'Replace engine oil and filter - Free service',
      assignedTechnician: 'Ravi Kumar',
      status: 'completed',
      priority: 'medium',
      estimatedTime: '30 mins',
      actualTime: '25 mins',
      cost: 0,
      notes: 'Completed successfully. Good oil condition.',
      createdAt: '2025-01-20T09:00:00Z',
      completedAt: '2025-01-20T09:25:00Z'
    },
    {
      id: '2',
      vehicleNumber: 'TS09EA1234',
      vehicleType: '2-wheeler',
      serviceName: 'Brake Pad Replacement',
      description: 'Replace worn brake pads - Additional work',
      assignedTechnician: 'Ravi Kumar',
      status: 'approved',
      priority: 'high',
      estimatedTime: '45 mins',
      actualTime: '40 mins',
      cost: 800,
      notes: 'Customer approved. Brake pads were 80% worn.',
      createdAt: '2025-01-20T09:30:00Z',
      completedAt: '2025-01-20T10:10:00Z'
    },
    {
      id: '3',
      vehicleNumber: 'TS09EA1234',
      vehicleType: '2-wheeler',
      serviceName: 'Chain Cleaning',
      description: 'Clean and lubricate chain - Recommended',
      assignedTechnician: 'Ravi Kumar',
      status: 'ignored',
      priority: 'low',
      estimatedTime: '15 mins',
      cost: 200,
      notes: 'Recommended but not urgent.',
      reasonForIgnoring: 'Customer declined due to budget constraints',
      createdAt: '2025-01-20T10:15:00Z'
    },
    {
      id: '4',
      vehicleNumber: 'KA05MN5678',
      vehicleType: '4-wheeler',
      serviceName: 'Engine Tune-up',
      description: 'Complete engine inspection and tune-up',
      assignedTechnician: 'Suresh Reddy',
      status: 'in-progress',
      priority: 'medium',
      estimatedTime: '2 hours',
      cost: 0,
      notes: 'Free service in progress',
      createdAt: '2025-01-20T10:00:00Z'
    },
    {
      id: '5',
      vehicleNumber: 'KA05MN5678',
      vehicleType: '4-wheeler',
      serviceName: 'AC Gas Refill',
      description: 'Refill AC refrigerant - Additional work',
      assignedTechnician: 'Suresh Reddy',
      status: 'pending',
      priority: 'medium',
      estimatedTime: '1 hour',
      cost: 1500,
      notes: 'Waiting for customer approval',
      createdAt: '2025-01-20T10:30:00Z'
    }
  ]);

  const getStatusIcon = (status: WorkItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'ignored':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: WorkItem['status']) => {
    const variants = {
      'completed': 'default',
      'approved': 'secondary',
      'ignored': 'destructive',
      'in-progress': 'default',
      'pending': 'outline'
    } as const;

    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  const filterWorkItems = (status: string) => {
    if (status === 'all') return workItems;
    return workItems.filter(item => item.status === status);
  };

  const generateInvoice = (vehicleNumber: string) => {
    const vehicleWorks = workItems.filter(
      item => item.vehicleNumber === vehicleNumber && 
      (item.status === 'completed' || item.status === 'approved')
    );
    
    const invoiceItems = vehicleWorks.map(work => ({
      serviceName: work.serviceName,
      description: work.description,
      cost: work.cost,
      discount: work.cost === 0 ? 0 : undefined
    }));
    
    setInvoiceData(invoiceItems);
  };

  const uniqueVehicles = [...new Set(workItems.map(item => item.vehicleNumber))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Work Tracking System</h2>
          <p className="text-gray-600">Master control for all service operations</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Vehicle" />
            </SelectTrigger>
            <SelectContent>
              {uniqueVehicles.map(vehicle => (
                <SelectItem key={vehicle} value={vehicle}>
                  {vehicle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedVehicle && (
            <Button onClick={() => generateInvoice(selectedVehicle)}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Invoice
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="pending">Pending ({filterWorkItems('pending').length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({filterWorkItems('in-progress').length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({filterWorkItems('completed').length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({filterWorkItems('approved').length})</TabsTrigger>
          <TabsTrigger value="ignored">Ignored ({filterWorkItems('ignored').length})</TabsTrigger>
          <TabsTrigger value="all">All ({workItems.length})</TabsTrigger>
        </TabsList>

        {['pending', 'in-progress', 'completed', 'approved', 'ignored', 'all'].map(status => (
          <TabsContent key={status} value={status} className="space-y-4">
            <div className="grid gap-4">
              {filterWorkItems(status).map(work => (
                <Card key={work.id} className="border-l-4 border-l-orange-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {work.serviceName}
                          {getStatusBadge(work.status)}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="font-medium">{work.vehicleNumber}</span>
                          <Badge variant="outline">{work.vehicleType}</Badge>
                          <span>Tech: {work.assignedTechnician}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-medium">
                          {work.cost === 0 ? 'FREE' : `₹${work.cost}`}
                        </div>
                        <div className="text-sm text-gray-600">
                          {work.estimatedTime}
                          {work.actualTime && ` → ${work.actualTime}`}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-700">{work.description}</p>
                    {work.notes && (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <strong>Notes:</strong> {work.notes}
                      </div>
                    )}
                    {work.reasonForIgnoring && (
                      <div className="bg-red-50 p-3 rounded-md border border-red-200">
                        <strong className="text-red-700">Reason for ignoring:</strong> {work.reasonForIgnoring}
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Created: {new Date(work.createdAt).toLocaleString()}</span>
                      {work.completedAt && (
                        <span>Completed: {new Date(work.completedAt).toLocaleString()}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Invoice Generation Modal */}
      {invoiceData.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoice for {selectedVehicle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {invoiceData.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium">{item.serviceName}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </div>
                  <div className="text-right">
                    {item.cost === 0 ? (
                      <span className="text-green-600 font-medium">FREE</span>
                    ) : (
                      <span>₹{item.cost}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center text-lg font-medium">
                <span>Total Amount:</span>
                <span>₹{invoiceData.reduce((sum, item) => sum + item.cost, 0)}</span>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Send Invoice to Customer
              </Button>
              <Button variant="outline" onClick={() => setInvoiceData([])}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}