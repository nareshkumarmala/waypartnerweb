import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, AlertCircle, XCircle, Settings, Eye, EyeOff, Copy, ExternalLink } from 'lucide-react';
import { supabaseConfig, WayPartnerAPI } from '../lib/supabase-client';

interface EnvironmentCheck {
  name: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  required: boolean;
  action?: () => void;
}

export function EnvironmentStatus() {
  const [checks, setChecks] = useState<EnvironmentCheck[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [backendHealth, setBackendHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performEnvironmentChecks();
  }, []);

  const performEnvironmentChecks = async () => {
    setLoading(true);
    const results: EnvironmentCheck[] = [];

    // Check Supabase configuration
    if (supabaseConfig.hasRealCredentials) {
      results.push({
        name: 'Supabase Database',
        status: 'success',
        message: 'Connected to production database',
        required: true
      });
    } else {
      results.push({
        name: 'Supabase Database',
        status: 'warning',
        message: 'Using demo mode - add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY',
        required: true,
        action: () => window.open('https://supabase.com', '_blank')
      });
    }

    // Check backend health
    try {
      const health = await WayPartnerAPI.healthCheck();
      setBackendHealth(health);
      
      if (health.status === 'healthy') {
        results.push({
          name: 'Backend Services',
          status: 'success',
          message: 'All services operational',
          required: true
        });
      } else if (health.status === 'demo') {
        results.push({
          name: 'Backend Services',
          status: 'warning',
          message: 'Demo mode - limited functionality',
          required: true
        });
      } else {
        results.push({
          name: 'Backend Services',
          status: 'warning',
          message: 'Backend services available',
          required: true
        });
      }
    } catch (error) {
      results.push({
        name: 'Backend Services',
        status: 'error',
        message: 'Backend connection failed',
        required: true
      });
    }

    // Check environment variables
    const envVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_APP_URL'
    ];

    envVars.forEach(envVar => {
      const value = getEnvVar(envVar);
      if (value && value !== `https://demo-waypartner.supabase.co` && value !== 'demo-anon-key') {
        results.push({
          name: envVar,
          status: 'success',
          message: 'Configured',
          required: envVar.includes('SUPABASE')
        });
      } else {
        results.push({
          name: envVar,
          status: envVar.includes('SUPABASE') ? 'warning' : 'error',
          message: 'Not configured',
          required: envVar.includes('SUPABASE')
        });
      }
    });

    // Check optional services
    const optionalServices = [
      { name: 'WhatsApp Service', envVar: 'TWILIO_ACCOUNT_SID' },
      { name: 'Email Service', envVar: 'SENDGRID_API_KEY' },
      { name: 'Payment Gateway', envVar: 'RAZORPAY_KEY_ID' }
    ];

    optionalServices.forEach(service => {
      const value = getEnvVar(service.envVar);
      if (value) {
        results.push({
          name: service.name,
          status: 'success',
          message: 'Configured',
          required: false
        });
      } else {
        results.push({
          name: service.name,
          status: 'warning',
          message: 'Optional - not configured',
          required: false
        });
      }
    });

    // Check browser features
    if (typeof window !== 'undefined') {
      results.push({
        name: 'Browser Notifications',
        status: 'Notification' in window ? 'success' : 'warning',
        message: 'Notification' in window ? 'Supported' : 'Not supported',
        required: false
      });

      results.push({
        name: 'Local Storage',
        status: 'localStorage' in window ? 'success' : 'warning',
        message: 'localStorage' in window ? 'Available' : 'Not available',
        required: false
      });
    }

    setChecks(results);
    setLoading(false);
  };

  const getEnvVar = (key: string) => {
    if (typeof window !== 'undefined' && (window as any).env) {
      return (window as any).env[key];
    }
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[key];
    }
    return undefined;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Demo</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const copyEnvTemplate = () => {
    const template = `# WayPartner Environment Variables
VITE_SUPABASE_URL=https://vdcfryayuzdojutxdswb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_URL=https://waypartner.in

# Optional WhatsApp Services
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
DIALOG360_API_KEY=your-360dialog-api-key
GUPSHUP_API_KEY=your-gupshup-api-key

# Optional Email Services
SENDGRID_API_KEY=your-sendgrid-api-key

# Optional Payment
RAZORPAY_KEY_ID=your-razorpay-key-id`;

    navigator.clipboard.writeText(template).then(() => {
      alert('Environment template copied to clipboard!');
    });
  };

  const requiredChecks = checks.filter(c => c.required);
  const optionalChecks = checks.filter(c => !c.required);
  const hasErrors = requiredChecks.some(c => c.status === 'error');
  const hasWarnings = requiredChecks.some(c => c.status === 'warning');

  const overallStatus = hasErrors ? 'error' : hasWarnings ? 'warning' : 'success';

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#036b61] mx-auto mb-4"></div>
          <p>Checking environment configuration...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall Status */}
      <Card className={`border-l-4 ${
        overallStatus === 'success' ? 'border-l-green-500' :
        overallStatus === 'warning' ? 'border-l-yellow-500' :
        'border-l-red-500'
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(overallStatus)}
              <div>
                <CardTitle className="text-lg">Environment Status</CardTitle>
                <p className="text-sm text-gray-600">
                  {overallStatus === 'success' ? 'Production ready with Supabase database' :
                   overallStatus === 'warning' ? 'Running with production database' :
                   'Configuration required'}
                </p>
              </div>
            </div>
            {getStatusBadge(overallStatus)}
          </div>
        </CardHeader>
        <CardContent>
          {supabaseConfig.hasRealCredentials && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ✅ <strong>Production Mode Active:</strong> Your app is connected to Supabase database with real-time functionality. 
                WhatsApp integration ready (add API keys for notifications).
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={copyEnvTemplate}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy .env Template
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://supabase.com', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Setup Guide
            </Button>
          </div>

          {showDetails && (
            <div className="space-y-4">
              {/* Required Services */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Required Services
                </h4>
                <div className="space-y-2">
                  {requiredChecks.map((check, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(check.status)}
                        <span className="font-medium">{check.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{check.message}</span>
                        {check.action && (
                          <Button size="sm" variant="outline" onClick={check.action}>
                            Setup
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Services */}
              <div>
                <h4 className="font-medium mb-2">Optional Services</h4>
                <div className="space-y-2">
                  {optionalChecks.map((check, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(check.status)}
                        <span className="font-medium">{check.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">{check.message}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Backend Health */}
              {backendHealth && (
                <div>
                  <h4 className="font-medium mb-2">Backend Status</h4>
                  <div className="p-3 bg-gray-50 rounded">
                    <pre className="text-xs text-gray-600 overflow-x-auto">
                      {JSON.stringify(backendHealth, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Setup Guide - Only show if not fully production */}
      {!supabaseConfig.hasRealCredentials && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Setup Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#036b61] text-white text-xs flex items-center justify-center font-medium">1</div>
                <div>
                  <p className="font-medium">Create Supabase Account</p>
                  <p className="text-sm text-gray-600">Go to supabase.com and create a new project</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#036b61] text-white text-xs flex items-center justify-center font-medium">2</div>
                <div>
                  <p className="font-medium">Get API Keys</p>
                  <p className="text-sm text-gray-600">Copy URL and anon key from Project Settings → API</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#036b61] text-white text-xs flex items-center justify-center font-medium">3</div>
                <div>
                  <p className="font-medium">Create .env File</p>
                  <p className="text-sm text-gray-600">Add your Supabase credentials to environment variables</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#036b61] text-white text-xs flex items-center justify-center font-medium">4</div>
                <div>
                  <p className="font-medium">Deploy & Test</p>
                  <p className="text-sm text-gray-600">Your backend APIs will auto-create tables as needed</p>
                </div>
              </div>
            </div>

            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Good News:</strong> Your app works with demo data for testing. 
                Set up the database when you're ready for production use with real customers.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}