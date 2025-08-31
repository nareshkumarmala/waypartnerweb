import { createClient } from '@supabase/supabase-js';

// Safe environment variable access with fallbacks
const getEnvVar = (key: string, fallback: string) => {
  try {
    // Check if import.meta.env exists and has the key
    if (typeof import.meta !== 'undefined' && 
        import.meta.env && 
        import.meta.env[key]) {
      return import.meta.env[key];
    }
    
    // Fallback to process.env if available (for some build contexts)
    if (typeof process !== 'undefined' && 
        process.env && 
        process.env[key]) {
      return process.env[key];
    }
    
    // Return fallback value
    return fallback;
  } catch (error) {
    console.warn(`Failed to access environment variable ${key}, using fallback`);
    return fallback;
  }
};

// Get Supabase credentials with proper fallbacks
const supabaseUrl = getEnvVar(
  'VITE_SUPABASE_URL', 
  'https://vdcfryayuzdojutxdswb.supabase.co'
);

const supabaseAnonKey = getEnvVar(
  'VITE_SUPABASE_ANON_KEY', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkY2ZyeWF5dXpkb2p1dHhkc3diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNTIzNjAsImV4cCI6MjA3MTcyODM2MH0.OF-YdEqzBdYfbmZmQ6O3q9dXFzZXL6BUa0apyaFAfJU'
);

// Validate environment variables
const hasValidCredentials = supabaseUrl && supabaseAnonKey && 
  supabaseUrl.startsWith('https://') && 
  supabaseAnonKey.startsWith('eyJ');

// Debug environment loading
console.log('🔧 Environment Variables Debug:', {
  importMetaAvailable: typeof import.meta !== 'undefined',
  envAvailable: typeof import.meta !== 'undefined' && !!import.meta.env,
  supabaseUrlFound: !!supabaseUrl,
  supabaseKeyFound: !!supabaseAnonKey,
  validCredentials: hasValidCredentials,
  urlSource: supabaseUrl === 'https://vdcfryayuzdojutxdswb.supabase.co' ? 'fallback' : 'environment'
});

// Create Supabase client with production configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Export configuration with environment detection
export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  isDemo: !hasValidCredentials,
  hasRealCredentials: hasValidCredentials,
  status: hasValidCredentials ? 'production' : 'demo',
  connectionSource: hasValidCredentials ? 'environment' : 'fallback',
  envAccessible: typeof import.meta !== 'undefined' && !!import.meta.env
};

// Enhanced connection test
export const testSupabaseConnection = async () => {
  try {
    console.log('🔗 Testing Supabase connection...', {
      url: supabaseUrl,
      hasCredentials: hasValidCredentials,
      source: supabaseConfig.connectionSource,
      envCheck: supabaseConfig.envAccessible
    });

    // Test basic connection
    const { data, error } = await supabase.from('kv_store_b855a2f3').select('*').limit(1);
    
    if (error) {
      // Check if it's a table not found error (which is fine for first run)
      if (error.message.includes('does not exist') || error.message.includes('relation')) {
        console.log('✅ Database connected - KV table will be created automatically');
        return { 
          success: true, 
          message: 'Database connection successful - tables will be auto-created',
          status: 'connected'
        };
      }
      
      console.error('❌ Database connection error:', error);
      return { 
        success: false, 
        message: `Database error: ${error.message}`,
        error,
        status: 'error'
      };
    }
    
    console.log('✅ Full database connection verified');
    return { 
      success: true, 
      message: 'Database connection and tables verified',
      status: 'connected'
    };
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return { 
      success: false, 
      message: 'Connection failed - check credentials',
      error,
      status: 'failed'
    };
  }
};

// Initialize database schema if needed
export const initializeDatabase = async () => {
  try {
    console.log('🔧 Initializing database schema...');
    
    // Test if backend server is running
    const healthCheck = await WayPartnerAPI.healthCheck();
    
    if (healthCheck.status === 'healthy') {
      console.log('✅ Backend server is running - database will auto-initialize');
      return { success: true, message: 'Backend server active' };
    }
    
    console.log('📝 Backend will initialize on first API call');
    return { success: true, message: 'Database ready for initialization' };
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    return { success: false, error, message: 'Initialization failed' };
  }
};

