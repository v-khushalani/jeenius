import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground">
    <img
      src="/logo.png"
      alt="Jeenius learning logo"
      className="h-14 w-14 animate-pulse"
      loading="eager"
    />
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

export default LoadingScreen;
