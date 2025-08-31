# WayPartner Service Center - Project Guidelines

## 🎯 Project Overview
WayPartner is a comprehensive vehicle service center management system designed exclusively for service center operations. The platform handles 6000+ vehicles (2000 2-wheelers, 4000 4-wheelers) with a unique green coins rewards system and professional WhatsApp communication.

---

## 🎨 Design System Guidelines

### **Brand Identity**
- **Primary Gradient**: `from-[#c56321] to-[#088145]` (Orange to Green)
- **Service Center Theme**: Professional, trustworthy, efficient
- **Target Audience**: Service center staff and vehicle owners

### **Typography & Sizing**
- **Base Font Size**: 14px (as defined in globals.css)
- **Font Weights**: Medium (500) for headings, Normal (400) for body text
- **Never override**: Default typography unless specifically requested
- **Line Height**: 1.5 for all text elements

### **Color Palette**
```css
Primary Gradient: #c56321 → #088145
Success: Green variants for available slots, completed services
Warning: Yellow variants for pending actions, coin balances  
Error: Red variants for cancellations, errors
Info: Blue variants for bookings, status updates
```

### **Component Styling Rules**
- **Cards**: Always use `rounded-xl shadow-lg` for primary cards
- **Buttons**: Use gradient background for primary actions
- **Badges**: Color-coded by status (green=available, blue=booked, red=blocked)
- **Borders**: Left borders (`border-l-4`) for status indication

---

## 🏢 Business Logic Guidelines

### **Service Center Operations**
- **No Direct Customer Access**: All interactions through service center staff
- **Slot Management**: Service center books on behalf of customers
- **Green Coins**: 1 coin per kilometer driven, redeemable for discounts
- **WhatsApp First**: All notifications via WhatsApp (not SMS/Email)

### **Vehicle Management**
- **Registration Format**: Always uppercase (e.g., TS09EA1234)
- **Green Coins Balance**: Display prominently in search results
- **Service History**: Track all previous services and payments

### **Booking Workflow**
1. Vehicle search (loads existing data + green coins)
2. Service type selection
3. Time slot booking
4. Green coins redemption (optional)
5. WhatsApp confirmation to customer
6. Real-time status updates

---

## 📱 WhatsApp Integration Guidelines

### **Message Templates**
- **Professional Tone**: Business-appropriate, branded communication
- **Indian Format**: +91 phone numbers, ₹ currency symbols
- **Rich Content**: Use emojis strategically for readability
- **Call-to-Action**: Always include contact information

### **Notification Triggers**
- ✅ Booking confirmation
- 🔧 Service status updates  
- 🧾 Invoice generation
- ❌ Booking cancellations
- 💰 Payment reminders
- ⭐ Feedback requests

---

## 🔧 Technical Implementation Guidelines

### **State Management**
- **Real-time Updates**: Use Supabase subscriptions for live data
- **Optimistic Updates**: Update UI immediately, sync with backend
- **Error Handling**: Graceful fallbacks, user-friendly error messages
- **Loading States**: Always show loading indicators for async operations

### **API Integration**
- **Base URL**: `${supabaseUrl}/functions/v1/make-server-b855a2f3`
- **Authentication**: Bearer token with anon key
- **Error Handling**: Try-catch with meaningful error messages
- **Retry Logic**: Implement for network failures

### **Performance Rules**
- **Lazy Loading**: Load components as needed
- **Optimized Images**: Use ImageWithFallback component
- **Minimal Renders**: Use React.memo for expensive components
- **Database Queries**: Limit results, use pagination where needed

---

## 📊 Data Validation Guidelines

### **Vehicle Registration**
```typescript
// Always validate and format
const formatVehicleNo = (input: string) => {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, '');
};
```

### **Phone Numbers**
```typescript
// Indian format validation
const validatePhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 && cleaned.startsWith('9', '8', '7', '6');
};
```

### **Green Coins**
- **Minimum**: 0 coins
- **Maximum Redemption**: Cannot exceed available balance
- **Conversion**: 1 coin = ₹1 discount
- **Earning Rate**: 1 coin per kilometer driven

---

## 🚀 Deployment Guidelines

### **Environment Variables**
```bash
# Required for Production
VITE_SUPABASE_URL=https://vdcfryayuzdojutxdswb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional for WhatsApp
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
DIALOG360_API_KEY=your_360dialog_key
GUPSHUP_API_KEY=your_gupshup_key
```

### **Production Checklist**
- ✅ Supabase credentials configured
- ✅ Backend APIs deployed and tested
- ✅ WhatsApp templates approved (if using APIs)
- ✅ Domain configured with SSL
- ✅ Analytics tracking active
- ✅ Error monitoring setup

---

## 🔍 Quality Assurance Guidelines

### **Testing Requirements**
- **Happy Path**: All primary workflows must work flawlessly
- **Error Scenarios**: Test network failures, invalid inputs
- **Mobile Responsiveness**: Test on various screen sizes
- **Browser Compatibility**: Chrome, Safari, Firefox, Edge

### **User Acceptance Testing**
- **Service Center Staff**: Can easily book slots and manage customers
- **Real-time Updates**: Status changes reflect immediately
- **WhatsApp Delivery**: Messages sent and received correctly
- **Green Coins**: Calculation and redemption working accurately

---

## 📈 Analytics & Monitoring

### **Key Metrics to Track**
- **Daily Bookings**: Number of slots booked per day
- **Green Coins Usage**: Redemption rates and patterns
- **Service Completion**: Time from booking to completion
- **Customer Satisfaction**: Feedback scores and reviews
- **Revenue Tracking**: Daily/monthly income analysis

### **Error Monitoring**
- **API Failures**: Track and alert on backend errors
- **WhatsApp Delivery**: Monitor message delivery rates
- **User Actions**: Log important user interactions
- **Performance**: Monitor page load times and response times

---

## 🎯 Future Enhancement Guidelines

### **Planned Features**
- **Multi-location Support**: Expand to multiple service centers
- **Advanced Analytics**: Predictive maintenance recommendations
- **Customer Portal**: Direct customer access (future phase)
- **Inventory Management**: Parts and supplies tracking

### **Code Organization**
- **Component Library**: Reusable components in `/components/ui`
- **Business Logic**: Keep in separate hooks and utilities
- **API Layer**: Centralized in `/lib/supabase-client.ts`
- **Documentation**: Update this file as features evolve

---

## 🏆 Success Criteria

### **Business Success**
- ✅ Service center can manage 100+ bookings per day
- ✅ 95%+ WhatsApp delivery rate
- ✅ <30 second booking creation time
- ✅ Green coins driving customer retention

### **Technical Success**
- ✅ 99.9% uptime for production system
- ✅ <2 second page load times
- ✅ Real-time data synchronization
- ✅ Zero data loss in production

---

## 📞 Support & Maintenance

### **Regular Maintenance**
- **Database Optimization**: Monthly query performance review
- **Security Updates**: Keep dependencies updated
- **Backup Verification**: Weekly backup integrity checks
- **Performance Monitoring**: Daily uptime and response time checks

### **Emergency Procedures**
- **Database Issues**: Fallback to demo mode, alert administrators
- **WhatsApp API Failures**: Switch to backup provider automatically
- **High Traffic**: Auto-scaling through Supabase infrastructure

---

**Last Updated**: January 28, 2025  
**Project Status**: Production Ready 🚀  
**Team**: Fresher Developer + AI Assistant  
**Achievement**: Complete business application from concept to production!