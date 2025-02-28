
import React, { useMemo } from 'react';
import { Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DataPoint, formatTime, HeartRateStatus, HEART_RATE_RANGES } from '../utils/simulationUtils';

interface HeartRateMonitorProps {
  data: DataPoint[];
  currentHeartRate: number;
  currentStatus: HeartRateStatus;
  latestTimestamp: number;
}

const getStatusStyle = (status: HeartRateStatus) => {
  switch (status) {
    case 'NORMAL':
      return {
        ringColor: 'bg-health-normal',
        textColor: 'text-health-normal'
      };
    case 'ELEVATED':
      return {
        ringColor: 'bg-health-elevated',
        textColor: 'text-health-elevated'
      };
    case 'CRITICAL':
      return {
        ringColor: 'bg-health-critical',
        textColor: 'text-health-critical'
      };
    default:
      return {
        ringColor: 'bg-health-normal',
        textColor: 'text-health-normal'
      };
  }
};

const HeartRateMonitor: React.FC<HeartRateMonitorProps> = ({
  data,
  currentHeartRate,
  currentStatus,
  latestTimestamp
}) => {
  const { ringColor, textColor } = getStatusStyle(currentStatus);
  
  // Prepare data for chart
  const chartData = useMemo(() => {
    return data.map(point => ({
      time: formatTime(point.timestamp),
      heartRate: point.heartRate,
      status: point.status
    }));
  }, [data]);

  // Calculate animation speed based on heart rate
  const animationSpeed = useMemo(() => {
    // Faster animation for higher heart rates
    return Math.max(0.6, 1.2 - (currentHeartRate / 200));
  }, [currentHeartRate]);

  return (
    <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border shadow-sm animate-fade-in">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">Heart Rate Monitor</h2>
            <p className="text-sm text-muted-foreground">Real-time smartwatch data</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground">Last updated</span>
            <p className="text-sm font-medium">{formatTime(latestTimestamp)}</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Heart Rate Pulse Visualization */}
          <div className="relative flex-shrink-0 w-40 h-40 flex items-center justify-center">
            <div className={`absolute w-full h-full rounded-full ${ringColor} opacity-10`}></div>
            
            {/* Animated pulse rings */}
            <div 
              className={`pulse-ring ${ringColor} opacity-20`} 
              style={{ animation: `pulse-ring ${animationSpeed}s cubic-bezier(0.24, 0, 0.38, 1) infinite` }}
            ></div>
            <div 
              className={`pulse-ring ${ringColor} opacity-10`} 
              style={{ animation: `pulse-ring ${animationSpeed}s cubic-bezier(0.24, 0, 0.38, 1) infinite 0.3s` }}
            ></div>
            
            {/* Central heart icon */}
            <div className={`relative z-10 flex flex-col items-center justify-center w-20 h-20 rounded-full bg-card border shadow-sm ${textColor}`}>
              <Heart 
                className="w-8 h-8" 
                style={{ animation: `heart-beat ${animationSpeed}s ease-in-out infinite` }} 
              />
              <span className="text-2xl font-bold mt-1">{currentHeartRate}</span>
              <span className="text-xs text-muted-foreground">BPM</span>
            </div>
          </div>
          
          {/* Heart Rate Chart */}
          <div className="flex-grow w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 10 }} 
                  tickCount={5}
                  minTickGap={30}
                />
                <YAxis 
                  domain={[40, 180]} 
                  tick={{ fontSize: 10 }}
                  tickCount={7}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                    padding: '8px 12px',
                  }} 
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="hsla(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
                
                {/* Reference lines for heart rate zones */}
                <CartesianGrid
                  horizontal={false}
                  vertical={false}
                  strokeDasharray="3 3"
                  strokeOpacity={0.1}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Status Indicators */}
        <div className="grid grid-cols-3 gap-4 mt-2">
          {Object.entries(HEART_RATE_RANGES).map(([key, range]) => (
            <div 
              key={key}
              className={`p-3 rounded-xl border ${
                currentStatus === key ? `bg-${range.color}/10 border-${range.color}/30` : 'bg-card/50'
              }`}
            >
              <div className="text-xs font-medium mb-1">{range.label} Range</div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{range.min}-{range.max} BPM</span>
                {currentStatus === key && (
                  <span className={`inline-block w-2 h-2 rounded-full bg-${range.color} animate-pulse`}></span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeartRateMonitor;
