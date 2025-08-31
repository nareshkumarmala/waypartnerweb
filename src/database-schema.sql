-- WayPartner Service Center Database Schema
-- Complete schema for production-ready system

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- 🚗 VEHICLES TABLE
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number VARCHAR(20) UNIQUE NOT NULL,
  owner_name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  email VARCHAR(100),
  vehicle_type VARCHAR(50) DEFAULT '2W', -- 2W, 4W, EV
  vehicle_model VARCHAR(100),
  vehicle_year INTEGER,
  green_coins_balance INTEGER DEFAULT 0,
  total_km_driven INTEGER DEFAULT 0,
  last_service_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 🏢 SERVICE CENTERS TABLE
CREATE TABLE IF NOT EXISTS service_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  address TEXT,
  phone VARCHAR(15),
  email VARCHAR(100),
  manager_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 📅 SERVICE BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS service_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_registration VARCHAR(20) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(15) NOT NULL,
  customer_email VARCHAR(100),
  service_type VARCHAR(50) NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  green_coins_used INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'confirmed', -- confirmed, in-progress, completed, ready-for-delivery, cancelled
  technician_assigned VARCHAR(100),
  estimated_completion_time TIMESTAMP,
  actual_completion_time TIMESTAMP,
  service_center_id UUID REFERENCES service_centers(id),
  special_instructions TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 🧾 INVOICES TABLE
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES service_bookings(id),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  service_items JSONB NOT NULL, -- Array of {name, amount, quantity}
  additional_charges JSONB DEFAULT '[]', -- Array of {name, amount, description}
  subtotal DECIMAL(10,2) NOT NULL,
  additional_total DECIMAL(10,2) DEFAULT 0,
  green_coins_discount DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, partially_paid, refunded
  payment_method VARCHAR(20), -- cash, card, upi, online
  payment_date TIMESTAMP,
  generated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 💳 PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id),
  payment_id VARCHAR(100), -- External payment gateway ID
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending',
  transaction_date TIMESTAMP DEFAULT NOW(),
  gateway_response JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 🪙 GREEN COINS TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS green_coins_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_registration VARCHAR(20) NOT NULL,
  transaction_type VARCHAR(20) NOT NULL, -- earned, redeemed, expired, bonus
  amount INTEGER NOT NULL, -- Positive for earned, negative for redeemed
  reference_id UUID, -- booking_id or invoice_id
  reference_type VARCHAR(20), -- booking, invoice, bonus, manual
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 🔧 SERVICE HISTORY TABLE
CREATE TABLE IF NOT EXISTS service_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_registration VARCHAR(20) NOT NULL,
  booking_id UUID REFERENCES service_bookings(id),
  service_date DATE NOT NULL,
  service_type VARCHAR(50) NOT NULL,
  kilometers_at_service INTEGER,
  work_performed TEXT[],
  parts_replaced JSONB,
  technician_name VARCHAR(100),
  next_service_due_km INTEGER,
  next_service_due_date DATE,
  total_cost DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 📝 INSPECTION CHECKLIST TABLE
CREATE TABLE IF NOT EXISTS inspection_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES service_bookings(id),
  checklist_data JSONB NOT NULL, -- Complete checklist with all items
  inspector_name VARCHAR(100),
  inspection_date TIMESTAMP DEFAULT NOW(),
  overall_condition VARCHAR(20), -- excellent, good, fair, poor
  critical_issues TEXT[],
  recommendations TEXT[],
  photos JSONB, -- Array of photo URLs
  customer_signature TEXT, -- Base64 signature
  created_at TIMESTAMP DEFAULT NOW()
);

-- 🔔 NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_type VARCHAR(20) NOT NULL, -- customer, service_center, admin
  recipient_id VARCHAR(100), -- Phone number or user ID
  notification_type VARCHAR(50) NOT NULL, -- booking_confirmed, status_update, invoice_sent, etc.
  title VARCHAR(200),
  message TEXT NOT NULL,
  channel VARCHAR(20) NOT NULL, -- sms, email, push, in_app
  status VARCHAR(20) DEFAULT 'pending', -- pending, sent, delivered, failed
  reference_id UUID, -- booking_id, invoice_id, etc.
  reference_type VARCHAR(20),
  scheduled_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 👥 CUSTOMERS TABLE (Optional - for customer portal)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(15) UNIQUE NOT NULL,
  name VARCHAR(100),
  email VARCHAR(100),
  address TEXT,
  date_of_birth DATE,
  preferred_language VARCHAR(10) DEFAULT 'en',
  notification_preferences JSONB DEFAULT '{"sms": true, "email": true, "push": false}',
  total_services INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  loyalty_tier VARCHAR(20) DEFAULT 'bronze', -- bronze, silver, gold, platinum
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 📊 ANALYTICS VIEWS
CREATE OR REPLACE VIEW daily_revenue AS
SELECT 
  DATE(created_at) as service_date,
  COUNT(*) as total_invoices,
  SUM(total_amount) as total_revenue,
  AVG(total_amount) as avg_invoice_value,
  SUM(green_coins_discount) as total_discounts
