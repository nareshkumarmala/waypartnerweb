import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Home, 
  Users, 
  Calendar, 
  ClipboardList, 
  Car, 
  MessageSquare, 
  Coins, 
  BarChart3, 
  Settings, 
  LogOut,
  Truck,
  Link,
  CheckCircle2,
  Bell,
  Wrench,
  Zap,
  Menu,
  BookOpen
} from 'lucide-react';
import { Screen, User } from '../types';

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  user: User;
  onLogout: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ currentScreen, onNavigate, user, onLogout, isOpen = true, onToggle }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: 'slot-booking', label: 'Slot Booking', icon: Calendar, badge: '6' },
    { id: 'mobile-inspection', label: 'Vehicle Inspection', icon: Wrench, badge: null },
    { id: 'vehicle-status', label: 'Vehicle Status', icon: Car, badge: '3' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, badge: null },
    { id: 'green-coins', label: 'Green Coins', icon: Coins, badge: null },
    { id: 'reports', label: 'Reports', icon: BarChart3, badge: null },
    { id: 'fleet', label: 'Fleet Management', icon: Truck, badge: null },
    { id: 'quick-navigation', label: 'Quick Navigation', icon: Zap, badge: 'New' },
    { id: 'operations-guide', label: 'Operations Guide', icon: BookOpen, badge: 'Help' },
    { id: 'external-link', label: 'External Links', icon: Link, badge: null },
    { id: 'additional-work-approval', label: 'Work Approval', icon: CheckCircle2, badge: '8' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="bg-white shadow-lg"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 flex flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        
        {/* Mobile close overlay */}
        {isOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={onToggle}
          />
        )}

        {/* Logo and Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#c56321] to-[#088145] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">W</span>
            </div>
            <div>
              <h2 className="font-medium text-gray-900">WayPartner</h2>
              <p className="text-sm text-gray-600">Service Center</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 bg-gradient-to-r from-[#c56321] to-[#088145] text-white flex-shrink-0">
          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="h-6 w-6 text-[#c56321]" />
            </div>
            <div className="text-sm font-medium">{user.name || 'Service Center'}</div>
            <div className="text-xs opacity-90">{user.email || 'Master Panel'}</div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto min-h-0">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-10 ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#c56321] to-[#088145] text-white hover:from-[#c56321] hover:to-[#088145]' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => {
                  onNavigate(item.id as Screen);
                  // Close mobile menu on navigation
                  if (window.innerWidth < 1024 && onToggle) {
                    onToggle();
                  }
                }}
              >
                <IconComponent className="h-4 w-4 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge 
                    variant={isActive ? "secondary" : "outline"} 
                    className={`ml-2 ${
                      isActive 
                        ? 'bg-white text-[#c56321]' 
                        : item.badge === 'New' 
                          ? 'bg-green-100 text-green-600 border-green-200'
                          : item.badge === 'Help'
                            ? 'bg-blue-100 text-blue-600 border-blue-200'
                            : 'bg-red-100 text-red-600 border-red-200'
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="text-sm font-medium text-gray-700">Today's Stats</div>
            <div className="flex justify-between text-xs">
              <span>Active: 45</span>
              <span>Pending: 8</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Completed: 12</span>
              <span>Revenue: ₹45k</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}