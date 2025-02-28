import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { 
  DataPoint, 
  Notification, 
  generateSampleData, 
  generateNotification,
  HeartRateStatus
} from '../utils/simulationUtils';

type SimulationScenario = 'normal' | 'stress' | 'critical' | 'random';

interface SimulationState {
  running: boolean;
  scenario: SimulationScenario;
  heartRateData: DataPoint[];
  notifications: Notification[];
  currentHeartRate: number;
  currentStatus: HeartRateStatus;
  latestDataTimestamp: number;
}

export function useSimulation() {
  const [state, setState] = useState<SimulationState>({
    running: false,
    scenario: 'normal',
    heartRateData: [],
    notifications: [],
    currentHeartRate: 70,
    currentStatus: 'NORMAL',
    latestDataTimestamp: Date.now()
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
      const notification = generateNotification(newPoint);
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
    addDataPoint
  };
}
