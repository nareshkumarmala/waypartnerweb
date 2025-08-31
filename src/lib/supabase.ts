import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on our schema
export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: 'master' | 'technician' | 'customer';
  address?: string;
  service_center_id?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Vehicle {
  id: string;
  vehicle_number: string;
  vehicle_type: '2-wheeler' | '4-wheeler';
  owner_id: string;
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  green_coins_balance: number;
  total_km_driven: number;
  last_service_date?: string;
  next_service_due?: string;
  created_at: string;
  updated_at: string;
}

export interface SlotBooking {
  id: string;
  vehicle_id: string;
  user_id: string;
  service_center_id: string;
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  green_coins_used: number;
  is_free_service: boolean;
  external_link_reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AdditionalWork {
  id: string;
  booking_id: string;
  service_name: string;
  description: string;
  original_price: number;
  discounted_price: number;
  discount_percentage: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  technician_notes?: string;
  customer_notes?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkTask {
  id: string;
  booking_id: string;
  additional_work_id?: string;
  task_name: string;
  description: string;
  assigned_technician_id: string;
  status: 'pending' | 'in-progress' | 'completed' | 'ignored';
  priority: 'low' | 'medium' | 'high';
  estimated_time_minutes?: number;
  actual_time_minutes?: number;
  notes?: string;
  ignore_reason?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  booking_id: string;
  vehicle_id: string;
  user_id: string;
  invoice_number: string;
  total_amount: number;
  free_service_amount: number;
  additional_work_amount: number;
  discount_amount: number;
  tax_amount: number;
  green_coins_used: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  invoice_data: any;
  sent_at?: string;
  paid_at?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  reference_id?: string;
  is_read: boolean;
  sent_via?: any;
  created_at: string;
}

// API Functions for database operations
export const api = {
  // User Management
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Vehicle Management
  async createVehicle(vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([vehicleData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getVehiclesByOwner(ownerId: string) {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('owner_id', ownerId);
    
    if (error) throw error;
    return data;
  },

  async getVehicleByNumber(vehicleNumber: string) {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('vehicle_number', vehicleNumber)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateVehicleGreenCoins(vehicleId: string, coins: number) {
    const { data, error } = await supabase
      .from('vehicles')
      .update({ green_coins_balance: coins })
      .eq('id', vehicleId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Green Coins Transactions
  async addGreenCoinsTransaction(transaction: {
    vehicle_id: string;
    user_id: string;
    transaction_type: 'earned' | 'redeemed' | 'expired';
    coins_amount: number;
    km_driven?: number;
    description?: string;
    external_app_reference?: string;
  }) {
    const { data, error } = await supabase
      .from('green_coins_transactions')
      .insert([transaction])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getGreenCoinsHistory(vehicleId: string) {
    const { data, error } = await supabase
      .from('green_coins_transactions')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Slot Booking Management
  async createBooking(bookingData: Omit<SlotBooking, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('slot_bookings')
      .insert([bookingData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getBookingsByDate(date: string) {
    const { data, error } = await supabase
      .from('slot_bookings')
      .select(`
        *,
        vehicles(vehicle_number, vehicle_type),
        users(name, phone)
      `)
      .eq('booking_date', date)
      .order('booking_time');
    
    if (error) throw error;
    return data;
  },

  async updateBookingStatus(bookingId: string, status: SlotBooking['status']) {
    const { data, error } = await supabase
      .from('slot_bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Additional Work Management
  async createAdditionalWork(workData: Omit<AdditionalWork, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('additional_works')
      .insert([workData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAdditionalWorksByBooking(bookingId: string) {
    const { data, error } = await supabase
      .from('additional_works')
      .select('*')
      .eq('booking_id', bookingId);
    
    if (error) throw error;
    return data;
  },

  async updateAdditionalWorkStatus(workId: string, status: AdditionalWork['status'], notes?: string) {
    const updateData: any = { status, updated_at: new Date().toISOString() };
    if (notes) updateData.customer_notes = notes;

    const { data, error } = await supabase
      .from('additional_works')
      .update(updateData)
      .eq('id', workId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Work Task Management
  async createWorkTask(taskData: Omit<WorkTask, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('work_tasks')
      .insert([taskData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getWorkTasksByBooking(bookingId: string) {
    const { data, error } = await supabase
      .from('work_tasks')
      .select(`
        *,
        assigned_technician:users(name)
      `)
      .eq('booking_id', bookingId);
    
    if (error) throw error;
    return data;
  },

  async updateWorkTaskStatus(taskId: string, status: WorkTask['status'], notes?: string) {
    const updateData: any = { status };
    if (notes) updateData.notes = notes;
    if (status === 'completed') updateData.completed_at = new Date().toISOString();
    if (status === 'in-progress') updateData.started_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('work_tasks')
      .update(updateData)
      .eq('id', taskId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Invoice Management
  async createInvoice(invoiceData: Omit<Invoice, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('invoices')
      .insert([invoiceData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getInvoiceByBooking(bookingId: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('booking_id', bookingId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateInvoicePaymentStatus(invoiceId: string, status: Invoice['payment_status']) {
    const updateData: any = { payment_status: status };
    if (status === 'paid') updateData.paid_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', invoiceId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Notification Management
  async createNotification(notificationData: Omit<Notification, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notificationData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserNotifications(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  async markNotificationAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Analytics & Reports
  async getDashboardStats(serviceCenterId?: string) {
    // This would be a complex query combining multiple tables
    // For now, returning a placeholder structure
    const today = new Date().toISOString().split('T')[0];
    
    const [bookings, completedToday, pendingApproval] = await Promise.all([
      supabase.from('slot_bookings').select('id').eq('status', 'confirmed'),
      supabase.from('slot_bookings').select('id').eq('booking_date', today).eq('status', 'completed'),
      supabase.from('additional_works').select('id').eq('status', 'pending')
    ]);

    return {
      totalVehicles: 6000, // This would come from vehicles count
      activeBookings: bookings.data?.length || 0,
      completedToday: completedToday.data?.length || 0,
      pendingApproval: pendingApproval.data?.length || 0,
      revenue: 45000, // This would be calculated from invoices
      freeServices: 8,
      additionalWorks: 15,
      ignoredTasks: 3
    };
  }
};

// Real-time subscriptions
export const subscriptions = {
  // Subscribe to booking updates
  subscribeToBookings(callback: (payload: any) => void) {
    return supabase
      .channel('bookings')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'slot_bookings' }, 
        callback
      )
      .subscribe();
  },

  // Subscribe to additional work updates
  subscribeToAdditionalWorks(callback: (payload: any) => void) {
    return supabase
      .channel('additional_works')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'additional_works' }, 
        callback
      )
      .subscribe();
  },

  // Subscribe to notifications
  subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe();
  }
};