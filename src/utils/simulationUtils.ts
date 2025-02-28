
// Constants for heart rate ranges
export const HEART_RATE_RANGES = {
  NORMAL: { min: 60, max: 100, label: 'Normal', color: 'health-normal' },
  ELEVATED: { min: 101, max: 160, label: 'Elevated', color: 'health-elevated' },
  CRITICAL: { min: 161, max: 200, label: 'Critical', color: 'health-critical' }
};

export type HeartRateStatus = 'NORMAL' | 'ELEVATED' | 'CRITICAL';

export interface SimulationNode {
  id: string;
  name: string;
  type: 'SMARTWATCH' | 'FOG' | 'CLOUD'; 
  position: { x: number; y: number };
  processingDelay: number; // in milliseconds
}

export interface DataPoint {
  id: string;
  timestamp: number;
  heartRate: number;
  status: HeartRateStatus;
  processed: {
    smartwatch: boolean;
    fog: boolean;
    cloud: boolean;
  };
}

export interface EmergencyContact {
  id: string;
  name: string;
  contactType: 'phone' | 'email';
  value: string;
  notify: boolean;
}

export interface Notification {
  id: string;
  type: 'INFO' | 'WARNING' | 'ALERT';
  message: string;
  timestamp: number;
  read: boolean;
  sentToContacts?: EmergencyContact[];
}

// Function to determine heart rate status
export const getHeartRateStatus = (heartRate: number): HeartRateStatus => {
  if (heartRate <= HEART_RATE_RANGES.NORMAL.max) return 'NORMAL';
  if (heartRate <= HEART_RATE_RANGES.ELEVATED.max) return 'ELEVATED';
  return 'CRITICAL';
};

// Generate a random heart rate within a specified range
export const generateHeartRate = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to generate sample heart rate data
export const generateSampleData = (
  count: number,
  scenario: 'normal' | 'stress' | 'critical' | 'random' = 'normal'
): DataPoint[] => {
  const data: DataPoint[] = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    let heartRate: number;
    
    switch (scenario) {
      case 'normal':
        heartRate = generateHeartRate(HEART_RATE_RANGES.NORMAL.min, HEART_RATE_RANGES.NORMAL.max);
        break;
      case 'stress':
        heartRate = generateHeartRate(HEART_RATE_RANGES.ELEVATED.min, HEART_RATE_RANGES.ELEVATED.max);
        break;
      case 'critical':
        heartRate = generateHeartRate(HEART_RATE_RANGES.CRITICAL.min, HEART_RATE_RANGES.CRITICAL.max);
        break;
      case 'random':
        heartRate = generateHeartRate(HEART_RATE_RANGES.NORMAL.min, HEART_RATE_RANGES.CRITICAL.max);
        break;
    }
    
    const status = getHeartRateStatus(heartRate);
    
    data.push({
      id: `data-${i}-${now}`,
      timestamp: now - (count - i) * 10000, // 10 second intervals
      heartRate,
      status,
      processed: {
        smartwatch: true,
        fog: i > count - 3, // Last 3 points not yet processed by fog
        cloud: i > count - 5, // Last 5 points not yet processed by cloud
      }
    });
  }
  
  return data;
};

// Generate default emergency contacts
export const getDefaultEmergencyContacts = (): EmergencyContact[] => [
  {
    id: 'contact-1',
    name: 'Dr. Sarah Johnson',
    contactType: 'phone',
    value: '+1 (555) 123-4567',
    notify: true
  },
  {
    id: 'contact-2',
    name: 'Emergency Services',
    contactType: 'phone',
    value: '911',
    notify: true
  },
  {
    id: 'contact-3',
    name: 'Family Member',
    contactType: 'phone',
    value: '+1 (555) 987-6543',
    notify: true
  },
  {
    id: 'contact-4',
    name: 'Medical Alert Service',
    contactType: 'email',
    value: 'alerts@medicalalert.example.com',
    notify: false
  }
];

// Generate a notification based on heart rate status
export const generateNotification = (dataPoint: DataPoint, contacts: EmergencyContact[]): Notification | null => {
  if (dataPoint.status === 'ELEVATED') {
    return {
      id: `notification-${dataPoint.id}`,
      type: 'WARNING',
      message: `Elevated heart rate detected: ${dataPoint.heartRate} bpm. Consider resting.`,
      timestamp: Date.now(),
      read: false
    };
  }
  
  if (dataPoint.status === 'CRITICAL') {
    // For critical alerts, include which contacts would be notified
    const notifyContacts = contacts.filter(contact => contact.notify);
    
    return {
      id: `notification-${dataPoint.id}`,
      type: 'ALERT',
      message: `CRITICAL: Abnormal heart rate detected: ${dataPoint.heartRate} bpm. Medical attention required.`,
      timestamp: Date.now(),
      read: false,
      sentToContacts: notifyContacts.length > 0 ? notifyContacts : undefined
    };
  }
  
  return null;
};

// Define the system architecture nodes
export const getSystemNodes = (): SimulationNode[] => [
  {
    id: 'smartwatch',
    name: 'Smartwatch',
    type: 'SMARTWATCH',
    position: { x: 100, y: 200 },
    processingDelay: 100
  },
  {
    id: 'fog',
    name: 'Fog Node (Smartphone)',
    type: 'FOG',
    position: { x: 300, y: 200 },
    processingDelay: 300
  },
  {
    id: 'cloud',
    name: 'Cloud Server',
    type: 'CLOUD',
    position: { x: 500, y: 200 },
    processingDelay: 1000
  }
];

// Format timestamp to readable time
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};
