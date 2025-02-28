
import React from 'react';
import Header from '@/components/Header';
import HeartRateMonitor from '@/components/HeartRateMonitor';
import SystemArchitecture from '@/components/SystemArchitecture';
import DeviceSimulator from '@/components/DeviceSimulator';
import NotificationPanel from '@/components/NotificationPanel';
import DataFlow from '@/components/DataFlow';
import { useSimulation } from '@/hooks/useSimulation';
import { getSystemNodes } from '@/utils/simulationUtils';

const Index = () => {
  const simulation = useSimulation();
  const systemNodes = getSystemNodes();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/20">
      <Header />
      
      <main className="flex-grow p-6 md:p-8 container max-w-screen-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Heart Rate Monitor */}
            <HeartRateMonitor 
              data={simulation.heartRateData}
              currentHeartRate={simulation.currentHeartRate}
              currentStatus={simulation.currentStatus}
              latestTimestamp={simulation.latestDataTimestamp}
            />
            
            {/* System Architecture Visualization */}
            <SystemArchitecture 
              nodes={systemNodes}
              data={simulation.heartRateData}
              running={simulation.running}
            />
            
            {/* Data Flow */}
            <DataFlow 
              data={simulation.heartRateData}
              running={simulation.running}
            />
          </div>
          
          {/* Sidebar - 1/3 width on large screens */}
          <div className="space-y-6">
            {/* Simulation Controls */}
            <DeviceSimulator 
              running={simulation.running}
              scenario={simulation.scenario}
              toggleSimulation={simulation.toggleSimulation}
              changeScenario={simulation.changeScenario}
            />
            
            {/* Notifications Panel */}
            <div className="h-[calc(100vh-28rem)]">
              <NotificationPanel 
                notifications={simulation.notifications}
                markAsRead={simulation.markNotificationAsRead}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
