import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Search, 
  Car, 
  Coins, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Camera, 
  FileText, 
  Plus, 
  Trash2,
  HelpCircle,
  IndianRupee,
  Gauge
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Types
interface Vehicle {
  id: string;
  regn_no: string;
  type: '2W' | '4W';
  model: string;
  segment?: string;
  owner_id: string;
  owner_name: string;
  owner_phone: string;
  last_service_odo: number;
  coin_balance: number;
}

interface ChecklistItem {
  code: string;
  label: string;
  category: string;
  description: string;
  status: 'good' | 'attention' | 'critical';
  note?: string;
  photo?: string;
}

interface AdditionalWork {
  id: string;
  name: string;
  parts: number;
  labour: number;
  gst_pct: number;
  total: number;
}

interface Inspection {
  id: string;
  vehicle_id: string;
  advisor_id: string;
  odometer: number;
  next_service_odo: number;
  type: '2W' | '4W';
  coins_pack: number;
  engine_oil_change: boolean;
  coins_used: number;
  status: 'estimate_pending' | 'estimate_sent' | 'approved' | 'in_service' | 'qc' | 'ready';
}

// Comprehensive inspection checklists
const CHECKLIST_2W = [
  // Engine & Performance
  { code: 'engine_oil_level', label: 'Engine Oil Level & Condition', category: 'Engine & Performance', description: 'Check oil level and color' },
  { code: 'air_filter', label: 'Air Filter Element', category: 'Engine & Performance', description: 'Check for dirt, damage, or clogging' },
  { code: 'spark_plug', label: 'Spark Plug Condition', category: 'Engine & Performance', description: 'Check electrode wear and carbon deposits' },
  { code: 'fuel_system', label: 'Fuel System & Carburetor', category: 'Engine & Performance', description: 'Check fuel lines, filter, and carburetor' },
  { code: 'exhaust_system', label: 'Exhaust System & Silencer', category: 'Engine & Performance', description: 'Check for leaks, rust, and noise levels' },
  
  // Electrical System
  { code: 'battery', label: 'Battery & Terminals', category: 'Electrical System', description: 'Check voltage, terminals, and corrosion' },
  { code: 'headlight', label: 'Headlight & High Beam', category: 'Electrical System', description: 'Check brightness and alignment' },
  { code: 'taillight', label: 'Tail Light & Brake Light', category: 'Electrical System', description: 'Check all rear lights functionality' },
  { code: 'indicators', label: 'Turn Indicators & Hazard', category: 'Electrical System', description: 'Check front and rear indicators' },
  { code: 'horn', label: 'Horn & Warning Systems', category: 'Electrical System', description: 'Check horn sound and volume' },
  { code: 'charging_system', label: 'Charging System', category: 'Electrical System', description: 'Check alternator and charging rate' },
  
  // Braking System
  { code: 'front_brake_pads', label: 'Front Brake Pads/Shoes', category: 'Braking System', description: 'Check thickness and wear pattern' },
  { code: 'rear_brake_pads', label: 'Rear Brake Pads/Shoes', category: 'Braking System', description: 'Check thickness and wear pattern' },
  { code: 'brake_fluid', label: 'Brake Fluid Level', category: 'Braking System', description: 'Check level and color' },
  { code: 'brake_cables', label: 'Brake Cables & Adjustment', category: 'Braking System', description: 'Check cable tension and lubrication' },
  { code: 'brake_lever', label: 'Brake Lever Free Play', category: 'Braking System', description: 'Check lever movement and response' },
  
  // Wheels & Tyres
  { code: 'front_tyre', label: 'Front Tyre Condition', category: 'Wheels & Tyres', description: 'Check tread depth, cracks, and wear pattern' },
  { code: 'rear_tyre', label: 'Rear Tyre Condition', category: 'Wheels & Tyres', description: 'Check tread depth, cracks, and wear pattern' },
  { code: 'tyre_pressure', label: 'Tyre Pressure', category: 'Wheels & Tyres', description: 'Check recommended pressure levels' },
  { code: 'wheel_alignment', label: 'Wheel Alignment', category: 'Wheels & Tyres', description: 'Check for proper alignment and balance' },
  { code: 'wheel_bearings', label: 'Wheel Bearings', category: 'Wheels & Tyres', description: 'Check for play and smooth rotation' },
  
  // Transmission & Drivetrain
  { code: 'clutch_free_play', label: 'Clutch Free Play', category: 'Transmission & Drivetrain', description: 'Check clutch lever adjustment' },
  { code: 'chain_belt', label: 'Drive Chain/Belt', category: 'Transmission & Drivetrain', description: 'Check tension, lubrication, and wear' },
  { code: 'gear_shifting', label: 'Gear Shifting', category: 'Transmission & Drivetrain', description: 'Check smooth gear changes' },
  { code: 'sprockets', label: 'Chain Sprockets', category: 'Transmission & Drivetrain', description: 'Check teeth wear and alignment' },
  
  // Suspension & Steering
  { code: 'front_suspension', label: 'Front Suspension/Forks', category: 'Suspension & Steering', description: 'Check for leaks and smooth operation' },
  { code: 'rear_suspension', label: 'Rear Suspension/Shock', category: 'Suspension & Steering', description: 'Check damping and spring condition' },
  { code: 'handlebar', label: 'Handlebar & Grips', category: 'Suspension & Steering', description: 'Check tightness and grip condition' },
  { code: 'steering_head', label: 'Steering Head Bearings', category: 'Suspension & Steering', description: 'Check for play and smooth movement' },
  
  // Body & Safety
  { code: 'mirrors', label: 'Mirrors & Visibility', category: 'Body & Safety', description: 'Check mirror adjustment and clarity' },
  { code: 'seat_condition', label: 'Seat Condition', category: 'Body & Safety', description: 'Check seat padding and cover' },
  { code: 'kickstand', label: 'Side Stand & Center Stand', category: 'Body & Safety', description: 'Check spring action and stability' },
  { code: 'lock_system', label: 'Lock System', category: 'Body & Safety', description: 'Check ignition and steering lock' },
  { code: 'number_plate', label: 'Number Plate & Documents', category: 'Body & Safety', description: 'Check plate visibility and documents' }
];

