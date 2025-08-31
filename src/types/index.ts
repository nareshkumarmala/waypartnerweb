export type Screen = 'home' | 'login' | 'dashboard' | 'slot-booking' | 'inspection' | 'mobile-inspection' | 'vehicle-status' | 'feedback' | 'green-coins' | 'reports' | 'settings' | 'fleet' | 'external-link' | 'additional-work-approval' | 'quick-navigation' | 'operations-guide';

export interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  services: string[];
  isLoggedIn: boolean;
  vehicleType?: '2-wheeler' | '4-wheeler';
  vehicleNumber?: string;
  greenCoinsUsed?: number;
  freeServiceEligible?: boolean;
}

export interface AdditionalWork {
  id: string;
  serviceName: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  isApproved: boolean;
  notes: string;
}

export interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}