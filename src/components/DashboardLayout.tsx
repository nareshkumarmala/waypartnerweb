import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Toaster } from "sonner@2.0.3";
import { Screen, User, Notification } from '../types';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { NotificationOverlay } from './NotificationOverlay';
import { ScreenRouter } from './ScreenRouter';

interface DashboardLayoutProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  user: User;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  notifications: Notification[];
  showNotifications: boolean;
  onToggleNotifications: () => void;
  unreadCount: number;
}

export function DashboardLayout({
  currentScreen,
  onNavigate,
  user,
  onUpdateUser,
  onLogout,
  sidebarOpen,
  onToggleSidebar,
  notifications,
  showNotifications,
  onToggleNotifications,
  unreadCount
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex">
      <Sidebar 
        currentScreen={currentScreen} 
        onNavigate={onNavigate} 
        user={user} 
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onToggle={onToggleSidebar}
      />
      
      <main className="flex-1 lg:ml-64 min-h-screen">
        <Header
          notifications={notifications}
          showNotifications={showNotifications}
          onToggleNotifications={onToggleNotifications}
          unreadCount={unreadCount}
        />
        
        <div className="p-4 lg:p-6 pt-20 lg:pt-6">
          <ScreenRouter
            currentScreen={currentScreen}
            onNavigate={onNavigate}
            user={user}
            onLogin={() => {}}
            onUpdateUser={onUpdateUser}
          />
        </div>

        {showNotifications && (
          <NotificationOverlay 
            notifications={notifications}
            onClose={() => onToggleNotifications()}
          />
        )}
      </main>
      
      <Toaster />
      
      {/* Business efficiency helper - show keyboard shortcuts - Mobile responsive */}
      {user.isLoggedIn && (
        <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs text-gray-600 shadow-lg border max-w-xs hidden lg:block">
          <div className="text-xs font-medium mb-1">Quick Navigation:</div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div>Ctrl+1: Dashboard</div>
            <div>Ctrl+2: Booking</div>
            <div>Ctrl+3: Inspection</div>
            <div>Ctrl+4: Status</div>
            <div>Ctrl+5: Green Coins</div>
            <div>Ctrl+Q: Quick Nav</div>
            <div>Ctrl+N: Notifications</div>
          </div>
        </div>
      )}

      {/* Mobile Quick Action Button */}
      {user.isLoggedIn && (
        <div className="lg:hidden fixed bottom-4 right-4 z-30">
          <Button
            className="w-14 h-14 rounded-full bg-gradient-to-r from-[#c56321] to-[#088145] text-white shadow-lg"
            onClick={() => onNavigate('quick-navigation')}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}