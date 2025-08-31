import React from 'react';
import { Screen, User } from '../types';

// Component imports
import { HomePage } from './HomePage';
import { Dashboard } from './Dashboard';
import { LoginPage } from './LoginPage';
import { SlotBooking } from './SlotBooking';
import { GreenCoins } from './GreenCoins';
import { VehicleStatus } from './VehicleStatus';
import { Feedback } from './Feedback';
import { Reports } from './Reports';
import { FleetDashboard } from './FleetDashboard';
import { AdditionalWorkApproval } from './AdditionalWorkApproval';
import { ExternalLinkHandler } from './ExternalLinkHandler';
import { InspectionChecklist } from './InspectionChecklist';
import { Settings } from './Settings';
import { QuickNavigation } from './QuickNavigation';
import { ServiceOperationsGuide } from './ServiceOperationsGuide';

interface ScreenRouterProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  user: User;
  onLogin: (user: User) => void;
  onUpdateUser: (user: User) => void;
}

export function ScreenRouter({ currentScreen, onNavigate, user, onLogin, onUpdateUser }: ScreenRouterProps) {
  switch (currentScreen) {
    case 'home':
      return <HomePage onNavigate={onNavigate} />;
    case 'login':
      return <LoginPage onNavigate={onNavigate} onLogin={onLogin} />;
    case 'dashboard':
      return <Dashboard />;
    case 'slot-booking':
      return <SlotBooking />;
    case 'mobile-inspection':
      return <InspectionChecklist />;
    case 'vehicle-status':
      return <VehicleStatus />;
    case 'feedback':
      return <Feedback />;
    case 'green-coins':
      return <GreenCoins onNavigate={onNavigate} />;
    case 'reports':
      return <Reports />;
    case 'settings':
      return <Settings user={user} onUpdateUser={onUpdateUser} />;
    case 'fleet':
      return <FleetDashboard />;
    case 'external-link':
      return <ExternalLinkHandler />;
    case 'additional-work-approval':
      return <AdditionalWorkApproval />;
    case 'quick-navigation':
      return <QuickNavigation onNavigate={onNavigate} />;
    case 'operations-guide':
      return <ServiceOperationsGuide />;
    default:
      return <HomePage onNavigate={onNavigate} />;
  }
}