const CHECKLIST_4W = [
  // Engine & Performance
  { code: 'engine_oil_level', label: 'Engine Oil Level & Condition', category: 'Engine & Performance', description: 'Check oil level, color, and viscosity' },
  { code: 'coolant_level', label: 'Coolant Level & Condition', category: 'Engine & Performance', description: 'Check radiator and reservoir levels' },
  { code: 'air_filter', label: 'Air Filter Element', category: 'Engine & Performance', description: 'Check filter condition and cleanliness' },
  { code: 'cabin_filter', label: 'Cabin Air Filter', category: 'Engine & Performance', description: 'Check AC filter condition' },
  { code: 'spark_plugs', label: 'Spark Plugs', category: 'Engine & Performance', description: 'Check electrode condition and gap' },
  { code: 'fuel_system', label: 'Fuel System & Filter', category: 'Engine & Performance', description: 'Check fuel lines, filter, and pump' },
  { code: 'exhaust_system', label: 'Exhaust System', category: 'Engine & Performance', description: 'Check for leaks, damage, and emissions' },
  { code: 'timing_belt', label: 'Timing Belt/Chain', category: 'Engine & Performance', description: 'Check belt condition and tension' },
  
  // Electrical System
  { code: 'battery', label: 'Battery & Terminals', category: 'Electrical System', description: 'Check voltage, specific gravity, terminals' },
  { code: 'alternator', label: 'Alternator & Charging', category: 'Electrical System', description: 'Check charging rate and belt tension' },
  { code: 'starter_motor', label: 'Starter Motor', category: 'Electrical System', description: 'Check starting performance' },
  { code: 'headlights', label: 'Headlights & Fog Lamps', category: 'Electrical System', description: 'Check brightness, alignment, and cleaning' },
  { code: 'taillights', label: 'Tail Lights & Brake Lights', category: 'Electrical System', description: 'Check all rear light functions' },
  { code: 'indicators', label: 'Turn Indicators & Hazard', category: 'Electrical System', description: 'Check all indicator functions' },
  { code: 'dashboard_lights', label: 'Dashboard & Warning Lights', category: 'Electrical System', description: 'Check all dashboard indicators' },
  { code: 'horn', label: 'Horn System', category: 'Electrical System', description: 'Check horn sound and operation' },
  
  // Braking System
  { code: 'front_brake_pads', label: 'Front Brake Pads & Discs', category: 'Braking System', description: 'Check pad thickness and disc condition' },
  { code: 'rear_brake_pads', label: 'Rear Brake Pads/Shoes', category: 'Braking System', description: 'Check pad/shoe thickness and drums' },
  { code: 'brake_fluid', label: 'Brake Fluid Level', category: 'Braking System', description: 'Check fluid level and color' },
  { code: 'brake_lines', label: 'Brake Lines & Hoses', category: 'Braking System', description: 'Check for leaks and damage' },
  { code: 'handbrake', label: 'Handbrake/Parking Brake', category: 'Braking System', description: 'Check adjustment and holding power' },
  { code: 'abs_system', label: 'ABS System (if equipped)', category: 'Braking System', description: 'Check ABS warning light and operation' },
  
  // Wheels & Tyres
  { code: 'front_tyres', label: 'Front Tyres Condition', category: 'Wheels & Tyres', description: 'Check tread depth, sidewall, and wear pattern' },
  { code: 'rear_tyres', label: 'Rear Tyres Condition', category: 'Wheels & Tyres', description: 'Check tread depth, sidewall, and wear pattern' },
  { code: 'spare_tyre', label: 'Spare Tyre & Jack', category: 'Wheels & Tyres', description: 'Check spare condition and tools' },
  { code: 'tyre_pressure', label: 'Tyre Pressure (All)', category: 'Wheels & Tyres', description: 'Check recommended pressure levels' },
  { code: 'wheel_alignment', label: 'Wheel Alignment', category: 'Wheels & Tyres', description: 'Check alignment and balancing' },
  { code: 'wheel_bearings', label: 'Wheel Bearings', category: 'Wheels & Tyres', description: 'Check for play and noise' },
  
  // Transmission & Drivetrain
  { code: 'clutch_system', label: 'Clutch System', category: 'Transmission & Drivetrain', description: 'Check clutch operation and fluid' },
  { code: 'transmission_oil', label: 'Transmission Oil', category: 'Transmission & Drivetrain', description: 'Check gear oil level and condition' },
  { code: 'cv_joints', label: 'CV Joints & Boots', category: 'Transmission & Drivetrain', description: 'Check for play and boot condition' },
  { code: 'driveshaft', label: 'Drive Shaft', category: 'Transmission & Drivetrain', description: 'Check for vibration and wear' },
  
  // Suspension & Steering
  { code: 'front_suspension', label: 'Front Suspension', category: 'Suspension & Steering', description: 'Check struts, springs, and bushings' },
  { code: 'rear_suspension', label: 'Rear Suspension', category: 'Suspension & Steering', description: 'Check shocks, springs, and bushings' },
  { code: 'steering_system', label: 'Steering System', category: 'Suspension & Steering', description: 'Check power steering and alignment' },
  { code: 'steering_wheel', label: 'Steering Wheel & Column', category: 'Suspension & Steering', description: 'Check for play and smooth operation' },
  { code: 'tie_rods', label: 'Tie Rods & Ball Joints', category: 'Suspension & Steering', description: 'Check for wear and play' },
  
  // Body & Safety
  { code: 'seatbelts', label: 'Seatbelts (All)', category: 'Body & Safety', description: 'Check belt condition and retraction' },
  { code: 'airbag_system', label: 'Airbag System', category: 'Body & Safety', description: 'Check airbag warning light' },
  { code: 'mirrors', label: 'Mirrors (All)', category: 'Body & Safety', description: 'Check adjustment and visibility' },
  { code: 'wipers', label: 'Wipers & Washer', category: 'Body & Safety', description: 'Check blade condition and washer fluid' },
  { code: 'doors_locks', label: 'Doors & Central Locking', category: 'Body & Safety', description: 'Check door operation and locks' },
  { code: 'windows', label: 'Windows & Regulators', category: 'Body & Safety', description: 'Check window operation' },
  { code: 'ac_system', label: 'AC System', category: 'Body & Safety', description: 'Check cooling, heating, and refrigerant' },
  { code: 'number_plate', label: 'Number Plate & Documents', category: 'Body & Safety', description: 'Check plate visibility and documents' }
];

