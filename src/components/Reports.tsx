import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { FileText, Download, TrendingUp, Calendar, DollarSign, Users, Car, Coins } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const revenueData = [
    { month: 'Jan', revenue: 45000, services: 85, coins: 425 },
    { month: 'Feb', revenue: 52000, services: 92, coins: 460 },
    { month: 'Mar', revenue: 48000, services: 88, coins: 440 },
    { month: 'Apr', revenue: 61000, services: 105, coins: 525 },
    { month: 'May', revenue: 58000, services: 98, coins: 490 },
    { month: 'Jun', revenue: 67000, services: 115, coins: 575 }
  ];

  const weeklyData = [
    { week: 'Week 1', services: 28, revenue: 14500 },
    { week: 'Week 2', services: 32, revenue: 16800 },
    { week: 'Week 3', services: 35, revenue: 18200 },
    { week: 'Week 4', services: 29, revenue: 15100 }
  ];

  const serviceTypes = [
    { name: '2W Services', value: 158, color: '#036b61', percentage: 62 },
    { name: '4W Services', value: 78, color: '#4aa370', percentage: 31 },
    { name: 'EV Services', value: 18, color: '#c56321', percentage: 7 }
  ];

  const performanceMetrics = [
    { metric: 'Average Service Time', value: '2.5 hours', change: '-15%', trend: 'positive' },
    { metric: 'Customer Satisfaction', value: '4.7/5', change: '+0.3', trend: 'positive' },
    { metric: 'On-Time Completion', value: '94%', change: '+7%', trend: 'positive' },
    { metric: 'Revenue per Service', value: '₹2,350', change: '+12%', trend: 'positive' }
  ];

  const topPerformers = [
    { name: 'Rajesh Kumar', services: 45, rating: 4.9, coins: 225 },
    { name: 'Amit Sharma', services: 38, rating: 4.8, coins: 190 },
    { name: 'Suresh Patel', services: 32, rating: 4.6, coins: 160 },
    { name: 'Vikram Singh', services: 28, rating: 4.7, coins: 140 }
  ];

  const reportCards = [
    {
      title: 'Monthly Revenue',
      value: '₹67,000',
      change: '+15.8%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'vs last month'
    },
    {
      title: 'Services Completed',
      value: '115',
      change: '+12.2%',
      icon: Car,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'this month'
    },
    {
      title: 'Green Coins Earned',
      value: '575',
      change: '+8.5%',
      icon: Coins,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      description: 'team total'
    },
    {
      title: 'Customer Retention',
      value: '87%',
      change: '+5.2%',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'repeat customers'
    }
  ];

  const handleDownload = (reportType: string) => {
    toast.info(`${reportType} report download will be available soon!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your service center performance</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline"
            onClick={() => handleDownload('Full Report')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="rounded-xl shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">{card.change}</span>
                      <span className="text-xs text-gray-500">{card.description}</span>
                    </div>
                  </div>
                  <div className={`${card.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue & Services Chart */}
      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#036b61]" />
            Revenue & Services Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#036b61" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#036b61" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="servicesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4aa370" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4aa370" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                stroke="#036b61" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#revenueGradient)" 
                name="Revenue (₹)" 
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="services" 
                stroke="#4aa370" 
                strokeWidth={3} 
                name="Services" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Service Types Distribution */}
        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-[#036b61]" />
              Service Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={serviceTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {serviceTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-2">
                {serviceTypes.map((type) => (
                  <div key={type.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: type.color }}
                      ></div>
                      <span className="text-sm">{type.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{type.value}</span>
                      <Badge variant="outline" className="text-xs">
                        {type.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#036b61]" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{metric.metric}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${
                      metric.trend === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium">{metric.change}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Performance */}
      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#036b61]" />
            Weekly Performance Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="services" fill="#036b61" name="Services" />
              <Bar yAxisId="right" dataKey="revenue" fill="#4aa370" name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#036b61]" />
            Top Performing Technicians
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#036b61] to-[#4aa370] rounded-full flex items-center justify-center text-white font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{performer.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                      <span>{performer.services} services</span>
                      <span>⭐ {performer.rating}</span>
                      <span className="flex items-center gap-1">
                        <Coins className="h-3 w-3 text-yellow-500" />
                        {performer.coins}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={index === 0 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-gray-50'}
                >
                  {index === 0 ? '🏆 Top Performer' : `#${index + 1}`}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Download Reports */}
      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#036b61]" />
            Download Detailed Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 justify-center p-4 h-auto"
              onClick={() => handleDownload('Revenue Report')}
            >
              <Download className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Revenue Report</p>
                <p className="text-xs text-gray-500">Detailed financial analysis</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 justify-center p-4 h-auto"
              onClick={() => handleDownload('Service Report')}
            >
              <Download className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Service Report</p>
                <p className="text-xs text-gray-500">Operations & performance</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 justify-center p-4 h-auto"
              onClick={() => handleDownload('Customer Report')}
            >
              <Download className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Customer Report</p>
                <p className="text-xs text-gray-500">Satisfaction & feedback</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}