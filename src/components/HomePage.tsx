import React from 'react';
import { Screen } from '../App';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Car, Coins, Calendar, Zap, Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface HomePageProps {
  onNavigate: (screen: Screen) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const benefits = [
    {
      icon: Coins,
      title: 'Earn Green Coins',
      description: 'Innovative rewards system for customer retention and loyalty building.'
    },
    {
      icon: Calendar,
      title: 'Smart Slot Management',
      description: 'Efficiently manage bookings with our intelligent slot booking system.'
    },
    {
      icon: Users,
      title: 'Master Communication Hub',
      description: 'Seamless communication with vehicle masters via phone and WhatsApp integration.'
    },
    {
      icon: Zap,
      title: 'Faster Billing & Reports',
      description: 'Streamlined billing process with automated report generation.'
    }
  ];

  const stats = [
    { icon: CheckCircle, value: 'Coming Soon', label: 'Beta Testing Phase' },
    { icon: Clock, value: 'Early Access', label: 'Pilot Program' },
    { icon: TrendingUp, value: 'Free Trial', label: 'No Setup Costs' },
    { icon: Users, value: 'Join Now', label: 'Limited Spots' }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#c56321] to-[#088145] rounded-lg flex items-center justify-center">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-medium text-gray-900">WayPartner</h1>
              <p className="text-sm text-gray-500">Service Center Platform</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => onNavigate('login')}
              className="bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white border-0 hover:shadow-lg transition-all"
            >
              Login
            </Button>
            <Button 
              onClick={() => onNavigate('login')}
              className="bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white hover:shadow-lg transition-all"
            >
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#f5f5f5] via-white to-[#f0f9ff] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Partner with WayPartner & 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c56321] to-[#088145]">
                  {' '}Transform Vehicle Service!
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Be among the first service centers to pilot our innovative platform that transforms 
                how you manage bookings, inspections, and customer relationships with green coins rewards.
              </p>
              
              <div className="flex gap-4">
                <Button 
                  size="lg"
                  onClick={() => onNavigate('login')}
                  className="bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white hover:shadow-xl transition-all px-8 py-3"
                >
                  Join Beta Program
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-3"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1698998882494-57c3e043f340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwc2VydmljZSUyMG1lY2hhbmljJTIwd29ya3Nob3B8ZW58MXx8fHwxNzU1MzE3MjU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Vehicle service center"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg border animate-pulse">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Service Complete!</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg border">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">+5 Green Coins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Building the Future of Vehicle Service
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              WayPartner is being developed to solve real problems faced by service centers today. 
              We're not just another software - we're building a comprehensive ecosystem that connects 
              service centers with vehicle masters through innovative technology and green rewards.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  We envision a world where every vehicle service interaction is seamless, transparent, 
                  and rewarding for both service centers and vehicle owners.
                </p>
                <p>
                  Through our green coins system, we're creating India's first vehicle service loyalty 
                  program that incentivizes regular maintenance and builds long-term relationships.
                </p>
                <p>
                  This beta program is our first step toward that vision. We're starting small, 
                  learning fast, and building something truly valuable for the vehicle service industry.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Current Development Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Platform Core</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Ready</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Beta Testing</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">In Progress</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Mobile Apps</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Planned</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">API Integration</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose WayPartner?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to run a modern, efficient vehicle service center.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#c56321] to-[#088145] rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-[#f5f5f5] to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join Our Exclusive Pilot Program
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Be part of the future of vehicle service management. Limited early access spots available.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#c56321] to-[#088145] rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Beta Program Section */}
      <section className="py-20 bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="bg-white/10 rounded-lg p-2 inline-block mb-6">
            <span className="text-sm font-medium">🚀 BETA PROGRAM LAUNCHING SOON</span>
          </div>
          <h2 className="text-3xl font-bold mb-6">
            Ready to Be a Pioneer in Vehicle Service?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            We're developing WayPartner with real service centers. Join our beta program to shape the future of vehicle service management.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-medium mb-2">✅ What You Get</h3>
              <ul className="text-sm text-white/80 space-y-1">
                <li>• Free platform access</li>
                <li>• Priority feature requests</li>
                <li>• Direct developer support</li>
                <li>• Training & onboarding</li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-medium mb-2">🎯 What We Need</h3>
              <ul className="text-sm text-white/80 space-y-1">
                <li>• Active service center</li>
                <li>• 20+ vehicles/month</li>
                <li>• Feedback & suggestions</li>
                <li>• 3-month commitment</li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-medium mb-2">📅 Timeline</h3>
              <ul className="text-sm text-white/80 space-y-1">
                <li>• Applications: Open now</li>
                <li>• Beta launch: January 2025</li>
                <li>• Duration: 3 months</li>
                <li>• Full launch: April 2025</li>
              </ul>
            </div>
          </div>
          
          <Button 
            size="lg"
            variant="outline"
            className="bg-white text-[#036b61] border-white hover:bg-gray-100 px-8 py-3"
            onClick={() => onNavigate('login')}
          >
            Apply for Beta Access
          </Button>
          <p className="text-sm text-white/70 mt-4">
            Limited to 50 service centers • No upfront costs • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}