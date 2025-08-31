import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { testSupabaseConnection, supabaseConfig, getEnvironmentStatus } from '../lib/supabase-client';

interface EnvironmentStatus {
  supabaseUrl: boolean;
  supabaseKey: boolean;
  validCredentials: boolean;
  mode: string;
  ready: boolean;
  envAccessible: boolean;
  importMetaAvailable: boolean;
}

export function EnvironmentChecker() {
  const [status, setStatus] = useState<EnvironmentStatus | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('checking');
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkEnvironment();
  }, []);

  const checkEnvironment = async () => {
    setIsLoading(true);
    
    try {
      // Check environment variables
      const envStatus = getEnvironmentStatus();
      setStatus(envStatus);

      // Test database connection
      setConnectionStatus('testing');
      const result = await testSupabaseConnection();
      setTestResult(result);
      setConnectionStatus(result.success ? 'connected' : 'failed');
    } catch (error) {
      console.error('Environment check failed:', error);
      setConnectionStatus('failed');
      setTestResult({ success: false, message: 'Check failed', error });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (isReady: boolean) => {
    if (isReady) {
      return <Badge className="bg-green-500 text-white">✅ Ready</Badge>;
    }
    return <Badge className="bg-red-500 text-white">❌ Not Configured</Badge>;
  };

  const getConnectionBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-green-500 text-white">🟢 Connected</Badge>;
      case 'testing':
        return <Badge className="bg-yellow-500 text-white">🟡 Testing...</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 text-white">🔴 Failed</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">⚪ Checking...</Badge>;
    }
  };

  if (!status) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Checking environment configuration...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">🔧 Environment Configuration</h3>
          <p className="text-sm text-gray-600 mb-4">
            WayPartner application environment status and database connectivity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Environment Access</span>
              {getStatusBadge(status.envAccessible)}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">import.meta Available</span>
              {getStatusBadge(status.importMetaAvailable)}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">VITE_SUPABASE_URL</span>
              {getStatusBadge(status.supabaseUrl)}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">VITE_SUPABASE_ANON_KEY</span>
              {getStatusBadge(status.supabaseKey)}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Valid Credentials</span>
              {getStatusBadge(status.validCredentials)}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Application Mode</span>
              <Badge className={status.mode === 'production' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}>
                {status.mode === 'production' ? '🚀 Production' : '🧪 Demo'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Connection</span>
              {getConnectionBadge()}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">System Status</span>
              {getStatusBadge(status.ready && connectionStatus === 'connected')}
            </div>
          </div>
        </div>

        {/* Environment Debug Information */}
        {!status.envAccessible && (
          <div className="mb-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <h4 className="font-medium mb-2 text-yellow-800">⚠️ Environment Variables Issue Detected</h4>
            <p className="text-sm text-yellow-700 mb-2">
              The app cannot access environment variables normally. Using fallback credentials:
            </p>
            <div className="text-xs font-mono bg-yellow-100 p-2 rounded border">
              <p>import.meta.env is {status.importMetaAvailable ? 'available' : 'undefined'}</p>
              <p>Using fallback production credentials ✅</p>
            </div>
          </div>
        )}

        {testResult && (
          <div className="mb-4 p-4 rounded-lg bg-gray-50">
            <h4 className="font-medium mb-2">Database Connection Test:</h4>
            <p className={`text-sm ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
              {testResult.message}
            </p>
            {testResult.error && (
              <details className="mt-2">
                <summary className="text-xs text-gray-500 cursor-pointer">Show error details</summary>
                <pre className="text-xs text-red-500 mt-2 overflow-auto bg-red-50 p-2 rounded">
                  {JSON.stringify(testResult.error, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Current Configuration:</h4>
              <p className="text-xs text-gray-500">
                URL: {supabaseConfig.url?.substring(0, 50)}...
              </p>
              <p className="text-xs text-gray-500">
                Key: {supabaseConfig.anonKey?.substring(0, 20)}...
              </p>
              <p className="text-xs text-gray-500">
                Source: {supabaseConfig.connectionSource} 
                {!status.envAccessible && ' (fallback active)'}
              </p>
            </div>
            <Button 
              onClick={checkEnvironment}
              disabled={isLoading}
              size="sm"
              className="bg-gradient-to-r from-[#c56321] to-[#088145] text-white"
            >
              {isLoading ? '⟳ Testing...' : '🔄 Recheck'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Status Summary */}
      <Card className="p-6">
        <div className="text-center">
          {status.ready && connectionStatus === 'connected' ? (
            <div className="text-green-600">
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="text-xl font-semibold mb-2">Production Ready!</h3>
              <p className="text-sm">
                Your WayPartner application is fully configured and connected to the production database.
                {!status.envAccessible && ' (Using fallback configuration)'}
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-green-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live database operations active</span>
              </div>
            </div>
          ) : status.validCredentials && connectionStatus === 'failed' ? (
            <div className="text-yellow-600">
              <div className="text-3xl mb-2">⚠️</div>
              <h3 className="text-xl font-semibold mb-2">Configuration OK, Connection Issue</h3>
              <p className="text-sm">
                Environment variables are working correctly, but database connection failed.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                This may be temporary - backend services might be starting up.
              </p>
            </div>
          ) : !status.envAccessible ? (
            <div className="text-blue-600">
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="text-xl font-semibold mb-2">Using Fallback Configuration</h3>
              <p className="text-sm">
                Environment variables couldn't be accessed normally, but the app is using fallback production credentials.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                This is common in some deployment environments and your app should work normally.
              </p>
            </div>
          ) : (
            <div className="text-red-600">
              <div className="text-3xl mb-2">🔧</div>
              <h3 className="text-xl font-semibold mb-2">Environment Configuration Needed</h3>
              <p className="text-sm">
                Please check that VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are properly set.
              </p>
              <div className="mt-4 text-xs bg-gray-100 p-3 rounded-lg text-left">
                <p className="font-mono">VITE_SUPABASE_URL=https://vdcfryayuzdojutxdswb.supabase.co</p>
                <p className="font-mono">VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}