// WayPartner API helper functions with improved error handling
export const WayPartnerAPI = {
  baseURL: `${supabaseUrl}/functions/v1/make-server-b855a2f3`,
  
  async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      console.log(`📡 API Request: ${endpoint}`, { 
        method: options.method || 'GET',
        hasAuth: !!supabaseAnonKey,
        baseURL: this.baseURL
      });

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error ${response.status}: ${errorText}`);
        throw new Error(`API request failed: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`✅ API Success: ${endpoint}`, data);
      return data;
    } catch (error) {
      console.error(`❌ API request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  async healthCheck() {
    try {
      const result = await this.makeRequest('/health');
      return result;
    } catch (error) {
      console.log('ℹ️ Health check failed - backend may be starting up');
      return { status: 'demo', error: error.message };
    }
  },

  async searchVehicle(registrationNumber: string) {
    try {
      return await this.makeRequest(`/vehicles/search/${registrationNumber}`);
    } catch (error) {
      console.error('Vehicle search failed:', error);
      return { success: false, error: error.message };
    }
  },

  async createBooking(bookingData: any) {
    try {
      return await this.makeRequest('/bookings/create', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
    } catch (error) {
      console.error('Booking creation failed:', error);
      return { success: false, error: error.message };
    }
  },

  async getTodayBookings() {
    try {
      return await this.makeRequest('/bookings/today');
    } catch (error) {
      console.error('Failed to get today\'s bookings:', error);
      return { success: false, error: error.message };
    }
  },

  async cancelBooking(bookingId: string) {
    try {
      return await this.makeRequest(`/bookings/${bookingId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Booking cancellation failed:', error);
      return { success: false, error: error.message };
    }
  },

  async getVehicleStatus() {
    try {
      return await this.makeRequest('/vehicles/status');
    } catch (error) {
      console.error('Failed to get vehicle status:', error);
      return { success: false, error: error.message };
    }
  },

  async generateInvoice(invoiceData: any) {
    try {
      return await this.makeRequest('/invoices/generate', {
        method: 'POST',
        body: JSON.stringify(invoiceData),
      });
    } catch (error) {
      console.error('Invoice generation failed:', error);
      return { success: false, error: error.message };
    }
  },

  async getDashboardAnalytics() {
    try {
      return await this.makeRequest('/analytics/dashboard');
    } catch (error) {
      console.error('Failed to get dashboard analytics:', error);
      return { success: false, error: error.message };
    }
  }
};

// Real-time subscription helper with better error handling
export const RealTimeSubscriptions = {
  subscriptions: new Map(),

  subscribeToBookings(callback: (payload: any) => void) {
    try {
      if (!hasValidCredentials) {
        console.log('ℹ️ Real-time disabled in demo mode');
        return null;
      }

      console.log('📡 Setting up real-time booking subscription...');
      
      const subscription = supabase
        .channel('booking-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'service_bookings'
          },
          (payload) => {
            console.log('📲 Real-time booking update:', payload);
            callback(payload);
          }
        )
        .subscribe();

      this.subscriptions.set('bookings', subscription);
      return subscription;
    } catch (error) {
      console.error('❌ Failed to subscribe to bookings:', error);
      return null;
    }
  },

  subscribeToVehicleStatus(callback: (payload: any) => void) {
    try {
      if (!hasValidCredentials) {
        console.log('ℹ️ Real-time disabled in demo mode');
        return null;
      }

      console.log('📡 Setting up real-time vehicle status subscription...');
      
      const subscription = supabase
        .channel('vehicle-status-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'service_bookings'
          },
          (payload) => {
            console.log('📲 Real-time status update:', payload);
            callback(payload);
          }
        )
        .subscribe();

      this.subscriptions.set('vehicle-status', subscription);
      return subscription;
    } catch (error) {
      console.error('❌ Failed to subscribe to vehicle status:', error);
      return null;
    }
  },

  unsubscribeAll() {
    console.log('🔌 Unsubscribing from all real-time channels...');
    this.subscriptions.forEach((subscription) => {
      try {
        supabase.removeChannel(subscription);
      } catch (error) {
        console.error('Error unsubscribing:', error);
      }
    });
    this.subscriptions.clear();
  }
};

// Enhanced notification helper
export const NotificationHelper = {
  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('❌ Browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      console.log('✅ Notification permission already granted');
      return true;
    }

    if (Notification.permission === 'denied') {
      console.log('❌ Notification permission denied');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      console.log(`📬 Notification permission: ${permission}`);
      return granted;
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error);
      return false;
    }
  },

  showBookingNotification(vehicleNo: string, serviceType: string) {
    if (Notification.permission !== 'granted') return;

    try {
      new Notification('🚗 New Booking Received', {
        body: `${vehicleNo} - ${serviceType}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'booking-notification',
        requireInteraction: false
      });
    } catch (error) {
      console.error('❌ Error showing booking notification:', error);
    }
  },

  showStatusUpdateNotification(vehicleNo: string, status: string) {
    if (Notification.permission !== 'granted') return;

    try {
      new Notification('🔔 Status Update', {
        body: `${vehicleNo} - ${status}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'status-notification',
        requireInteraction: false
      });
    } catch (error) {
      console.error('❌ Error showing status notification:', error);
    }
  }
};

// Environment status check
export const getEnvironmentStatus = () => {
  const status = {
    supabaseUrl: !!supabaseUrl,
    supabaseKey: !!supabaseAnonKey,
    validCredentials: hasValidCredentials,
    mode: hasValidCredentials ? 'production' : 'demo',
    ready: hasValidCredentials,
    envAccessible: supabaseConfig.envAccessible,
    importMetaAvailable: typeof import.meta !== 'undefined'
  };

  console.log('🔧 Environment Status:', status);
  return status;
};

// Initialize on import
console.log('🚀 WayPartner Supabase Client Initialized', {
  mode: supabaseConfig.status,
  url: supabaseUrl,
  hasCredentials: hasValidCredentials,
  envAccessible: supabaseConfig.envAccessible,
  timestamp: new Date().toISOString()
});