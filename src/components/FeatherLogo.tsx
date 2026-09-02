import React from 'react';

interface FeatherLogoProps {
  className?: string;
  size?: number;
}

export const FeatherLogo: React.FC<FeatherLogoProps> = ({ 
  className = "w-6 h-6",
  size
}) => {
  return (
    <svg 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <defs>
        <linearGradient id="featherGradient" x1="12" y1="52" x2="52" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="40%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>
        <linearGradient id="featherShaft" x1="10" y1="56" x2="54" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
        <filter id="featherGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3B82F6" floodOpacity="0.25" />
        </filter>
      </defs>
      
      {/* Outer Glow & Background Accent if needed */}
      <g filter="url(#featherGlow)">
        {/* Main Feather Vane Body (Curved Soft Blue Feather) */}
        <path 
          d="M52.5 12C52.5 12 47.8 19.5 41.5 24.2C38.2 26.7 34.2 28.5 30.1 30.2C29.6 30.4 28.8 30.1 28.7 29.5C28.5 28.7 29.2 27.5 30.4 26.5C34.8 22.8 41.2 17.5 46.2 13.2C39.5 16.5 31.8 22.2 25.5 28.8C20.8 33.7 17.2 39.5 15.2 46.2C14.8 47.5 15.8 48.6 17.1 48.2C22.8 46.2 28.5 42.5 33.2 38.2C39.8 32.2 45.8 24.5 49.5 18.2C48.2 20.5 46.1 23.2 43.5 25.8C42.8 26.5 43.2 27.8 44.2 27.5C47.8 26.5 50.8 22.8 52.5 18.5C53.2 16.7 53.2 14.2 52.5 12Z" 
          fill="url(#featherGradient)"
        />

        {/* Feather Top Plume Detail */}
        <path 
          d="M52.5 12C46.8 12.8 41.2 16.5 36.8 20.8C33.2 24.2 30.1 28.5 27.5 33.2C27.2 33.8 27.8 34.5 28.4 34.2C32.5 32.2 37.8 28.8 42.5 24.8C47.5 20.5 51.5 15.5 52.5 12Z" 
          fill="#DBEAFE" 
          fillOpacity="0.85"
        />

        {/* Central Quill Shaft / Spine */}
        <path 
          d="M11 54.5C13.5 52 18.2 46.5 23.5 40.5C31.5 31.5 42.2 20.8 54 10.5" 
          stroke="url(#featherShaft)" 
          strokeWidth="2.5" 
          strokeLinecap="round"
        />

        {/* Feather Quill Stem Base Curve */}
        <path 
          d="M10.5 55.5C13.2 55.2 17.5 53.8 22 51.5C23.2 50.8 22.8 49.2 21.5 49.5C17.5 50.5 13.8 51.8 10.5 55.5Z" 
          fill="#93C5FD"
        />
      </g>
    </svg>
  );
};
