
import React from 'react';
import { Bell, AlertTriangle, Info, X } from 'lucide-react';
import { Notification, formatTime } from '../utils/simulationUtils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationPanelProps {
  notifications: Notification[];
  markAsRead: (id: string) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, markAsRead }) => {
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-health-elevated" />;
      case 'ALERT':
        return <AlertTriangle className="w-4 h-4 text-health-critical" />;
      default:
        return <Info className="w-4 h-4 text-primary" />;
    }
  };
  
  // Get notification background based on type
  const getNotificationBackground = (type: string) => {
    switch (type) {
      case 'WARNING':
        return 'bg-health-elevated/10 border-health-elevated/20';
      case 'ALERT':
        return 'bg-health-critical/10 border-health-critical/20';
      default:
        return 'bg-primary/10 border-primary/20';
    }
  };
  
  return (
    <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border shadow-sm animate-fade-in h-full">
      <div className="flex flex-col gap-6 h-full">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Notifications</h2>
            <p className="text-sm text-muted-foreground">Health alerts and system messages</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <div className="bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {unreadCount}
              </div>
            )}
          </div>
        </div>
        
        <ScrollArea className="flex-grow pr-4 -mr-4">
          <div className="flex flex-col gap-3">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground flex flex-col items-center">
                <Bell className="w-8 h-8 mb-2 text-muted" />
                <p>No notifications yet</p>
                <p className="text-xs">Alerts will appear when anomalies are detected</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`p-4 rounded-xl border ${getNotificationBackground(notification.type)} ${
                    !notification.read ? 'animate-fade-in' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div>
                        <p className="text-sm leading-tight">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    {!notification.read && (
                      <button 
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default NotificationPanel;
