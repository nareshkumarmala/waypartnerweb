import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Eye, Car, Clock, CheckCircle, AlertCircle, Wrench } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner@2.0.3';

interface Vehicle {
  id: string;
  vehicleNo: string;
  owner: string;
  phone: string;
  service: string;
  status: 'pending' | 'in-progress' | 'completed' | 'ready-for-delivery';
  entryDate: string;
  estimatedCompletion: string;
  technician?: string;
  progress: number;
  issues?: string[];
}

export function VehicleStatus() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      vehicleNo: 'MH12AB1234',
      owner: 'John Doe',
      phone: '9876543210',
      service: '2W General Service',
      status: 'in-progress',
      entryDate: '2025-08-16',
      estimatedCompletion: '2025-08-17',
      technician: 'Rajesh Kumar',
      progress: 65,
      issues: ['Engine oil change required', 'Brake pads worn']
    },
    {
      id: '2',
      vehicleNo: 'MH14CD5678',
      owner: 'Jane Smith',
      phone: '9123456789',
      service: '4W Full Service',
      status: 'pending',
      entryDate: '2025-08-17',
      estimatedCompletion: '2025-08-18',
      progress: 0
    },
    {
      id: '3',
      vehicleNo: 'MH16EF9012',
      owner: 'Mike Johnson',
      phone: '9234567890',
      service: 'EV Battery Check',
      status: 'completed',
      entryDate: '2025-08-15',
      estimatedCompletion: '2025-08-16',
      technician: 'Amit Sharma',
      progress: 100
    },
    {
      id: '4',
      vehicleNo: 'MH18GH3456',
      owner: 'Sarah Wilson',
      phone: '9345678901',
      service: '2W Oil Change',
      status: 'ready-for-delivery',
      entryDate: '2025-08-16',
      estimatedCompletion: '2025-08-16',
      technician: 'Rajesh Kumar',
      progress: 100
    }
  ]);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleStatusUpdate = (vehicleId: string, newStatus: Vehicle['status']) => {
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === vehicleId 
        ? { ...vehicle, status: newStatus }
        : vehicle
    ));
    toast.success('Vehicle status updated successfully!');
  };

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: Vehicle['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Wrench className="h-3 w-3 mr-1" />
          In Progress
        </Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>;
      case 'ready-for-delivery':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <Car className="h-3 w-3 mr-1" />
          Ready for Delivery
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'in-progress': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'ready-for-delivery': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const statusCounts = {
    pending: vehicles.filter(v => v.status === 'pending').length,
    inProgress: vehicles.filter(v => v.status === 'in-progress').length,
    completed: vehicles.filter(v => v.status === 'completed').length,
    readyForDelivery: vehicles.filter(v => v.status === 'ready-for-delivery').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Status Management</h1>
        <p className="text-gray-600 mt-1">Track and update service progress for all vehicles</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-2">{statusCounts.pending}</div>
            <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Clock className="h-4 w-4" />
              Pending
            </p>
          </CardContent>
        </Card>
        
        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{statusCounts.inProgress}</div>
            <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Wrench className="h-4 w-4" />
              In Progress
            </p>
          </CardContent>
        </Card>
        
        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">{statusCounts.completed}</div>
            <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Completed
            </p>
          </CardContent>
        </Card>
        
        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">{statusCounts.readyForDelivery}</div>
            <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Car className="h-4 w-4" />
              Ready
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicles Table */}
      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-[#036b61]" />
            All Vehicles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Est. Completion</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.vehicleNo}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{vehicle.owner}</p>
                        <p className="text-sm text-gray-500">{vehicle.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.service}</TableCell>
                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                    <TableCell>
                      <div className="w-20">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                vehicle.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${vehicle.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{vehicle.progress}%</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(vehicle.estimatedCompletion).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select onValueChange={(value) => handleStatusUpdate(vehicle.id, value as Vehicle['status'])}>
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue placeholder="Update" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="ready-for-delivery">Ready</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Vehicle Details - {selectedVehicle?.vehicleNo || vehicle.vehicleNo}</DialogTitle>
                              <DialogDescription>
                                Complete vehicle service information and current status
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedVehicle && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Owner</label>
                                    <p className="text-sm text-gray-600">{selectedVehicle.owner}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Phone</label>
                                    <p className="text-sm text-gray-600">{selectedVehicle.phone}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="text-sm font-medium">Service Type</label>
                                  <p className="text-sm text-gray-600">{selectedVehicle.service}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Entry Date</label>
                                    <p className="text-sm text-gray-600">{new Date(selectedVehicle.entryDate).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Est. Completion</label>
                                    <p className="text-sm text-gray-600">{new Date(selectedVehicle.estimatedCompletion).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                
                                {selectedVehicle.technician && (
                                  <div>
                                    <label className="text-sm font-medium">Assigned Technician</label>
                                    <p className="text-sm text-gray-600">{selectedVehicle.technician}</p>
                                  </div>
                                )}
                                
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <div className="mt-1">{getStatusBadge(selectedVehicle.status)}</div>
                                </div>
                                
                                <div>
                                  <label className="text-sm font-medium">Progress</label>
                                  <div className="mt-1 flex items-center gap-3">
                                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                                      <div 
                                        className={`h-3 rounded-full transition-all ${
                                          selectedVehicle.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                                        }`}
                                        style={{ width: `${selectedVehicle.progress}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm text-gray-600">{selectedVehicle.progress}%</span>
                                  </div>
                                </div>
                                
                                {selectedVehicle.issues && selectedVehicle.issues.length > 0 && (
                                  <div>
                                    <label className="text-sm font-medium">Issues Found</label>
                                    <ul className="text-sm text-gray-600 mt-1 space-y-1">
                                      {selectedVehicle.issues.map((issue, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                          <AlertCircle className="h-3 w-3 text-yellow-600" />
                                          {issue}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            handleViewDetails(vehicle);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}