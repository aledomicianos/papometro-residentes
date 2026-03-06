import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface Notification {
  id:      number;
  message: string;
  type:    'success' | 'error';
}

interface NotificationContextValue {
  notify: (message: string, type?: 'success' | 'error') => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

let notifId = 0;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = ++notifId;
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3200);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              background:   n.type === 'success' ? '#0F766E' : '#7F1D1D',
              color:        'white',
              borderRadius: 12,
              padding:      '14px 20px',
              boxShadow:    '0 8px 32px rgba(0,0,0,.4)',
              fontSize:     14,
              fontWeight:   600,
              animation:    'slideIn .25s ease',
            }}
          >
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
}
