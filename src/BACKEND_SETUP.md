# WayPartner Backend Setup Guide

## Quick Start (15 minutes setup)

### 1. Supabase Project Setup
```bash
# Visit https://supabase.com and create new project
# Copy your project URL and anon key

# Create .env.local file
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup
```sql
-- Run the database-schema.sql in your Supabase SQL editor
-- This creates all tables, indexes, and policies
```

### 3. Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 4. Update Your App.tsx
```tsx
// Wrap your app with the provider
import { AppProvider } from './components/SupabaseIntegration';

export default function App() {
  return (
    <AppProvider>
      {/* Your existing app content */}
    </AppProvider>
  );
}
```

## Implementation Timeline

### Week 1: Core Backend (5-7 days)
- ✅ Database schema created
- ✅ Authentication system
- ✅ Basic CRUD operations
- ✅ Real-time subscriptions

### Week 2: Business Logic (7-10 days)
- [ ] Green Coins API implementation
- [ ] Slot booking system
- [ ] Work tracking & approval
- [ ] Invoice generation
- [ ] SMS/Email notifications

### Week 3: Advanced Features (5-7 days)  
- [ ] File upload system
- [ ] Advanced analytics
- [ ] Report generation
- [ ] Performance optimization
- [ ] Testing & deployment

## Key Features Ready

### ✅ Database Structure
- Complete normalized schema
- Row Level Security (RLS)
- Optimized indexes
- Real-time capabilities

### ✅ API Functions
- User management
- Vehicle tracking
- Booking system
- Work task management
- Invoice generation
- Notification system

### ✅ Real-time Features
- Live booking updates
- Instant notifications
- Work status changes
- Payment updates

## Usage Examples

### Creating a Booking
```tsx
const { createBooking } = useApp();

await createBooking({
  vehicle_id: 'vehicle-123',
  user_id: 'user-456',
  service_center_id: 'center-1',
  booking_date: '2025-01-21',
  booking_time: '10:00',
  green_coins_used: 100,
  is_free_service: true
});
```

### Approving Additional Work
```tsx
const { approveAdditionalWork } = useApp();

await approveAdditionalWork('work-789');
```

### Adding Green Coins
```tsx
const { addGreenCoins } = useApp();

await addGreenCoins('vehicle-123', 50, 50); // 50 coins for 50 km
```

### Generating Invoice
```tsx
const { generateInvoice } = useApp();

await generateInvoice('booking-456');
```

## API Endpoints (Available via Supabase)

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/signout` - User logout
- `GET /auth/user` - Get current user

### Vehicles
- `GET /vehicles` - List all vehicles
- `POST /vehicles` - Create vehicle
- `GET /vehicles/:id` - Get vehicle details
- `PUT /vehicles/:id` - Update vehicle
- `POST /vehicles/:id/green-coins` - Add green coins

### Bookings
- `GET /bookings` - List bookings
- `POST /bookings` - Create booking
- `PUT /bookings/:id` - Update booking
- `GET /bookings/date/:date` - Get bookings by date

### Work Management
- `GET /bookings/:id/additional-works` - Get additional works
- `POST /additional-works` - Create additional work
- `PUT /additional-works/:id/approve` - Approve work
- `PUT /additional-works/:id/reject` - Reject work

### Tasks
- `GET /bookings/:id/tasks` - Get work tasks
- `POST /work-tasks` - Create work task
- `PUT /work-tasks/:id` - Update task status

### Invoices
- `POST /invoices` - Generate invoice
- `GET /invoices/:id` - Get invoice details
- `PUT /invoices/:id/payment` - Update payment status

### Reports & Analytics
- `GET /analytics/dashboard` - Dashboard statistics
- `GET /analytics/revenue` - Revenue reports
- `GET /analytics/performance` - Performance metrics

## Security Features

### Row Level Security (RLS)
- Users can only access their own data
- Masters can access all service center data
- Technicians can access assigned tasks only
- Customers can access their vehicles/bookings only

### API Security
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting on sensitive endpoints

## Real-time Features

### Live Updates
- Booking status changes
- Work approval notifications
- Payment confirmations
- Task assignments

### Notifications
- SMS for important updates
- Email for invoices and reports
- In-app notifications for real-time updates
- Push notifications for mobile apps

## Next Steps

1. **Immediate (This Week)**
   - Set up Supabase project
   - Run database schema
   - Test basic operations

2. **Short Term (Next 2 weeks)**
   - Implement remaining business logic
   - Add file upload capabilities
   - Set up SMS/Email services
   - Create comprehensive testing

3. **Long Term (Next month)**
   - Performance optimization
   - Advanced analytics
   - Mobile app integration
   - Production deployment

## Support & Maintenance

### Monitoring
- Database performance metrics
- API response times
- Error tracking and logging
- User activity analytics

### Backup & Recovery
- Automated daily backups
- Point-in-time recovery
- Disaster recovery plan
- Data retention policies

## Cost Estimation

### Supabase Pricing (Monthly)
- **Free Tier**: Good for development/testing
- **Pro Plan** ($25/month): Production ready
- **Team Plan** ($125/month): Multiple environments
- **Enterprise**: Custom pricing for large scale

### Additional Services
- SMS Gateway: ₹0.10 per SMS
- Email Service: ₹0.01 per email
- File Storage: $0.021 per GB
- Bandwidth: $0.09 per GB

**Total Estimated Cost**: ₹5,000-15,000/month for full production setup with 1000+ active users.