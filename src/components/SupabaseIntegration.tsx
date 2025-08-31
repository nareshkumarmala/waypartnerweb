import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, subscriptions, User, Vehicle, SlotBooking, AdditionalWork, WorkTask, Notification } from '../lib/supabase';
import { toast } from 'sonner@2.0.3';

// Context for global state management
interface AppContextType {
  user: User | null;
  vehicles: Vehicle[];
  bookings: SlotBooking[];
  additionalWorks: AdditionalWork[];
  workTasks: WorkTask[];
  notifications: Notification[];
  dashboardStats: any;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  createBooking: (bookingData: any) => Promise<void>;
  approveAdditionalWork: (workId: string) => Promise<void>;
  rejectAdditionalWork: (workId: string, reason: string) => Promise<void>;
  updateWorkTaskStatus: (taskId: string, status: string, notes?: string) => Promise<void>;
  addGreenCoins: (vehicleId: string, coins: number, kmDriven: number) => Promise<void>;
  generateInvoice: (bookingId: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<SlotBooking[]>([]);
  const [additionalWorks, setAdditionalWorks] = useState<AdditionalWork[]>([]);
  const [workTasks, setWorkTasks] = useState<WorkTask[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>({});

  // Initialize data when user logs in
  useEffect(() => {
    if (user) {
      refreshData();
      setupSubscriptions();
    }
  }, [user]);

  const refreshData = async () => {
    try {
      if (!user) return;

      // Load dashboard stats
      const stats = await api.getDashboardStats();
      setDashboardStats(stats);

      // Load today's bookings
      const today = new Date().toISOString().split('T')[0];
      const todayBookings = await api.getBookingsByDate(today);
      setBookings(todayBookings);

      // Load notifications
      const userNotifications = await api.getUserNotifications(user.id);
      setNotifications(userNotifications);

      // Load vehicles for masters
      if (user.role === 'master') {
        // For demo, we'll use mock data
        // In real implementation, you'd fetch all vehicles
        setVehicles([
          {
            id: '1',
            vehicle_number: 'TS09EA1234',
            vehicle_type: '2-wheeler',
            owner_id: 'customer1',
            make: 'Honda',
            model: 'Activa',
            year: 2022,
            green_coins_balance: 150,
            total_km_driven: 15000,
            last_service_date: '2025-01-20',
            next_service_due: '2025-04-20',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2025-01-20T00:00:00Z'
          },
          {
            id: '2',
            vehicle_number: 'KA05MN5678',
            vehicle_type: '4-wheeler',
            owner_id: 'customer2',
            make: 'Maruti',
            model: 'Swift',
            year: 2021,
            green_coins_balance: 200,
            total_km_driven: 25000,
            last_service_date: '2025-01-20',
            next_service_due: '2025-07-20',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2025-01-20T00:00:00Z'
          }
        ]);
      }

    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to load data');
    }
  };

  const setupSubscriptions = () => {
    if (!user) return;

    // Subscribe to booking updates
    const bookingsSub = subscriptions.subscribeToBookings((payload) => {
      toast.info(`Booking ${payload.eventType}: ${payload.new?.id || payload.old?.id}`);
      refreshData();
    });

    // Subscribe to additional work updates
    const worksSub = subscriptions.subscribeToAdditionalWorks((payload) => {
      if (payload.eventType === 'UPDATE') {
        toast.info(`Additional work ${payload.new.status}: ${payload.new.service_name}`);
      }
      refreshData();
    });

    // Subscribe to notifications
    const notificationsSub = subscriptions.subscribeToNotifications(user.id, (payload) => {
      setNotifications(prev => [payload.new, ...prev]);
      toast.info(payload.new.title);
    });

    // Cleanup subscriptions
    return () => {
      bookingsSub.unsubscribe();
      worksSub.unsubscribe();
      notificationsSub.unsubscribe();
    };
  };

  const login = async (email: string, password: string) => {
    try {
      // In real implementation, you'd use Supabase Auth
      // For demo, we'll use mock authentication
      const mockUser: User = {
        id: 'master-1',
        email: email,
        phone: '+91-9999999999',
        name: 'Service Master',
        role: 'master',
        address: 'Hyderabad Service Center',
        service_center_id: 'center-1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2025-01-20T00:00:00Z',
        is_active: true
      };

      setUser(mockUser);
      toast.success('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setVehicles([]);
    setBookings([]);
    setAdditionalWorks([]);
    setWorkTasks([]);
    setNotifications([]);
    setDashboardStats({});
    toast.info('Logged out successfully');
  };

  const createBooking = async (bookingData: any) => {
    try {
      const booking = await api.createBooking(bookingData);
      
      // Create notification
      await api.createNotification({
        user_id: user!.id,
        title: 'New Booking Created',
        message: `Booking created for ${bookingData.vehicle_number}`,
        type: 'booking',
        reference_id: booking.id,
        is_read: false
      });

      toast.success('Booking created successfully');
      refreshData();
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
      throw error;
    }
  };

  const approveAdditionalWork = async (workId: string) => {
    try {
      await api.updateAdditionalWorkStatus(workId, 'approved');
      
      // Create notification
      await api.createNotification({
        user_id: user!.id,
        title: 'Additional Work Approved',
        message: 'Additional work has been approved and will be completed',
        type: 'approval',
        reference_id: workId,
        is_read: false
      });

      toast.success('Additional work approved');
      refreshData();
    } catch (error) {
      console.error('Error approving work:', error);
      toast.error('Failed to approve work');
      throw error;
    }
  };

  const rejectAdditionalWork = async (workId: string, reason: string) => {
    try {
      await api.updateAdditionalWorkStatus(workId, 'rejected', reason);
      
      // Create notification
      await api.createNotification({
        user_id: user!.id,
        title: 'Additional Work Rejected',
        message: `Additional work rejected: ${reason}`,
        type: 'rejection',
        reference_id: workId,
        is_read: false
      });

      toast.success('Additional work rejected');
      refreshData();
    } catch (error) {
      console.error('Error rejecting work:', error);
      toast.error('Failed to reject work');
      throw error;
    }
  };

  const updateWorkTaskStatus = async (taskId: string, status: string, notes?: string) => {
    try {
      await api.updateWorkTaskStatus(taskId, status as WorkTask['status'], notes);
      
      toast.success(`Task ${status}`);
      refreshData();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      throw error;
    }
  };

  const addGreenCoins = async (vehicleId: string, coins: number, kmDriven: number) => {
    try {
      // Add green coins transaction
      await api.addGreenCoinsTransaction({
        vehicle_id: vehicleId,
        user_id: user!.id,
        transaction_type: 'earned',
        coins_amount: coins,
        km_driven: kmDriven,
        description: `Earned ${coins} coins for ${kmDriven} km driven`,
        external_app_reference: 'external-app-123'
      });

      // Update vehicle balance
      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (vehicle) {
        await api.updateVehicleGreenCoins(vehicleId, vehicle.green_coins_balance + coins);
      }

      toast.success(`${coins} Green Coins added`);
      refreshData();
    } catch (error) {
      console.error('Error adding green coins:', error);
      toast.error('Failed to add green coins');
      throw error;
    }
  };

  const generateInvoice = async (bookingId: string) => {
    try {
      // Get booking details
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) throw new Error('Booking not found');

      // Get additional works for this booking
      const works = await api.getAdditionalWorksByBooking(bookingId);
      
      // Calculate totals
      const additionalWorkAmount = works
        .filter(w => w.status === 'approved')
        .reduce((sum, w) => sum + w.discounted_price, 0);

      const invoiceData = {
        booking_id: bookingId,
        vehicle_id: booking.vehicle_id,
        user_id: booking.user_id,
        invoice_number: `INV-${Date.now()}`,
        total_amount: additionalWorkAmount,
        free_service_amount: 0,
        additional_work_amount: additionalWorkAmount,
        discount_amount: works.reduce((sum, w) => sum + (w.original_price - w.discounted_price), 0),
        tax_amount: additionalWorkAmount * 0.18, // 18% GST
        green_coins_used: booking.green_coins_used,
        payment_status: 'pending' as const,
        invoice_data: {
          booking: booking,
          additional_works: works,
          created_by: user!.name
        }
      };

      const invoice = await api.createInvoice(invoiceData);

      // Create notification
      await api.createNotification({
        user_id: booking.user_id,
        title: 'Invoice Generated',
        message: `Invoice ${invoice.invoice_number} generated for ₹${additionalWorkAmount}`,
        type: 'invoice',
        reference_id: invoice.id,
        is_read: false
      });

      toast.success('Invoice generated and sent to customer');
      refreshData();
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice');
      throw error;
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await api.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const contextValue: AppContextType = {
    user,
    vehicles,
    bookings,
    additionalWorks,
    workTasks,
    notifications,
    dashboardStats,
    
    login,
    logout,
    createBooking,
    approveAdditionalWork,
    rejectAdditionalWork,
    updateWorkTaskStatus,
    addGreenCoins,
    generateInvoice,
    markNotificationAsRead,
    refreshData
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use Supabase backend in existing components
export function useSupabaseBackend() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeWithLoading = async (operation: () => Promise<any>) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await operation();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    executeWithLoading,
    api,
    subscriptions
  };
}