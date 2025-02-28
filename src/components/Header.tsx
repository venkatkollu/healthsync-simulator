
import React from 'react';
import { Activity, Heart, Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-8 flex items-center justify-between border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">HealthSync</h1>
          <p className="text-xs text-muted-foreground">IoT Health Monitoring Simulator</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Heart className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Heart Rate</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Analytics</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          System Online
        </div>
      </div>
    </header>
  );
};

export default Header;
