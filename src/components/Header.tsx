import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Notification } from '../types';

interface HeaderProps {
  notifications: Notification[];
  showNotifications: boolean;
  onToggleNotifications: () => void;
  unreadCount: number;
}

export function Header({ notifications, showNotifications, onToggleNotifications, unreadCount }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex justify-between items-center fixed top-0 left-0 right-0 lg:left-64 z-20">
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="w-8 lg:w-10 h-8 lg:h-10 bg-gradient-to-br from-[#c56321] to-[#088145] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm lg:text-base">W</span>
        </div>
        <div className="hidden sm:block">
          <h1 className="text-lg lg:text-xl font-medium text-gray-900">Service Center Dashboard</h1>
          <p className="text-xs lg:text-sm text-gray-600">WayPartner Platform</p>
        </div>
        <div className="sm:hidden">
          <h1 className="text-base font-medium text-gray-900">Dashboard</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Mobile Quick Stats */}
        <div className="hidden sm:flex items-center gap-4 text-sm">
          <div className="text-center">
            <div className="font-medium text-green-600">₹45k</div>
            <div className="text-xs text-gray-500">Today</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-blue-600">12</div>
            <div className="text-xs text-gray-500">Active</div>
          </div>
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2"
            onClick={onToggleNotifications}
          >
            <Bell className="h-4 lg:h-5 w-4 lg:w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 lg:h-5 w-4 lg:w-5 flex items-center justify-center text-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}