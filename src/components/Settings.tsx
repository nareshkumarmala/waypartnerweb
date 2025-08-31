import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Settings as SettingsIcon, User, Bell, Database, Shield, Palette, Globe, Info } from 'lucide-react';
import { User as UserType } from '../types';
import { EnvironmentStatus } from './EnvironmentStatus';
import { EnvironmentChecker } from './EnvironmentChecker';
import { supabaseConfig } from '../lib/supabase-client';

interface SettingsProps {
  user: UserType;
  onUpdateUser: (user: UserType) => void;
}

export function Settings({ user, onUpdateUser }: SettingsProps) {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: true,
      push: true,
      newBookings: true,
      statusUpdates: true,
      payments: true
    },
    appearance: {
      theme: 'light',
      language: 'en',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY'
    },
    business: {
      centerName: 'WayPartner Service Center',
      phone: '+91 9876543210',
      email: 'support@waypartner.com',
      address: 'Hyderabad, Telangana',
      workingHours: '9:00 AM - 6:00 PM',
      holidays: 'Sunday'
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      dataBackup: true,
      auditLogs: true
    }
  });

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleProfileUpdate = (field: string, value: string) => {
    onUpdateUser({
      ...user,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account, preferences, and system configuration</p>
      </div>

      {/* Environment Status - Featured at top */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-[#036b61]" />
          <h2 className="text-xl font-semibold">System Configuration</h2>
          {supabaseConfig.isDemo && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
              Demo Mode
            </Badge>
          )}
        </div>
        <EnvironmentChecker />
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 gap-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={user.name}
                    onChange={(e) => handleProfileUpdate('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) => handleProfileUpdate('email', e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={user.phone}
                    onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue="manager">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Service Manager</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={user.address}
                  onChange={(e) => handleProfileUpdate('address', e.target.value)}
                  placeholder="Enter your address"
                />
              </div>
              
              <Button className="bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white">
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Notification Channels</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'email', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      checked={settings.notifications.sms}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'sms', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-600">Receive browser push notifications</p>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'push', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>New Bookings</Label>
                    <Switch
                      checked={settings.notifications.newBookings}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'newBookings', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Status Updates</Label>
                    <Switch
                      checked={settings.notifications.statusUpdates}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'statusUpdates', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Payment Confirmations</Label>
                    <Switch
                      checked={settings.notifications.payments}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'payments', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Business Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="centerName">Service Center Name</Label>
                  <Input
                    id="centerName"
                    value={settings.business.centerName}
                    onChange={(e) => handleSettingChange('business', 'centerName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input
                    id="businessPhone"
                    value={settings.business.phone}
                    onChange={(e) => handleSettingChange('business', 'phone', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={settings.business.email}
                    onChange={(e) => handleSettingChange('business', 'email', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workingHours">Working Hours</Label>
                  <Input
                    id="workingHours"
                    value={settings.business.workingHours}
                    onChange={(e) => handleSettingChange('business', 'workingHours', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Input
                  id="businessAddress"
                  value={settings.business.address}
                  onChange={(e) => handleSettingChange('business', 'address', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="holidays">Weekly Holidays</Label>
                <Input
                  id="holidays"
                  value={settings.business.holidays}
                  onChange={(e) => handleSettingChange('business', 'holidays', e.target.value)}
                  placeholder="e.g., Sunday"
                />
              </div>
              
              <Button className="bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white">
                Save Business Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance & Localization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={settings.appearance.theme}
                    onValueChange={(value) => handleSettingChange('appearance', 'theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={settings.appearance.language}
                    onValueChange={(value) => handleSettingChange('appearance', 'language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                      <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                      <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={settings.appearance.timezone}
                    onValueChange={(value) => handleSettingChange('appearance', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select
                    value={settings.appearance.dateFormat}
                    onValueChange={(value) => handleSettingChange('appearance', 'dateFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button className="bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white">
                Apply Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange('security', 'twoFactorAuth', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatic Data Backup</Label>
                    <p className="text-sm text-gray-600">Daily backup of your data</p>
                  </div>
                  <Switch
                    checked={settings.security.dataBackup}
                    onCheckedChange={(checked) => handleSettingChange('security', 'dataBackup', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Audit Logs</Label>
                    <p className="text-sm text-gray-600">Track all system activities</p>
                  </div>
                  <Switch
                    checked={settings.security.auditLogs}
                    onCheckedChange={(checked) => handleSettingChange('security', 'auditLogs', checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Select
                  value={settings.security.sessionTimeout.toString()}
                  onValueChange={(value) => handleSettingChange('security', 'sessionTimeout', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Security settings help protect your business data. Enable two-factor authentication 
                  for enhanced security.
                </AlertDescription>
              </Alert>
              
              <Button className="bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white">
                Update Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}