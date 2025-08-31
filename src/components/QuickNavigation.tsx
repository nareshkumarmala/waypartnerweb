import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Calendar, 
  Car, 
  Coins, 
  Clock, 
  Users, 
  FileText, 
  Settings, 
  Wrench,
  BarChart3,
  MessageSquare,
  Bell,
  Plus,
  Search,
  Filter,
  BookOpen
} from 'lucide-react';
import { Screen } from '../App';

interface QuickNavigationProps {
  onNavigate: (screen: Screen) => void;
}

export function QuickNavigation({ onNavigate }: QuickNavigationProps) {
  const quickActions = [
    {
      title: 'Book for Master',
      description: 'Schedule master appointment',
      icon: Calendar,
      action: () => onNavigate('slot-booking'),
      color: 'bg-blue-500',
      urgency: 'high'
    },
    {
      title: 'Vehicle Inspection',
      description: 'Start inspection checklist',
      icon: Wrench,
      action: () => onNavigate('mobile-inspection'),
      color: 'bg-green-500',
      urgency: 'high'
    },
    {
      title: 'Check Status',
      description: 'View vehicle service status',
      icon: Car,
      action: () => onNavigate('vehicle-status'),
      color: 'bg-orange-500',
      urgency: 'medium'
    },
    {
      title: 'Green Coins',
      description: 'Manage master rewards',
      icon: Coins,
      action: () => onNavigate('green-coins'),
      color: 'bg-yellow-500',
      urgency: 'low'
    },
    {
      title: 'Operations Guide',
      description: 'Best practices & tips',
      icon: BookOpen,
      action: () => onNavigate('operations-guide'),
      color: 'bg-purple-500',
      urgency: 'low'
    }
  ];

  const recentActivities = [
    { id: 1, vehicle: 'TS09EA1234', action: 'Inspection Started', time: '2 mins ago', status: 'in-progress' },
    { id: 2, vehicle: 'KA05MN5678', action: 'Service Completed', time: '15 mins ago', status: 'completed' },
    { id: 3, vehicle: 'AP09BC9012', action: 'Booking Confirmed', time: '30 mins ago', status: 'scheduled' },
    { id: 4, vehicle: 'TN10CD3456', action: 'Payment Pending', time: '1 hour ago', status: 'pending' }
  ];

  const pendingTasks = [
    { id: 1, task: 'Get master approval for additional work KA05MN5678', priority: 'high', count: 3 },
    { id: 2, task: 'Send invoices for completed services', priority: 'medium', count: 5 },
    { id: 3, task: 'Schedule follow-up calls', priority: 'low', count: 8 },
    { id: 4, task: 'Update inventory levels', priority: 'medium', count: 2 }
  ];

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Quick Navigation</h1>
          <p className="text-gray-600 mt-1">Fast access to frequently used features</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 hover:scale-105"
                style={{ borderLeftColor: action.color.replace('bg-', '#') }}
                onClick={action.action}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${action.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                      <Badge 
                        variant="outline" 
                        className={`mt-2 ${
                          action.urgency === 'high' ? 'border-red-200 text-red-600' :
                          action.urgency === 'medium' ? 'border-orange-200 text-orange-600' :
                          'border-green-200 text-green-600'
                        }`}
                      >
                        {action.urgency} priority
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activities & Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{activity.vehicle}</span>
                      <Badge 
                        variant="outline" 
                        className={`${
                          activity.status === 'completed' ? 'bg-green-100 text-green-600 border-green-200' :
                          activity.status === 'in-progress' ? 'bg-blue-100 text-blue-600 border-blue-200' :
                          activity.status === 'scheduled' ? 'bg-orange-100 text-orange-600 border-orange-200' :
                          'bg-red-100 text-red-600 border-red-200'
                        }`}
                      >
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Pending Tasks
            </CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.task}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={`${
                          task.priority === 'high' ? 'bg-red-100 text-red-600 border-red-200' :
                          task.priority === 'medium' ? 'bg-orange-100 text-orange-600 border-orange-200' :
                          'bg-green-100 text-green-600 border-green-200'
                        }`}
                      >
                        {task.priority}
                      </Badge>
                      <span className="text-xs text-gray-500">{task.count} items</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Today's Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-blue-700">New Bookings</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">5</div>
              <div className="text-sm text-orange-700">In Progress</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">₹45k</div>
              <div className="text-sm text-purple-700">Revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}