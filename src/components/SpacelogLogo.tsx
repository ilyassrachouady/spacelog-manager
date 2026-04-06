import React from 'react';

interface SpacelogLogoProps {
  className?: string;
}

export function SpacelogLogo({ className = "w-32 h-auto" }: SpacelogLogoProps) {
  const blueColor = "#0014ff";
  const pinkColor = "#e30052";

  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Boxes */}
      <rect x="35" y="20" width="40" height="35" fill={blueColor} />
      <rect x="25" y="58" width="50" height="40" fill={pinkColor} />
      <rect x="25" y="101" width="50" height="40" fill={blueColor} />
      
      {/* Trolley */}
      <path d="M 15 145 L 75 145" stroke={blueColor} strokeWidth="6" strokeLinecap="round" />
      <path d="M 70 145 L 85 80" stroke={blueColor} strokeWidth="5" strokeLinecap="round" />
      <path d="M 85 80 L 95 80" stroke={blueColor} strokeWidth="5" strokeLinecap="round" />
      
      {/* Wheels */}
      <circle cx="25" cy="155" r="7" fill="white" stroke={blueColor} strokeWidth="4" />
      <circle cx="70" cy="155" r="7" fill="white" stroke={blueColor} strokeWidth="4" />
      
      {/* Man */}
      {/* Head & Cap */}
      <circle cx="135" cy="30" r="12" fill={blueColor} />
      <path d="M 135 22 Q 155 22 165 26 L 165 30 L 135 30 Z" fill={blueColor} />
      
      {/* Body */}
      <path d="M 125 48 Q 145 45 150 55 L 140 95 L 115 95 Z" fill={blueColor} />
      
      {/* Arms */}
      <path d="M 125 55 L 100 80 L 95 75" stroke={blueColor} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 140 55 L 160 75 L 170 70" stroke={blueColor} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      
      {/* Legs */}
      <path d="M 120 90 L 100 120 L 80 135" stroke={blueColor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 135 90 L 145 125 L 145 155" stroke={blueColor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      
      {/* Text */}
      <text 
        x="100" 
        y="195" 
        fontFamily="'Arial Black', Impact, sans-serif" 
        fontSize="44" 
        fontWeight="900" 
        fill={blueColor} 
        textAnchor="middle" 
        letterSpacing="1"
      >
        spacelog
      </text>
      
      {/* Stencil effect lines (optional, to mimic the exact font) */}
      <rect x="35" y="160" width="3" height="40" fill="white" />
      <rect x="65" y="160" width="3" height="40" fill="white" />
      <rect x="90" y="160" width="3" height="40" fill="white" />
      <rect x="115" y="160" width="3" height="40" fill="white" />
      <rect x="145" y="160" width="3" height="40" fill="white" />
    </svg>
  );
}