FROM invoices 
WHERE payment_status = 'paid'
GROUP BY DATE(created_at)
ORDER BY service_date DESC;

CREATE OR REPLACE VIEW vehicle_service_summary AS
SELECT 
  v.registration_number,
  v.owner_name,
  v.phone,
  v.green_coins_balance,
  COUNT(sb.id) as total_bookings,
  MAX(sb.booking_date) as last_service_date,
  SUM(CASE WHEN i.payment_status = 'paid' THEN i.total_amount ELSE 0 END) as total_spent
FROM vehicles v
LEFT JOIN service_bookings sb ON v.registration_number = sb.vehicle_registration
LEFT JOIN invoices i ON sb.id = i.booking_id
GROUP BY v.id, v.registration_number, v.owner_name, v.phone, v.green_coins_balance;

-- 🔍 INDEXES for Performance
CREATE INDEX IF NOT EXISTS idx_vehicles_registration ON vehicles(registration_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_phone ON vehicles(phone);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON service_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle ON service_bookings(vehicle_registration);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON service_bookings(status);
CREATE INDEX IF NOT EXISTS idx_invoices_booking ON invoices(booking_id);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(created_at);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(payment_status);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);

-- 🔒 ROW LEVEL SECURITY POLICIES
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow service centers to access all data (for demo)
CREATE POLICY "Service centers can access all vehicles" ON vehicles
  FOR ALL USING (true);

CREATE POLICY "Service centers can access all bookings" ON service_bookings
  FOR ALL USING (true);

CREATE POLICY "Service centers can access all invoices" ON invoices
  FOR ALL USING (true);

CREATE POLICY "Service centers can access all notifications" ON notifications
  FOR ALL USING (true);

-- 📊 TRIGGERS for Automated Updates

-- Update vehicle's last service date when booking is completed
CREATE OR REPLACE FUNCTION update_vehicle_last_service()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE vehicles 
    SET last_service_date = NEW.booking_date,
        updated_at = NOW()
    WHERE registration_number = NEW.vehicle_registration;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_vehicle_last_service
  AFTER UPDATE ON service_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_vehicle_last_service();