export function InspectionChecklist() {
  const [currentStep, setCurrentStep] = useState<'lookup' | 'inspection'>('lookup');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Vehicle[]>([]);
  const [searching, setSearching] = useState(false);
  
  // Inspection state
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [odometer, setOdometer] = useState<number>(0);
  const [engineOilChange, setEngineOilChange] = useState(true);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [additionalWorks, setAdditionalWorks] = useState<AdditionalWork[]>([]);
  const [showAddWork, setShowAddWork] = useState(false);
  const [showCoveredModal, setShowCoveredModal] = useState(false);

  // New additional work form
  const [newWork, setNewWork] = useState({
    name: '',
    parts: 0,
    labour: 0,
    gst_pct: 18
  });

  // Vehicle lookup - Mock data for demo
  const searchVehicles = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter registration number, mobile, or tag');
      return;
    }

    setSearching(true);
    
    // Mock search results
    setTimeout(() => {
      const mockResults: Vehicle[] = [
        {
          id: '1',
          regn_no: 'MH12AB1234',
          type: '2W',
          model: 'Honda Activa 6G',
          owner_id: 'owner1',
          owner_name: 'Rajesh Kumar',
          owner_phone: '9876543210',
          last_service_odo: 5200,
          coin_balance: 850
        },
        {
          id: '2',
          regn_no: 'KA05CD5678',
          type: '4W',
          model: 'Maruti Swift VDI',
          segment: 'hatchback',
          owner_id: 'owner2',
          owner_name: 'Priya Sharma',
          owner_phone: '9123456789',
          last_service_odo: 15800,
          coin_balance: 1250
        }
      ];
      
      setSearchResults(mockResults.filter(v => 
        v.regn_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.owner_phone.includes(searchQuery)
      ));
      setSearching(false);
    }, 1000);
  };

  // Start inspection
  const startInspection = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    
    // Set coin pack based on vehicle type and segment
    let coinsPack = 1500; // Default 2W
    if (vehicle.type === '4W') {
      coinsPack = vehicle.segment === 'sedan' || vehicle.segment === 'suv' ? 8500 : 6500;
    }

    // Initialize checklist based on vehicle type
    const initialChecklist = (vehicle.type === '2W' ? CHECKLIST_2W : CHECKLIST_4W).map(item => ({
      code: item.code,
      label: item.label,
      category: item.category,
      description: item.description,
      status: 'good' as const,
      note: '',
      photo: ''
    }));

    setChecklist(initialChecklist);
    setOdometer(vehicle.last_service_odo);
    
    // Create inspection record
    const newInspection: Inspection = {
      id: Date.now().toString(),
      vehicle_id: vehicle.id,
      advisor_id: 'current-user-id',
      odometer: vehicle.last_service_odo,
      next_service_odo: vehicle.last_service_odo + 1500,
      type: vehicle.type,
      coins_pack: coinsPack,
      engine_oil_change: true,
      coins_used: coinsPack,
      status: 'estimate_pending'
    };

    setInspection(newInspection);
    setCurrentStep('inspection');
  };

  // Update checklist item
  const updateChecklistItem = (code: string, status: ChecklistItem['status'], note?: string) => {
    setChecklist(prev => prev.map(item => 
      item.code === code ? { ...item, status, note: note || item.note } : item
    ));

    // If critical, suggest adding to additional works
    if (status === 'critical') {
      const item = checklist.find(i => i.code === code);
      if (item) {
        toast.info(`Critical issue found: ${item.label}. Consider adding repair work.`);
      }
    }
  };

  // Add additional work
  const addAdditionalWork = () => {
    if (!newWork.name.trim()) {
      toast.error('Please enter work name');
      return;
    }

    const total = (newWork.parts + newWork.labour) * (1 + newWork.gst_pct / 100);
    
    const work: AdditionalWork = {
      id: Date.now().toString(),
      name: newWork.name,
      parts: newWork.parts,
      labour: newWork.labour,
      gst_pct: newWork.gst_pct,
      total
    };

    setAdditionalWorks(prev => [...prev, work]);
    setNewWork({ name: '', parts: 0, labour: 0, gst_pct: 18 });
    setShowAddWork(false);
    toast.success('Additional work added');
  };

  // Remove additional work
  const removeAdditionalWork = (id: string) => {
    setAdditionalWorks(prev => prev.filter(w => w.id !== id));
    toast.success('Work removed');
  };

  // Complete inspection
  const completeInspection = async () => {
    if (!inspection || !selectedVehicle) return;

    toast.success(`Inspection completed! Summary sent to ${selectedVehicle.owner_name}`);
    
    // Reset form
    setCurrentStep('lookup');
    setSelectedVehicle(null);
    setInspection(null);
    setChecklist([]);
    setAdditionalWorks([]);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Calculate totals
  const additionalWorksTotal = additionalWorks.reduce((sum, work) => sum + work.total, 0);

  if (currentStep === 'lookup') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl">Vehicle Inspection</h1>
          <p className="text-gray-600 mt-2">Search and select vehicle to start comprehensive inspection</p>
        </div>

        {/* Vehicle Lookup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Vehicle Lookup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Enter Registration No / Mobile / Tag"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchVehicles()}
                />
              </div>
              <Button onClick={searchVehicles} disabled={searching}>
                {searching ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4>Search Results:</h4>
                {searchResults.map((vehicle) => (
                  <Card key={vehicle.id} className="border hover:border-green-300 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-blue-50">
                              {vehicle.regn_no}
                            </Badge>
                            <Badge variant={vehicle.type === '2W' ? 'default' : 'secondary'}>
                              {vehicle.type}
                            </Badge>
                            {vehicle.segment && (
                              <Badge variant="outline">{vehicle.segment}</Badge>
                            )}
                          </div>
                          <div>
                            <p><strong>{vehicle.owner_name}</strong></p>
                            <p className="text-sm text-gray-600">{vehicle.owner_phone}</p>
                            <p className="text-sm text-gray-600">{vehicle.model}</p>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <span>Last Service: <strong>{vehicle.last_service_odo} km</strong></span>
                            <span className="text-green-600">
                              <Coins className="h-4 w-4 inline mr-1" />
                              {vehicle.coin_balance} Coins
                            </span>
                          </div>
                        </div>
                        <Button 
                          onClick={() => startInspection(vehicle)}
                          className="bg-gradient-to-r from-[#c56321] to-[#088145] hover:from-[#b55a1e] to-[#07713c]"
                        >
                          Start Inspection
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Inspection Screen
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl">Vehicle Inspection</h1>
          <p className="text-gray-600 mt-2">Complete comprehensive inspection and record findings</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep('lookup')}
        >
          ← Back to Search
        </Button>
      </div>

      {selectedVehicle && inspection && (
        <>
          {/* Green Coins Ribbon */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-green-600" />
                    <span>Green Coins: <strong>{selectedVehicle.coin_balance}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Pack: <strong>{inspection.coins_pack}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Covers: <strong>Engine Oil Change only</strong></span>
                  </div>
                </div>
                <Dialog open={showCoveredModal} onOpenChange={setShowCoveredModal}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-blue-600">
                      <HelpCircle className="h-4 w-4 mr-1" />
                      What's covered?
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Green Coins Coverage</DialogTitle>
                      <DialogDescription>
                        What's covered by your green coins package:
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 mt-3">
                      <div>
                        <div className="font-medium text-green-600">✅ Included:</div>
                        <p className="text-sm text-gray-600 mt-1">Engine Oil + Labour</p>
                      </div>
                      <div>
                        <div className="font-medium text-red-600">❌ Not Included:</div>
                        <p className="text-sm text-gray-600 mt-1">Filters, plugs, brakes, tyres, battery, AC, body, accessories. These appear as Additional Works after master approval.</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Odometer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Odometer Reading
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="odometer">Current Meter Reading *</Label>
                  <Input
                    id="odometer"
                    type="number"
                    value={odometer}
                    onChange={(e) => setOdometer(Number(e.target.value))}
                    placeholder="Enter current km"
                  />
                </div>
                <div className="flex items-end">
                  <p className="text-sm text-gray-600">
                    Next Service @ <strong>{odometer + 1500} km</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Covered Work */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                Engine Oil Change [Included by Coins]
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={engineOilChange}
                  onChange={(e) => setEngineOilChange(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Engine Oil Change (Default: On, once per visit)</span>
              </div>
            </CardContent>
          </Card>

          {/* Comprehensive Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>
                Comprehensive Inspection Checklist ({selectedVehicle.type})
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Complete inspection checklist organized by category. Mark each item as Good, Attention, or Critical.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Group checklist by category */}
                {Object.entries(
                  checklist.reduce((acc, item) => {
                    if (!acc[item.category]) acc[item.category] = [];
                    acc[item.category].push(item);
                    return acc;
                  }, {} as Record<string, ChecklistItem[]>)
                ).map(([category, items]) => (
                  <div key={category} className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-medium text-lg mb-4 text-gray-800 border-b pb-2">
                      {category} ({items.length} items)
                    </h3>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.code} className="bg-white border rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{item.label}</div>
                              <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                size="sm"
                                variant={item.status === 'good' ? "default" : "outline"}
                                onClick={() => updateChecklistItem(item.code, 'good')}
                                className={item.status === 'good' ? 'bg-green-600 hover:bg-green-700 text-white' : 'hover:bg-green-50 hover:border-green-300'}
                              >
                                ✓ Good
                              </Button>
                              <Button
                                size="sm"
                                variant={item.status === 'attention' ? "default" : "outline"}
                                onClick={() => updateChecklistItem(item.code, 'attention')}
                                className={item.status === 'attention' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'hover:bg-yellow-50 hover:border-yellow-300'}
                              >
                                ⚠ Attention
                              </Button>
                              <Button
                                size="sm"
                                variant={item.status === 'critical' ? 'destructive' : 'outline'}
                                onClick={() => updateChecklistItem(item.code, 'critical')}
                                className={item.status !== 'critical' ? 'hover:bg-red-50 hover:border-red-300' : ''}
                              >
                                ✕ Critical
                              </Button>
                            </div>
                          </div>
                          
                          {/* Status indicator */}
                          <div className="mb-3">
                            <Badge 
                              variant="outline" 
                              className={
                                item.status === 'good' ? 'bg-green-100 text-green-700 border-green-300' :
                                item.status === 'attention' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                                'bg-red-100 text-red-700 border-red-300'
                              }
                            >
                              Status: {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                            {item.status === 'critical' && (
                              <Badge variant="destructive" className="ml-2">
                                🔧 Requires Additional Work
                              </Badge>
                            )}
                          </div>
                          
                          {/* Notes and photo section */}
                          <div className="flex gap-3">
                            <div className="flex-1">
                              <Input
                                placeholder={`Add inspection notes for ${item.label}...`}
                                value={item.note}
                                onChange={(e) => updateChecklistItem(item.code, item.status, e.target.value)}
                                className="text-sm"
                              />
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="shrink-0"
                              onClick={() => {
                                toast.info(`Photo capture for ${item.label} - Feature coming soon!`);
                              }}
                            >
                              <Camera className="h-4 w-4 mr-1" />
                              Photo
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Checklist Summary */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Inspection Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {checklist.filter(item => item.status === 'good').length}
                    </div>
                    <div className="text-gray-600">Good</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {checklist.filter(item => item.status === 'attention').length}
                    </div>
                    <div className="text-gray-600">Attention</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {checklist.filter(item => item.status === 'critical').length}
                    </div>
                    <div className="text-gray-600">Critical</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Works */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-blue-500" />
                  Additional Works
                </CardTitle>
                <Button onClick={() => setShowAddWork(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Work
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {additionalWorks.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No additional work recommended yet
                </p>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-6 gap-3 text-sm font-medium border-b pb-2">
                    <span>Work</span>
                    <span>Parts ₹</span>
                    <span>Labour ₹</span>
                    <span>GST %</span>
                    <span>Total ₹</span>
                    <span></span>
                  </div>
                  {additionalWorks.map((work) => (
                    <div key={work.id} className="grid grid-cols-6 gap-3 text-sm border-b pb-2">
                      <span>{work.name}</span>
                      <span>₹{work.parts}</span>
                      <span>₹{work.labour}</span>
                      <span>{work.gst_pct}%</span>
                      <span>₹{work.total.toFixed(2)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeAdditionalWork(work.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Work Form */}
              {showAddWork && (
                <div className="mt-6 border-t pt-6">
                  <h4 className="mb-4">Add Additional Work</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="workName">Work Name *</Label>
                      <Input
                        id="workName"
                        value={newWork.name}
                        onChange={(e) => setNewWork(prev => ({...prev, name: e.target.value}))}
                        placeholder="e.g. Brake Pad Replacement"
                      />
                    </div>
                    <div>
                      <Label htmlFor="parts">Parts Cost (₹)</Label>
                      <Input
                        id="parts"
                        type="number"
                        value={newWork.parts}
                        onChange={(e) => setNewWork(prev => ({...prev, parts: Number(e.target.value)}))}
                        placeholder="1500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="labour">Labour Cost (₹)</Label>
                      <Input
                        id="labour"
                        type="number"
                        value={newWork.labour}
                        onChange={(e) => setNewWork(prev => ({...prev, labour: Number(e.target.value)}))}
                        placeholder="500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gst">GST %</Label>
                      <Input
                        id="gst"
                        type="number"
                        value={newWork.gst_pct}
                        onChange={(e) => setNewWork(prev => ({...prev, gst_pct: Number(e.target.value)}))}
                        placeholder="18"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button onClick={addAdditionalWork}>Add Work</Button>
                    <Button variant="outline" onClick={() => setShowAddWork(false)}>Cancel</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p>Coins Used: <strong>{inspection.coins_pack}</strong> (Oil change)</p>
                  <p>Additional Works: <strong>₹{additionalWorksTotal.toFixed(2)}</strong></p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photos
                  </Button>
                  <Button 
                    onClick={completeInspection}
                    className="bg-gradient-to-r from-[#c56321] to-[#088145] hover:from-[#b55a1e] to-[#07713c]"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Complete Inspection & Send to Master
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}