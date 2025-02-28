import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { 
  DataPoint, 
  Notification, 
  generateSampleData, 
  generateNotification,
  HeartRateStatus,
  EmergencyContact,
  getDefaultEmergencyContacts
} from '../utils/simulationUtils';
import { sendAlertToContacts } from '../utils/alertUtils';

type SimulationScenario = 'normal' | 'stress' | 'critical' | 'random';

interface SimulationState {
  running: boolean;
  scenario: SimulationScenario;
  heartRateData: DataPoint[];
  notifications: Notification[];
  currentHeartRate: number;
  currentStatus: HeartRateStatus;
  latestDataTimestamp: number;
  emergencyContacts: EmergencyContact[];
}

export function useSimulation() {
  const [state, setState] = useState<SimulationState>({
    running: false,
    scenario: 'normal',
    heartRateData: [],
    notifications: [],
    currentHeartRate: 70,
    currentStatus: 'NORMAL',
    latestDataTimestamp: Date.now(),
    emergencyContacts: getDefaultEmergencyContacts()
  });
  
  const intervalRef = useRef<number | null>(null);
  
  // Initialize with some data
  useEffect(() => {
    const initialData = generateSampleData(20, 'normal');
    const lastPoint = initialData[initialData.length - 1];
    
    setState(prev => ({
      ...prev,
      heartRateData: initialData,
      currentHeartRate: lastPoint.heartRate,
      currentStatus: lastPoint.status,
      latestDataTimestamp: lastPoint.timestamp
    }));
  }, []);
  
  // Function to add a new data point
  const addDataPoint = useCallback(() => {
    setState(prev => {
      // Generate a new data point based on current scenario
      const newDataPoints = generateSampleData(1, prev.scenario);
      const newPoint = newDataPoints[0];
      
      // Check if we need to create a notification
      const notification = generateNotification(newPoint, prev.emergencyContacts);
      let newNotifications = [...prev.notifications];
      
      if (notification) {
        newNotifications = [notification, ...newNotifications].slice(0, 100); // Keep last 100 notifications
        
        // Show toast for elevated or critical heart rates
        if (notification.type === 'WARNING') {
          toast.warning(notification.message);
        } else if (notification.type === 'ALERT') {
          toast.error(notification.message, {
            duration: 10000
          });
          
          // Send real-time alerts to contacts for critical events
          if (prev.emergencyContacts.some(c => c.notify)) {
            // Only attempt to send if there are enabled contacts
            sendAlertToContacts(
              prev.emergencyContacts.filter(c => c.notify),
              notification.message
            ).then(notifiedContacts => {
              console.log(`Successfully sent alerts to ${notifiedContacts.length} contacts`);
            }).catch(error => {
              console.error('Failed to send alerts:', error);
              toast.error('Failed to send some alerts. Please try again.');
            });
          }
          
          // If there are contacts to notify, show an additional toast
          if (notification.sentToContacts && notification.sentToContacts.length > 0) {
            const contactNames = notification.sentToContacts.map(c => c.name).join(', ');
            
            toast.info(
              `Emergency alert sent to: ${contactNames}`, 
              {
                duration: 8000,
                icon: <span className="text-red-500">🚨</span>
              }
            );
          }
        }
      }
      
      // Keep the last 100 data points
      const updatedData = [...prev.heartRateData, newPoint].slice(-100);
      
      return {
        ...prev,
        heartRateData: updatedData,
        notifications: newNotifications,
        currentHeartRate: newPoint.heartRate,
        currentStatus: newPoint.status,
        latestDataTimestamp: newPoint.timestamp
      };
    });
  }, []);
  
  // Start/stop the simulation
  const toggleSimulation = useCallback(() => {
    setState(prev => {
      const newRunning = !prev.running;
      
      if (newRunning && !intervalRef.current) {
        // Start the interval to generate data every 2 seconds
        intervalRef.current = window.setInterval(addDataPoint, 2000);
        
        // If starting simulation with critical scenario, send a test alert
        if (prev.scenario === 'critical') {
          const enabledContacts = prev.emergencyContacts.filter(c => c.notify);
          if (enabledContacts.length > 0) {
            toast.info('Simulation started with critical heart rate scenario - sending test alerts');
            
            // Delay slightly to let the toast above show first
            setTimeout(() => {
              sendAlertToContacts(
                enabledContacts,
                "SIMULATION TEST: Critical heart rate detected. This is a test message."
              );
            }, 1000);
          }
        }
      } else if (!newRunning && intervalRef.current) {
        // Clear the interval when stopping
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      return {
        ...prev,
        running: newRunning
      };
    });
  }, [addDataPoint]);
  
  // Change the simulation scenario
  const changeScenario = useCallback((scenario: SimulationScenario) => {
    setState(prev => ({
      ...prev,
      scenario
    }));
    
    toast.info(`Switched to ${scenario} heart rate scenario`);
  }, []);
  
  // Mark a notification as read
  const markNotificationAsRead = useCallback((notificationId: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    }));
  }, []);
  
  // Update emergency contacts
  const updateEmergencyContacts = useCallback((contacts: EmergencyContact[]) => {
    setState(prev => ({
      ...prev,
      emergencyContacts: contacts
    }));
    
    toast.success('Emergency contacts updated');
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return {
    ...state,
    toggleSimulation,
    changeScenario,
    markNotificationAsRead,
    updateEmergencyContacts,
    addDataPoint
  };
}