-- Create green coins transaction when coins are used/earned
CREATE OR REPLACE FUNCTION track_green_coins_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- When booking uses green coins
  IF NEW.green_coins_used > 0 AND (OLD.green_coins_used IS NULL OR OLD.green_coins_used = 0) THEN
    INSERT INTO green_coins_transactions (
      vehicle_registration, 
      transaction_type, 
      amount, 
      reference_id, 
      reference_type, 
      description
    ) VALUES (
      NEW.vehicle_registration,
      'redeemed',
      -NEW.green_coins_used,
      NEW.id,
      'booking',
      'Green coins redeemed for service booking'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_track_green_coins_booking
  AFTER INSERT OR UPDATE ON service_bookings
  FOR EACH ROW
  EXECUTE FUNCTION track_green_coins_transaction();

-- Award green coins when invoice is paid
CREATE OR REPLACE FUNCTION award_green_coins_on_payment()
RETURNS TRIGGER AS $$
DECLARE
  booking_record service_bookings%ROWTYPE;
  coins_to_award INTEGER;
BEGIN
  IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' THEN
    -- Get booking details
    SELECT * INTO booking_record 
    FROM service_bookings 
    WHERE id = NEW.booking_id;
    
    -- Calculate coins to award (1 coin per ₹100)
    coins_to_award := FLOOR(NEW.total_amount / 100);
    
    -- Update vehicle green coins
    UPDATE vehicles 
    SET green_coins_balance = green_coins_balance + coins_to_award,
        updated_at = NOW()
    WHERE registration_number = booking_record.vehicle_registration;
    
    -- Record transaction
    INSERT INTO green_coins_transactions (
      vehicle_registration,
      transaction_type,
      amount,
      reference_id,
      reference_type,
      description
    ) VALUES (
      booking_record.vehicle_registration,
      'earned',
      coins_to_award,
      NEW.id,
      'invoice',
      'Green coins earned for service payment'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_award_green_coins
  AFTER UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION award_green_coins_on_payment();

-- 🚀 INITIAL DATA SETUP

-- Insert default service center
INSERT INTO service_centers (name, address, phone, email, manager_name) VALUES
('WayPartner Main Center', 'Hyderabad, Telangana', '+91 9876543210', 'manager@waypartner.com', 'Rajesh Kumar')
ON CONFLICT DO NOTHING;

-- Insert sample vehicles for demo
INSERT INTO vehicles (registration_number, owner_name, phone, vehicle_type, green_coins_balance, total_km_driven) VALUES
('TS09EA1234', 'Rajesh Kumar', '9876543210', '2W', 850, 15420),
('KA05MN5678', 'Priya Sharma', '9123456789', '4W', 1200, 22300),
('AP09BC9012', 'Vikram Reddy', '9234567890', '2W', 650, 8900),
('TN07XY4567', 'Anitha Devi', '9345678901', '4W', 980, 18750),
('MH12AB8901', 'Suresh Patel', '9456789012', '2W', 540, 12100)
ON CONFLICT (registration_number) DO NOTHING;

-- Insert sample service types configuration
CREATE TABLE IF NOT EXISTS service_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  vehicle_type VARCHAR(10) NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  estimated_duration INTEGER NOT NULL, -- in minutes
  description TEXT,
  included_services TEXT[],
  is_active BOOLEAN DEFAULT true
);

INSERT INTO service_types (name, vehicle_type, base_price, estimated_duration, description, included_services) VALUES
('2W Full Service', '2W', 1200.00, 120, 'Complete two-wheeler service', ARRAY['Engine oil change', 'Chain cleaning', 'Brake check', 'Air filter clean']),
('4W Full Service', '4W', 2500.00, 180, 'Complete four-wheeler service', ARRAY['Engine oil change', 'Filter replacement', 'Battery check', 'Tire pressure']),
('Oil Change', 'Both', 800.00, 45, 'Quick engine oil change', ARRAY['Engine oil change', 'Oil filter check']),
('General Checkup', 'Both', 500.00, 60, 'Basic health checkup', ARRAY['Visual inspection', 'Basic diagnostic']),
('Brake Service', 'Both', 1500.00, 90, 'Complete brake system service', ARRAY['Brake pad check', 'Brake fluid', 'Brake adjustment'])
ON CONFLICT DO NOTHING;

-- 🔧 FUNCTIONS for Business Logic

-- Function to get available time slots for a date
CREATE OR REPLACE FUNCTION get_available_slots(target_date DATE)
RETURNS TABLE(time_slot TIME, is_available BOOLEAN) AS $$
DECLARE
  slot_time TIME;
  booked_slots TIME[];
BEGIN
  -- Get all booked slots for the date
  SELECT ARRAY(
    SELECT booking_time 
    FROM service_bookings 
    WHERE booking_date = target_date 
    AND status != 'cancelled'
  ) INTO booked_slots;
  
  -- Define available time slots
  FOR slot_time IN 
    SELECT unnest(ARRAY['09:00'::TIME, '10:00'::TIME, '11:00'::TIME, '12:00'::TIME, 
                        '14:00'::TIME, '15:00'::TIME, '16:00'::TIME, '17:00'::TIME])
  LOOP
    RETURN QUERY SELECT slot_time, NOT (slot_time = ANY(booked_slots));
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate service pricing
CREATE OR REPLACE FUNCTION calculate_service_price(
  service_type_name VARCHAR(100),
  green_coins_to_use INTEGER DEFAULT 0
)
RETURNS TABLE(
  base_price DECIMAL(10,2),
  discount DECIMAL(10,2),
  final_price DECIMAL(10,2)
) AS $$
DECLARE
  service_price DECIMAL(10,2);
  max_discount DECIMAL(10,2);
BEGIN
  -- Get base price
  SELECT st.base_price INTO service_price
  FROM service_types st
  WHERE st.name = service_type_name AND st.is_active = true;
  
  -- Calculate discount (max 50% of service price)
  max_discount := LEAST(green_coins_to_use, service_price * 0.5);
  
  RETURN QUERY SELECT 
    service_price,
    max_discount,
    service_price - max_discount;
END;
$$ LANGUAGE plpgsql;

-- ✅ SCHEMA SETUP COMPLETE
-- This schema provides:
-- 1. Complete vehicle management
-- 2. Booking system with real-time slots
-- 3. Invoice generation and payment tracking
-- 4. Green coins reward system
-- 5. Notification system
-- 6. Service history tracking
-- 7. Analytics and reporting
-- 8. Customer management
-- 9. Automated business logic with triggers
-- 10. Performance optimized with indexes

COMMENT ON SCHEMA public IS 'WayPartner Service Center Management System - Production Ready Database Schema';