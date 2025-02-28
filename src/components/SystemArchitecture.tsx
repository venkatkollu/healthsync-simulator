
import React, { useState, useEffect } from 'react';
import { Watch, Smartphone, Server, ArrowRight } from 'lucide-react';
import { SimulationNode, DataPoint } from '../utils/simulationUtils';

interface SystemArchitectureProps {
  nodes: SimulationNode[];
  data: DataPoint[];
  running: boolean;
}

const SystemArchitecture: React.FC<SystemArchitectureProps> = ({ nodes, data, running }) => {
  const [activeNodes, setActiveNodes] = useState<{ [key: string]: boolean }>({});
  
  // Simulate data flowing through the system
  useEffect(() => {
    if (!running) return;
    
    const timers: NodeJS.Timeout[] = [];
    
    // Every 2 seconds, show an active pulse on the smartwatch node
    const smartwatchInterval = setInterval(() => {
      setActiveNodes(prev => ({ ...prev, smartwatch: true }));
      
      // After the processing delay, deactivate the node
      const timer = setTimeout(() => {
        setActiveNodes(prev => ({ ...prev, smartwatch: false }));
      }, nodes.find(n => n.id === 'smartwatch')?.processingDelay || 500);
      
      timers.push(timer);
      
      // After smartwatch delay, activate fog node
      const fogTimer = setTimeout(() => {
        setActiveNodes(prev => ({ ...prev, fog: true }));
        
        // After fog processing delay, deactivate fog node
        const fogEndTimer = setTimeout(() => {
          setActiveNodes(prev => ({ ...prev, fog: false }));
        }, nodes.find(n => n.id === 'fog')?.processingDelay || 500);
        
        timers.push(fogEndTimer);
        
        // After fog delay, activate cloud node
        const cloudTimer = setTimeout(() => {
          setActiveNodes(prev => ({ ...prev, cloud: true }));
          
          // After cloud processing delay, deactivate cloud node
          const cloudEndTimer = setTimeout(() => {
            setActiveNodes(prev => ({ ...prev, cloud: false }));
          }, nodes.find(n => n.id === 'cloud')?.processingDelay || 500);
          
          timers.push(cloudEndTimer);
        }, nodes.find(n => n.id === 'fog')?.processingDelay || 500);
        
        timers.push(cloudTimer);
      }, nodes.find(n => n.id === 'smartwatch')?.processingDelay || 500);
      
      timers.push(fogTimer);
    }, 4000);
    
    return () => {
      clearInterval(smartwatchInterval);
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [nodes, running]);
  
  // Get the icon for a node based on its type
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'SMARTWATCH':
        return <Watch className="w-6 h-6" />;
      case 'FOG':
        return <Smartphone className="w-6 h-6" />;
      case 'CLOUD':
        return <Server className="w-6 h-6" />;
      default:
        return <div className="w-6 h-6" />;
    }
  };
  
  return (
    <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border shadow-sm overflow-hidden animate-fade-in">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold">System Architecture</h2>
          <p className="text-sm text-muted-foreground">IoT data flow visualization</p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center justify-around gap-8 py-4">
          {nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              {/* Node representation */}
              <div className="flex flex-col items-center">
                {/* Node icon with pulse effect */}
                <div 
                  className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    activeNodes[node.id] 
                      ? 'bg-primary/20 text-primary shadow-lg' 
                      : 'bg-card border text-muted-foreground'
                  }`}
                >
                  {activeNodes[node.id] && (
                    <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-pulse"></div>
                  )}
                  <div className="relative z-10">
                    {getNodeIcon(node.type)}
                  </div>
                </div>
                
                {/* Node label */}
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium">{node.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {node.processingDelay}ms delay
                  </p>
                </div>
                
                {/* Data processing indicator */}
                <div className="mt-2 flex items-center gap-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    activeNodes[node.id] ? 'bg-primary animate-pulse' : 'bg-muted'
                  }`}></span>
                  <span className="text-xs text-muted-foreground">
                    {activeNodes[node.id] ? 'Processing' : 'Idle'}
                  </span>
                </div>
              </div>
              
              {/* Arrow between nodes */}
              {index < nodes.length - 1 && (
                <div className="hidden lg:flex items-center text-muted-foreground">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* System description */}
        <div className="mt-4 text-sm text-muted-foreground p-4 rounded-lg bg-muted/50">
          <p>
            Data flows from the IoT smartwatch device to the fog node (smartphone) for local processing and anomaly detection, 
            then to the cloud server for storage, analysis, and advanced health insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemArchitecture;
