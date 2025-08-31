import { Notification } from '../types';

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', message: 'New Booking Received - TS09EA1234', time: '2 mins ago', read: false },
  { id: '2', message: 'Additional Work Approved - KA05MN5678', time: '5 mins ago', read: false },
  { id: '3', message: 'Service Completed - AP09BC9012', time: '10 mins ago', read: true },
  { id: '4', message: 'Invoice Sent - TS09EA1234', time: '15 mins ago', read: true },
  { id: '5', message: 'Customer Feedback Received', time: '20 mins ago', read: true },
];

export const KEYBOARD_SHORTCUTS = {
  '1': 'dashboard',
  '2': 'slot-booking',
  '3': 'mobile-inspection',
  '4': 'vehicle-status',
  '5': 'green-coins',
  'q': 'quick-navigation',
  'n': 'notifications'
} as const;