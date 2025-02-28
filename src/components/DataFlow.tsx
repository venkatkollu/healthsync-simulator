
import React, { useEffect, useState } from 'react';
import { ArrowDown, Database, Clock, Server } from 'lucide-react';
import { DataPoint, formatTime } from '../utils/simulationUtils';

interface DataFlowProps {
  data: DataPoint[];
  running: boolean;
}

const DataFlow: React.FC<DataFlowProps> = ({ data, running }) => {
  // Select the most recent 5 data points
  const recentData = data.slice(-5).reverse();

  const [animateIndices, setAnimateIndices] = useState<{[key: string]: boolean}>({});
  
  // Create animation effect when new data is added
  useEffect(() => {
    if (!data.length) return;
    
    // Get latest data point's ID
    const latestId = data[data.length - 1].id;
    
    // Set animation for this ID
    setAnimateIndices(prev => ({ ...prev, [latestId]: true }));
    
    // Remove animation after a delay
    const timer = setTimeout(() => {
      setAnimateIndices(prev => {
        const newState = { ...prev };
        delete newState[latestId];
        return newState;
      });
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [data]);
  
  return (
    <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border shadow-sm animate-fade-in">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold">Data Flow</h2>
          <p className="text-sm text-muted-foreground">Recent health data processing</p>
        </div>
        
        <div className="overflow-hidden">
          <div className="relative overflow-x-auto rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-3 text-sm font-medium text-left text-muted-foreground">Timestamp</th>
                  <th className="p-3 text-sm font-medium text-left text-muted-foreground">Heart Rate</th>
                  <th className="p-3 text-sm font-medium text-center text-muted-foreground">Smartwatch</th>
                  <th className="p-3 text-sm font-medium text-center text-muted-foreground">Fog Node</th>
                  <th className="p-3 text-sm font-medium text-center text-muted-foreground">Cloud</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No data available. Start the simulation to generate data.
                    </td>
                  </tr>
                ) : (
                  recentData.map((point) => (
                    <tr 
                      key={point.id} 
                      className={`
                        transition-colors duration-300 hover:bg-muted/30
                        ${animateIndices[point.id] ? 'bg-primary/5' : ''}
                      `}
                    >
                      <td className="p-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {formatTime(point.timestamp)}
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                          ${
                            point.status === 'NORMAL' 
                              ? 'bg-health-normal/10 text-health-normal' 
                              : point.status === 'ELEVATED'
                                ? 'bg-health-elevated/10 text-health-elevated'
                                : 'bg-health-critical/10 text-health-critical'
                          }`
                        }>
                          {point.heartRate} BPM
                        </div>
                      </td>
                      
                      {/* Processing status for each node */}
                      {['smartwatch', 'fog', 'cloud'].map((node, index) => (
                        <td key={`${point.id}-${node}`} className="p-3 text-center">
                          <div className="flex flex-col items-center justify-center">
                            {point.processed[node as keyof typeof point.processed] ? (
                              <>
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                  <ArrowDown className="w-3 h-3" />
                                </div>
                                <span className="text-xs text-primary mt-1">Processed</span>
                              </>
                            ) : running ? (
                              <>
                                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center animate-pulse">
                                  <Server className="w-3 h-3 text-muted-foreground" />
                                </div>
                                <span className="text-xs text-muted-foreground mt-1">Pending</span>
                              </>
                            ) : (
                              <>
                                <div className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center">
                                  <Database className="w-3 h-3 text-muted-foreground" />
                                </div>
                                <span className="text-xs text-muted-foreground mt-1">Waiting</span>
                              </>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground p-3 rounded-lg bg-muted/50">
          <p>
            Data is collected from the smartwatch, processed by the fog node for immediate analysis, 
            and sent to the cloud for long-term storage and advanced analytics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataFlow;
