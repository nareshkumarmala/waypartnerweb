import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { BarChart3, Users, Car, TrendingUp, Clock, CheckCircle, AlertCircle, RefreshCw, Plus, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { toast } from "sonner@2.0.3";
import { EnhancedDashboard } from './EnhancedDashboard';
import { WorkTrackingSystem } from './WorkTrackingSystem';
import { MasterSuggestions } from './MasterSuggestions';

// Use singleton Supabase client
import { supabase, api } from '../lib/supabase-client';

interface DashboardStats {
  totalVehicles: number;
  twoWheelers: number;
  fourWheelers: number;
  totalBookings: number;
  completedServices: number;
  pendingServices: number;
  totalGreenCoins: number;
  totalKilometers: number;
  coinsEarned: number;
  coinsRedeemed: number;
}

export function Dashboard() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Dashboard Overview</TabsTrigger>
          <TabsTrigger value="work-tracking">Work Tracking</TabsTrigger>
          <TabsTrigger value="suggestions">AI Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <EnhancedDashboard />
        </TabsContent>
        
        <TabsContent value="work-tracking" className="space-y-6">
          <WorkTrackingSystem />
        </TabsContent>
        
        <TabsContent value="suggestions" className="space-y-6">
          <MasterSuggestions />
        </TabsContent>
      </Tabs>
    </div>
  );
}