# WayPartner Platform - Roles & Access Clarity

## Platform Overview
WayPartner Service Center Dashboard is designed exclusively for **Service Centers** who are partnered with WayPartner. Masters (vehicle owners) do NOT have direct access to this platform.

## Role Definitions

### 1. Masters (Vehicle Owners)
- **Who they are**: Owners of 2000 2-wheelers and 4000 4-wheelers
- **Green Coins**: Earn 1 coin per kilometer driven
- **Free Service**: Entitled to free engine maintenance
- **Platform Access**: ❌ NO direct access to this dashboard
- **Interaction Method**: Only through service centers via phone/WhatsApp

### 2. Service Centers
- **Who they are**: WayPartner partnered service centers
- **Platform Access**: ✅ Full access to this dashboard
- **Responsibilities**:
  - Book slots for masters
  - Perform vehicle inspections
  - Recommend additional work
  - Handle green coins redemption
  - Communicate with masters for approvals
  - Generate invoices

## Service Flow

### Step 1: Green Coins & Slot Booking
- Masters earn green coins (1 coin/km)
- Masters call/WhatsApp service center for appointment
- **Service center staff** use the dashboard to:
  - Search master's vehicle number
  - View available green coins balance
  - Book appropriate time slot
  - Set up coins redemption if requested

### Step 2: Vehicle Inspection
- Master brings vehicle to service center
- **Service center technicians** use the dashboard to:
  - Perform systematic inspection using checklist
  - Identify free engine maintenance work
  - Document additional work needed
  - Take photos for transparency

### Step 3: Additional Work Approval
- **Service center staff** use the dashboard to:
  - Create additional work recommendations
  - Call/WhatsApp master with details and pricing
  - Record master's approval/rejection in system
  - Proceed only with approved work

### Step 4: Service Completion & Billing
- **Service center staff** use the dashboard to:
  - Mark service completion
  - Generate automatic invoice
  - Process green coins redemption
  - Send completion notification to master

## Key Platform Features (Service Center Only)

### Dashboard Screens Available:
1. **Home**: Service center overview
2. **Dashboard**: Performance metrics
3. **Slot Booking**: Manage master appointments
4. **Vehicle Inspection**: Systematic checklist
5. **Additional Work Approval**: Record master decisions
6. **Vehicle Status**: Track service progress
7. **Green Coins**: Manage master rewards
8. **Reports**: Business analytics
9. **Settings**: Center configuration
10. **Fleet Dashboard**: Multi-vehicle tracking
11. **Operations Guide**: Best practices & tips

### Master Communication:
- 📞 Phone calls for urgent approvals
- 📱 WhatsApp for photos and updates
- 💬 SMS for appointment confirmations
- 📧 Email for invoices

## Important Clarifications

### What Masters DON'T do:
- ❌ Login to this platform
- ❌ Book their own slots online
- ❌ Approve additional work through app
- ❌ View their service status online
- ❌ Generate their own invoices

### What Service Centers DO:
- ✅ Act as intermediary between WayPartner system and masters
- ✅ Book slots on master's behalf
- ✅ Record master's decisions in system
- ✅ Handle all green coins transactions
- ✅ Manage complete service lifecycle
- ✅ Provide updates to masters via phone/WhatsApp

## Business Model

### Revenue Streams:
1. **Service Center Fees**: Commission on services performed
2. **Green Coins Program**: Increased customer loyalty & retention
3. **Additional Work Approvals**: Upselling through recommendations
4. **Fleet Management**: Bulk service discounts

### Value Proposition:
- **For Masters**: Free engine maintenance + green coins rewards
- **For Service Centers**: Increased business + customer retention tools
- **For WayPartner**: Scalable service network + customer data

## Technical Architecture

```
Masters (Phone/WhatsApp) 
    ↓
Service Center Staff (Dashboard)
    ↓
WayPartner Backend (Data & Business Logic)
    ↓
Database (Vehicles, Coins, Services, Invoices)
```

## Communication Protocols

### Master → Service Center:
- Phone call for booking
- WhatsApp for urgent questions
- Walk-in for service

### Service Center → Master:
- Phone call for additional work approval
- WhatsApp with photos and updates
- SMS for appointment reminders
- Email for invoice delivery

### Service Center → WayPartner:
- Dashboard for all operations
- Real-time data sync
- Automated reporting

## Access Control

### Service Center Dashboard Access:
- **Required**: Service center authentication
- **Permissions**: Full CRUD operations
- **Data Scope**: All masters in their service area

### Master Data Privacy:
- Masters' personal data protected
- Service centers see only relevant vehicle data
- Green coins balance visible for redemption
- Service history for continuity

## Conclusion

This platform is a **B2B solution** where service centers use the dashboard to serve masters efficiently. The role separation ensures:
- Masters get personal service without tech complexity
- Service centers have powerful tools for business management
- WayPartner maintains control over service quality and standards

**Remember**: Every interaction with masters happens through service center staff, not through direct platform access.