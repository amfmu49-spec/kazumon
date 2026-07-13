import React from 'react';

export default function Logo() {
  return (
    <svg width="100%" height="auto" viewBox="0 0 500 200" style={{ filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.6))', overflow: 'visible' }}>
      <defs>
        <linearGradient id="logoGradFront" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="30%" stopColor="#FFEB3B" />
          <stop offset="60%" stopColor="#FF9800" />
          <stop offset="100%" stopColor="#E65100" />
        </linearGradient>
        <linearGradient id="logoGradBack" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bf360c" />
          <stop offset="100%" stopColor="#3e2723" />
        </linearGradient>
      </defs>
      
      <g fontFamily="'M PLUS Rounded 1c', sans-serif" fontWeight="900" fontSize="110px" textAnchor="middle">
        {/* Layer 1: Thickest Dark Outline / 3D Extrusion (Bottom) */}
        <text x="50%" y="75%" fill="url(#logoGradBack)" stroke="url(#logoGradBack)" strokeWidth="40px" strokeLinejoin="round">数モン</text>
        <text x="50%" y="70%" fill="url(#logoGradBack)" stroke="url(#logoGradBack)" strokeWidth="40px" strokeLinejoin="round">数モン</text>
        
        {/* Layer 2: White Border */}
        <text x="50%" y="65%" fill="none" stroke="#FFFFFF" strokeWidth="25px" strokeLinejoin="round">数モン</text>
        
        {/* Layer 3: Main Gradient Fill */}
        <text x="50%" y="65%" fill="url(#logoGradFront)" stroke="none">数モン</text>
      </g>
      
      {/* Sparkles */}
      <path d="M 90,30 Q 100,50 120,60 Q 100,70 90,90 Q 80,70 60,60 Q 80,50 90,30" fill="#FFF200" filter="drop-shadow(0 0 5px #FFF)" />
      <path d="M 420,40 Q 425,55 440,60 Q 425,65 420,80 Q 415,65 400,60 Q 415,55 420,40" fill="#FFFFFF" filter="drop-shadow(0 0 5px #FFF)" />
      <path d="M 400,130 Q 405,140 420,145 Q 405,150 400,160 Q 395,150 380,145 Q 395,140 400,130" fill="#FFC300" filter="drop-shadow(0 0 5px #FFF)" />
      <path d="M 120,150 Q 123,158 135,162 Q 123,166 120,174 Q 117,166 105,162 Q 117,158 120,150" fill="#FFFFFF" filter="drop-shadow(0 0 5px #FFF)" />
    </svg>
  );
}
