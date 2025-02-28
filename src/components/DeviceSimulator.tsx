
import React from 'react';
import { Play, Pause, Activity, BellRing, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HEART_RATE_RANGES } from '../utils/simulationUtils';

interface DeviceSimulatorProps {
  running: boolean;
  scenario: string;
  toggleSimulation: () => void;
  changeScenario: (scenario: 'normal' | 'stress' | 'critical' | 'random') => void;
}

const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  running,
  scenario,
  toggleSimulation,
  changeScenario
}) => {
  return (
    <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border shadow-sm animate-fade-in">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold">Simulation Controls</h2>
          <p className="text-sm text-muted-foreground">Configure the heart rate monitoring simulation</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Simulation Control */}
          <div className="flex flex-col gap-3">
            <div className="text-sm font-medium">Simulation Status</div>
            <div className="flex gap-3">
              <Button 
                variant={running ? "outline" : "default"}
                size="sm"
                className="flex-1 gap-2"
                onClick={toggleSimulation}
              >
                {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {running ? "Pause" : "Start"} Simulation
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className={`flex gap-2 items-center ${running ? 'text-green-500' : 'text-muted-foreground'}`}
                disabled={true}
              >
                <span className={`inline-block w-2 h-2 rounded-full ${running ? 'bg-green-500 animate-pulse' : 'bg-muted'}`}></span>
                {running ? "Collecting data" : "Idle"}
              </Button>
            </div>
          </div>
          
          {/* Scenario Selection */}
          <div className="flex flex-col gap-3 mt-2">
            <div className="text-sm font-medium">Heart Rate Scenario</div>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant={scenario === 'normal' ? "default" : "outline"}
                size="sm"
                className={scenario === 'normal' ? 'bg-health-normal/20 text-health-normal hover:bg-health-normal/30 hover:text-health-normal border-health-normal/20' : ''}
                onClick={() => changeScenario('normal')}
              >
                <Activity className="w-4 h-4 mr-2" />
                Normal
                <span className="text-xs ml-1 opacity-70">
                  ({HEART_RATE_RANGES.NORMAL.min}-{HEART_RATE_RANGES.NORMAL.max} BPM)
                </span>
              </Button>
              
              <Button 
                variant={scenario === 'stress' ? "default" : "outline"}
                size="sm"
                className={scenario === 'stress' ? 'bg-health-elevated/20 text-health-elevated hover:bg-health-elevated/30 hover:text-health-elevated border-health-elevated/20' : ''}
                onClick={() => changeScenario('stress')}
              >
                <Activity className="w-4 h-4 mr-2" />
                Elevated
                <span className="text-xs ml-1 opacity-70">
                  ({HEART_RATE_RANGES.ELEVATED.min}-{HEART_RATE_RANGES.ELEVATED.max} BPM)
                </span>
              </Button>
              
              <Button 
                variant={scenario === 'critical' ? "default" : "outline"}
                size="sm"
                className={scenario === 'critical' ? 'bg-health-critical/20 text-health-critical hover:bg-health-critical/30 hover:text-health-critical border-health-critical/20' : ''}
                onClick={() => changeScenario('critical')}
              >
                <BellRing className="w-4 h-4 mr-2" />
                Critical
                <span className="text-xs ml-1 opacity-70">
                  ({HEART_RATE_RANGES.CRITICAL.min}+ BPM)
                </span>
              </Button>
              
              <Button 
                variant={scenario === 'random' ? "default" : "outline"}
                size="sm"
                onClick={() => changeScenario('random')}
              >
                <BellOff className="w-4 h-4 mr-2" />
                Random
                <span className="text-xs ml-1 opacity-70">
                  (All ranges)
                </span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Additional info */}
        <div className="text-xs text-muted-foreground mt-2 p-3 rounded-lg bg-muted/50">
          <p>
            The simulation generates synthetic heart rate data every 2 seconds based on the selected scenario.
            Normal heart rate is 60-100 BPM, elevated is 101-160 BPM, and critical is above 160 BPM.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeviceSimulator;
