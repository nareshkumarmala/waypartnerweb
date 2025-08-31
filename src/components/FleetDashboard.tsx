import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Car, 
  Bike, 
  Search, 
  Filter,
  MapPin,
  Calendar,
  Fuel,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface Vehicle {
  id: string;
  type: '2-wheeler' | '4-wheeler';
  number: string;
  model: string;
  driver: string;
  location: string;
  greenCoinsEarned: number;
  lastService: string;
  nextService: string;
  status: 'active' | 'maintenance' | 'idle';
  totalKm: number;
}

export function FleetDashboard() {
  const [vehicles] = useState<Vehicle[]>([
    // 2-wheelers sample data
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `2w-${i + 1}`,
      type: '2-wheeler' as const,
      number: `AP 39 XX ${1234 + i}`,
      model: i % 2 === 0 ? 'Honda Activa' : 'TVS Jupiter',
      driver: `Driver ${i + 1}`,
      location: i % 3 === 0 ? 'Route A' : i % 3 === 1 ? 'Route B' : 'Route C',
      greenCoinsEarned: Math.floor(Math.random() * 3000) + 500,
      lastService: '2024-01-15',
      nextService: '2024-03-15',
      status: i % 4 === 0 ? 'maintenance' : i % 4 === 1 ? 'idle' : 'active' as const,
      totalKm: Math.floor(Math.random() * 50000) + 10000
    })),
    // 4-wheelers sample data
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `4w-${i + 1}`,
      type: '4-wheeler' as const,
      number: `AP 39 YY ${5678 + i}`,
      model: i % 2 === 0 ? 'Tata Ace' : 'Mahindra Bolero',
      driver: `Driver ${i + 9}`,
      location: i % 3 === 0 ? 'Zone 1' : i % 3 === 1 ? 'Zone 2' : 'Zone 3',
      greenCoinsEarned: Math.floor(Math.random() * 8000) + 1000,
      lastService: '2024-01-10',
      nextService: '2024-04-10',
      status: i % 4 === 0 ? 'maintenance' : i % 4 === 1 ? 'idle' : 'active' as const,
      totalKm: Math.floor(Math.random() * 80000) + 20000
    }))
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | '2-wheeler' | '4-wheeler'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'maintenance' | 'idle'>('all');

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || vehicle.type === filterType;
    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total2Wheelers: vehicles.filter(v => v.type === '2-wheeler').length,
    total4Wheelers: vehicles.filter(v => v.type === '4-wheeler').length,
    activeVehicles: vehicles.filter(v => v.status === 'active').length,
    maintenanceVehicles: vehicles.filter(v => v.status === 'maintenance').length,
    totalGreenCoins: vehicles.reduce((sum, v) => sum + v.greenCoinsEarned, 0),
    avgCoinsPerVehicle: Math.floor(vehicles.reduce((sum, v) => sum + v.greenCoinsEarned, 0) / vehicles.length)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-300';
      case 'maintenance': return 'bg-red-100 text-red-700 border-red-300';
      case 'idle': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-3 w-3" />;
      case 'maintenance': return <AlertTriangle className="h-3 w-3" />;
      case 'idle': return <Clock className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl">Fleet Management</h1>
          <p className="text-gray-600 mt-2">Monitor your vehicle fleet and green coins distribution</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bike className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">2-Wheelers</p>
                <p className="text-2xl">{stats.total2Wheelers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Car className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">4-Wheelers</p>
                <p className="text-2xl">{stats.total4Wheelers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl">{stats.activeVehicles}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Maintenance</p>
                <p className="text-2xl">{stats.maintenanceVehicles}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">
                GC
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Coins</p>
                <p className="text-2xl">{stats.totalGreenCoins.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                AVG
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg/Vehicle</p>
                <p className="text-2xl">{stats.avgCoinsPerVehicle}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by vehicle number, driver, or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="2-wheeler">2-Wheeler</SelectItem>
                <SelectItem value="4-wheeler">4-Wheeler</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {vehicle.type === '2-wheeler' ? (
                    <Bike className="h-6 w-6 text-blue-600" />
                  ) : (
                    <Car className="h-6 w-6 text-purple-600" />
                  )}
                  <div>
                    <CardTitle className="text-lg">{vehicle.number}</CardTitle>
                    <p className="text-sm text-gray-600">{vehicle.model}</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(vehicle.status)} flex items-center gap-1`}>
                  {getStatusIcon(vehicle.status)}
                  {vehicle.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Driver</p>
                  <p>{vehicle.driver}</p>
                </div>
                <div>
                  <p className="text-gray-600">Location</p>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{vehicle.location}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Green Coins</p>
                  <p className="text-green-600">{vehicle.greenCoinsEarned}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total KM</p>
                  <div className="flex items-center gap-1">
                    <Fuel className="h-3 w-3" />
                    <span>{vehicle.totalKm.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Last Service</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{vehicle.lastService}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Next Service</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{vehicle.nextService}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  disabled={vehicle.status === 'maintenance'}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No vehicles found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}