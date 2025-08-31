import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  Car, 
  Wrench, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  IndianRupee,
  Calendar
} from 'lucide-react';
import { Progress } from './ui/progress';

interface DashboardStats {
  totalVehicles: number;
  activeBookings: number;
  completedToday: number;
  pendingApproval: number;
  revenue: number;
  freeServices: number;
  additionalWorks: number;
  ignoredTasks: number;
}

interface VehicleWork {
  vehicleNumber: string;
  vehicleType: '2-wheeler' | '4-wheeler';
  pendingWorks: number;
  inProgressWorks: number;
  completedWorks: number;
  ignoredWorks: number;
  lastServiceDate: string;
  nextServiceDue: string;
  technician: string;
  status: 'active' | 'completed' | 'pending';
}

export function EnhancedDashboard() {
  const [activeView, setActiveView] = useState('overview');

  const stats: DashboardStats = {
    totalVehicles: 6000,
    activeBookings: 45,
    completedToday: 12,
    pendingApproval: 8,
    revenue: 45000,
    freeServices: 8,
    additionalWorks: 15,
    ignoredTasks: 3
  };

  const vehicleWorks: VehicleWork[] = [
    {
      vehicleNumber: 'TS09EA1234',
      vehicleType: '2-wheeler',
      pendingWorks: 1,
      inProgressWorks: 0,
      completedWorks: 2,
      ignoredWorks: 1,
      lastServiceDate: '2025-01-20',
      nextServiceDue: '2025-04-20',
      technician: 'Ravi Kumar',
      status: 'completed'
    },
    {
      vehicleNumber: 'KA05MN5678',
      vehicleType: '4-wheeler',
      pendingWorks: 1,
      inProgressWorks: 1,
      completedWorks: 0,
      ignoredWorks: 0,
      lastServiceDate: '2025-01-20',
      nextServiceDue: '2025-07-20',
      technician: 'Suresh Reddy',
      status: 'active'
    },
    {
      vehicleNumber: 'AP09BC9012',
      vehicleType: '2-wheeler',
      pendingWorks: 2,
      inProgressWorks: 0,
      completedWorks: 0,
      ignoredWorks: 0,
      lastServiceDate: '2025-01-19',
      nextServiceDue: '2025-04-19',
      technician: 'Pending Assignment',
      status: 'pending'
    }
  ];

  const getStatusColor = (status: VehicleWork['status']) => {
    switch (status) {
      case 'active': return 'text-orange-500';
      case 'completed': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
    }
  };

  const getVehicleTypeIcon = (type: '2-wheeler' | '4-wheeler') => {
    return <Car className={`h-4 w-4 ${type === '2-wheeler' ? 'text-blue-500' : 'text-purple-500'}`} />;
  };

  const calculateProgress = (completed: number, total: number) => {
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header with Logo and Welcome */}
      <div className="bg-gradient-to-r from-[#c56321] to-[#088145] rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#c56321] font-bold text-xl">W</span>
            </div>
            <div>
              <h1 className="text-2xl font-medium">Master Dashboard</h1>
              <p className="text-orange-100">Service Center Operations Control</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Today's Date</div>
            <div className="text-lg font-medium">{new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-medium">{stats.totalVehicles.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Bookings</p>
                <p className="text-2xl font-medium">{stats.activeBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-2xl font-medium">{stats.completedToday}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Revenue</p>
                <p className="text-2xl font-medium">₹{stats.revenue.toLocaleString()}</p>
              </div>
              <IndianRupee className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Work Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Work Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Free Services</span>
                  <Badge variant="secondary">{stats.freeServices}</Badge>
                </div>
                <Progress value={(stats.freeServices / 20) * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Additional Works</span>
                  <Badge variant="outline">{stats.additionalWorks}</Badge>
                </div>
                <Progress value={(stats.additionalWorks / 25) * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending Approval</span>
                  <Badge variant="destructive">{stats.pendingApproval}</Badge>
                </div>
                <Progress value={(stats.pendingApproval / 15) * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ignored Tasks</span>
                  <Badge variant="secondary">{stats.ignoredTasks}</Badge>
                </div>
                <Progress value={(stats.ignoredTasks / 10) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Daily Target Progress</span>
                <span className="font-medium">80%</span>
              </div>
              <Progress value={80} className="h-3" />
              
              <div className="flex items-center justify-between">
                <span>Customer Satisfaction</span>
                <span className="font-medium">95%</span>
              </div>
              <Progress value={95} className="h-3" />
              
              <div className="flex items-center justify-between">
                <span>On-time Delivery</span>
                <span className="font-medium">88%</span>
              </div>
              <Progress value={88} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Work Status Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Vehicle Work Status & Pending Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium">Vehicle</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Technician</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-center p-3 font-medium">Pending</th>
                  <th className="text-center p-3 font-medium">In Progress</th>
                  <th className="text-center p-3 font-medium">Completed</th>
                  <th className="text-center p-3 font-medium">Ignored</th>
                  <th className="text-center p-3 font-medium">Progress</th>
                </tr>
              </thead>
              <tbody>
                {vehicleWorks.map((vehicle) => {
                  const totalWorks = vehicle.pendingWorks + vehicle.inProgressWorks + vehicle.completedWorks + vehicle.ignoredWorks;
                  const progress = calculateProgress(vehicle.completedWorks, totalWorks);
                  
                  return (
                    <tr key={vehicle.vehicleNumber} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{vehicle.vehicleNumber}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          {getVehicleTypeIcon(vehicle.vehicleType)}
                          {vehicle.vehicleType}
                        </div>
                      </td>
                      <td className="p-3">{vehicle.technician}</td>
                      <td className="p-3">
                        <Badge variant={vehicle.status === 'completed' ? 'default' : 'outline'}>
                          <span className={getStatusColor(vehicle.status)}>
                            {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                          </span>
                        </Badge>
                      </td>
                      <td className="text-center p-3">
                        <Badge variant={vehicle.pendingWorks > 0 ? 'destructive' : 'secondary'}>
                          {vehicle.pendingWorks}
                        </Badge>
                      </td>
                      <td className="text-center p-3">
                        <Badge variant={vehicle.inProgressWorks > 0 ? 'default' : 'secondary'}>
                          {vehicle.inProgressWorks}
                        </Badge>
                      </td>
                      <td className="text-center p-3">
                        <Badge variant="outline" className="text-green-600">
                          {vehicle.completedWorks}
                        </Badge>
                      </td>
                      <td className="text-center p-3">
                        <Badge variant={vehicle.ignoredWorks > 0 ? 'secondary' : 'outline'}>
                          {vehicle.ignoredWorks}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Progress value={progress} className="h-2 flex-1" />
                          <span className="text-sm text-gray-600">{progress}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}