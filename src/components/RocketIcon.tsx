import React from 'react';

const RocketIcon: React.FC = () => {
  return (
    <svg
      viewBox="0 0 600 400"
      className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Metallic Gradient Definition */}
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#d1d5db" />
          <stop offset="50%" stopColor="#9ca3af" />
          <stop offset="70%" stopColor="#d1d5db" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        
        {/* Inner shadow filter for cut-out effect */}
        <filter id="innerShadow">
          <feComponentTransfer in="SourceAlpha">
            <feFuncA type="table" tableValues="1 0" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="3" />
          <feOffset dx="2" dy="4" result="offsetblur" />
          <feFlood floodColor="rgb(0, 0, 0)" floodOpacity="0.5" />
          <feComposite in2="offsetblur" operator="in" />
          <feComposite in2="SourceAlpha" operator="in" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode />
          </feMerge>
        </filter>
      </defs>

      <g 
        fill="none" 
        stroke="url(#metalGradient)" 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        transform="rotate(0, 300, 200)"
      >
        {/* Top Wing (Upper Fin) */}
        <path d="M 320 160 L 260 100 Q 230 100 210 130 L 250 170" />

        {/* Bottom Wing (Lower Fin) */}
        <path d="M 320 240 L 260 300 Q 230 300 210 270 L 250 230" />

        {/* Main Body (Fuselage) */}
        {/* A long ellipse-like shape pointed at right, flattened at left */}
        <path d="M 230 150 L 230 250 C 230 250, 180 250, 180 200 C 180 150, 230 150, 230 150" strokeWidth="10" />
        
        {/* The Rocket Outline */}
        <path d="M 230 150 L 450 150 Q 520 200 550 200 Q 520 200 450 250 L 230 250" />
        <path d="M 230 150 Q 210 170 210 200 Q 210 230 230 250" />

        {/* Vertical Separator Lines on Body */}
        <path d="M 370 155 Q 350 200 370 245" />
        <path d="M 440 170 Q 420 200 440 230" />

        {/* Center Window (Porthole) */}
        <circle cx="430" cy="200" r="25" strokeWidth="10" />
        <circle cx="430" cy="200" r="10" strokeWidth="6" />

        {/* Rear Engine details */}
        <path d="M 230 165 L 180 170" strokeWidth="8" />
        <path d="M 230 235 L 180 230" strokeWidth="8" />

        {/* Flames (Wavy lines at the back) */}
        <g strokeWidth="8" strokeOpacity="0.9">
             {/* Top Flame */}
             <path d="M 190 180 Q 150 160 120 180 T 80 160" />
             {/* Middle Flame */}
             <path d="M 190 200 Q 140 200 100 200" />
             {/* Bottom Flame */}
             <path d="M 190 220 Q 150 240 120 220 T 80 240" />
        </g>
      </g>
    </svg>
  );
};

export default RocketIcon;