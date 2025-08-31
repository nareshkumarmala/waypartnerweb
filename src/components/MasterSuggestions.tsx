import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  IndianRupee,
  Clock,
  Star,
  Target,
  Zap
} from 'lucide-react';

export function MasterSuggestions() {
  const suggestions = [
    {
      id: 1,
      type: 'efficiency',
      priority: 'high',
      icon: Clock,
      title: 'Optimize Service Time',
      description: 'Average service time is 15% higher than target. Consider reassigning Suresh Reddy to handle more 4-wheeler services.',
      action: 'Reassign Tasks',
      impact: 'Save 2-3 hours daily'
    },
    {
      id: 2,
      type: 'revenue',
      priority: 'medium',
      icon: IndianRupee,
      title: 'Increase Additional Work Approval',
      description: '3 additional works were ignored today. Following up with customers could increase revenue by ₹2,400.',
      action: 'Follow Up',
      impact: '₹2,400 potential revenue'
    },
    {
      id: 3,
      type: 'customer',
      priority: 'high',
      icon: Star,
      title: 'Customer Satisfaction Alert',
      description: 'TS09EA1234 customer waiting 30+ minutes for approval. Quick action needed to maintain satisfaction.',
      action: 'Approve Now',
      impact: 'Prevent negative feedback'
    },
    {
      id: 4,
      type: 'inventory',
      priority: 'medium',
      icon: AlertTriangle,
      title: 'Stock Management',
      description: 'Brake pads running low (5 units left). Reorder now to avoid service delays.',
      action: 'Reorder Stock',
      impact: 'Prevent delays'
    },
    {
      id: 5,
      type: 'performance',
      priority: 'low',
      icon: TrendingUp,
      title: 'Performance Improvement',
      description: 'Ravi Kumar completed 8 services today (above average). Consider giving incentive bonus.',
      action: 'Reward Performance',
      impact: 'Boost morale'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'efficiency': return 'text-blue-500';
      case 'revenue': return 'text-green-500';
      case 'customer': return 'text-purple-500';
      case 'inventory': return 'text-orange-500';
      case 'performance': return 'text-indigo-500';
      default: return 'text-gray-500';
    }
  };

  const quickActions = [
    { label: 'Send Pending Invoices', count: 3, action: 'send-invoices' },
    { label: 'Approve Waiting Works', count: 8, action: 'approve-works' },
    { label: 'Assign Technicians', count: 2, action: 'assign-tech' },
    { label: 'Update Stock Status', count: 1, action: 'update-stock' },
  ];

  const insights = [
    { 
      title: 'Daily Performance', 
      value: '85%', 
      change: '+5%', 
      trend: 'up',
      description: 'Above target performance today'
    },
    { 
      title: 'Customer Satisfaction', 
      value: '4.7/5', 
      change: '+0.2', 
      trend: 'up',
      description: 'Excellent customer feedback'
    },
    { 
      title: 'Revenue Growth', 
      value: '₹45,000', 
      change: '+12%', 
      trend: 'up',
      description: 'Strong revenue performance'
    },
    { 
      title: 'Service Efficiency', 
      value: '92%', 
      change: '-3%', 
      trend: 'down',
      description: 'Room for improvement'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Lightbulb className="h-6 w-6 text-yellow-500" />
        <h2>Master Insights & Suggestions</h2>
        <Badge variant="outline" className="ml-2">AI Powered</Badge>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.action}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Badge variant="destructive" className="mb-1">{action.count}</Badge>
                <span className="text-sm text-center">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Today's Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {insights.map((insight, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-2xl font-medium">{insight.value}</div>
                <div className="text-sm text-gray-600">{insight.title}</div>
                <div className={`text-sm flex items-center justify-center gap-1 ${
                  insight.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`h-3 w-3 ${insight.trend === 'down' ? 'rotate-180' : ''}`} />
                  {insight.change}
                </div>
                <div className="text-xs text-gray-500">{insight.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <div className="space-y-4">
        {suggestions.map((suggestion) => {
          const IconComponent = suggestion.icon;
          return (
            <Alert key={suggestion.id} className="border-l-4 border-l-orange-500">
              <IconComponent className={`h-4 w-4 ${getTypeColor(suggestion.type)}`} />
              <AlertDescription className="ml-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{suggestion.title}</span>
                      <Badge variant={getPriorityColor(suggestion.priority)} className="text-xs">
                        {suggestion.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                    <div className="text-xs text-green-600 font-medium">
                      Expected Impact: {suggestion.impact}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="ml-4">
                    {suggestion.action}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          );
        })}
      </div>

      {/* Additional Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Long-term Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Users className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-blue-900">Staff Training</div>
              <div className="text-sm text-blue-700">Consider advanced training for technicians to reduce service time by 20%</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <div className="font-medium text-green-900">Process Optimization</div>
              <div className="text-sm text-green-700">Implement digital checklist to speed up inspections by 30%</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <Star className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <div className="font-medium text-purple-900">Customer Experience</div>
              <div className="text-sm text-purple-700">Add real-time SMS updates to improve customer satisfaction scores</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}