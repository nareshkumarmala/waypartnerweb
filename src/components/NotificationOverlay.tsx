import React from 'react';
import { Notification } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Calendar, ClipboardCheck, MessageSquare, X, Dot } from 'lucide-react';

interface NotificationOverlayProps {
  notifications: Notification[];
  onClose: () => void;
}

export function NotificationOverlay({ notifications, onClose }: NotificationOverlayProps) {
  const getNotificationIcon = (message: string) => {
    if (message.toLowerCase().includes('booking')) return <Calendar className="h-4 w-4 text-blue-500" />;
    if (message.toLowerCase().includes('checklist')) return <ClipboardCheck className="h-4 w-4 text-green-500" />;
    if (message.toLowerCase().includes('feedback')) return <MessageSquare className="h-4 w-4 text-orange-500" />;
    return <Dot className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 z-50">
      <Card className="rounded-xl shadow-xl border-0 bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.message)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t bg-gray-50">
            <Button variant="ghost" className="w-full text-sm text-[#036b61] hover:bg-white">
              View All Notifications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}