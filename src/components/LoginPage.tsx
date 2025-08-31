import React, { useState } from 'react';
import { Screen, User } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, Car, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LoginPageProps {
  onNavigate: (screen: Screen) => void;
  onLogin: (user: User) => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    address: '',
    owner: '',
    contact: '',
    email: '',
    panGst: '',
    services: [] as string[],
    termsAccepted: false
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast.error('Please fill in all fields');
      return;
    }

    const user: User = {
      name: 'Service Center Owner',
      email: loginForm.email,
      phone: '9876543210',
      address: '123 Service Street, City',
      services: ['2W', '4W'],
      isLoggedIn: true
    };

    onLogin(user);
    toast.success('Login successful! Welcome to WayPartner Dashboard');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email || !registerForm.termsAccepted) {
      toast.error('Please fill in all required fields and accept terms');
      return;
    }

    const user: User = {
      name: registerForm.name,
      email: registerForm.email,
      phone: registerForm.contact,
      address: registerForm.address,
      services: registerForm.services,
      isLoggedIn: true
    };

    onLogin(user);
    toast.success('Registration successful! Welcome to WayPartner Dashboard');
  };

  const handleServiceToggle = (service: string) => {
    setRegisterForm(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] via-white to-[#f0f9ff]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Login/Register Form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <Card className="w-full max-w-2xl rounded-xl shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#c56321] to-[#088145] rounded-xl flex items-center justify-center">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">WayPartner Service Center</CardTitle>
                <p className="text-sm text-gray-500">Join our network of trusted partners</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email or Phone</Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="Enter your email or phone"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="h-12"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button variant="link" className="p-0 text-sm text-[#036b61]">
                      Forgot Password?
                    </Button>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white hover:shadow-lg transition-all h-12"
                  >
                    Login to Dashboard
                  </Button>

                  {/* Demo credentials */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-blue-800 font-medium">Demo Credentials:</p>
                    <p className="text-sm text-blue-700">Email: demo@waypartner.com</p>
                    <p className="text-sm text-blue-700">Password: demo123</p>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Service Center Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter service center name"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="owner">Owner Name</Label>
                      <Input
                        id="owner"
                        placeholder="Enter owner name"
                        value={registerForm.owner}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, owner: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter complete address"
                      value={registerForm.address}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Number</Label>
                      <Input
                        id="contact"
                        placeholder="Enter contact number"
                        value={registerForm.contact}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, contact: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email Address *</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="Enter email address"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pangst">PAN/GST Number</Label>
                    <Input
                      id="pangst"
                      placeholder="Enter PAN or GST number"
                      value={registerForm.panGst}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, panGst: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Services Offered *</Label>
                    <div className="flex gap-4">
                      {['2W', '4W', 'EV'].map(service => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox 
                            id={service}
                            checked={registerForm.services.includes(service)}
                            onCheckedChange={() => handleServiceToggle(service)}
                          />
                          <Label htmlFor={service} className="text-sm">{service}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms"
                      checked={registerForm.termsAccepted}
                      onCheckedChange={(checked) => setRegisterForm(prev => ({ ...prev, termsAccepted: checked as boolean }))}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I accept the <span className="text-[#036b61]">Terms and Conditions</span> and <span className="text-[#036b61]">Privacy Policy</span> *
                    </Label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white hover:shadow-lg transition-all h-12"
                  >
                    Register Service Center
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}