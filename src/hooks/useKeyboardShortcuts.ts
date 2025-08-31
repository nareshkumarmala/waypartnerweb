import { useEffect } from 'react';
import { Screen, User } from '../types';

// Fallback keyboard shortcuts
const FALLBACK_KEYBOARD_SHORTCUTS = {
  '1': 'dashboard',
  '2': 'slot-booking',
  '3': 'mobile-inspection',
  '4': 'vehicle-status',
  '5': 'green-coins',
  'q': 'quick-navigation',
  'n': 'notifications'
} as const;

interface UseKeyboardShortcutsProps {
  user: User;
  showNotifications: boolean;
  setCurrentScreen: (screen: Screen) => void;
  setShowNotifications: (show: boolean) => void;
}

export function useKeyboardShortcuts({
  user,
  showNotifications,
  setCurrentScreen,
  setShowNotifications
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyboardShortcuts = (e: KeyboardEvent) => {
      // Only handle shortcuts when logged in and not in input fields
      if (!user.isLoggedIn || (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        const shortcut = FALLBACK_KEYBOARD_SHORTCUTS[e.key as keyof typeof FALLBACK_KEYBOARD_SHORTCUTS];
        
        if (shortcut) {
          e.preventDefault();
          
          if (shortcut === 'notifications') {
            setShowNotifications(!showNotifications);
          } else {
            setCurrentScreen(shortcut as Screen);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [user.isLoggedIn, showNotifications, setCurrentScreen, setShowNotifications]);
}