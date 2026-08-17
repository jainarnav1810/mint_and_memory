import React from 'react';

interface DrawerPullProps {
  className?: string;
  isSliding?: boolean;
  label?: string;
}

export const DrawerPull: React.FC<DrawerPullProps> = ({ className = 'w-24 h-8', isSliding = false, label }) => {
  return (
    <div className={`relative inline-flex flex-col items-center justify-center transition-transform duration-300 ${isSliding ? 'scale-105 translate-y-0.5' : ''}`}>
      {/* Brass Hardware Cup Handle SVG */}
      <svg
        viewBox="0 0 120 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} drop-shadow-md`}
      >
        {/* Outer Brass Plate */}
        <rect x="2" y="2" width="116" height="36" rx="6" fill="url(#brass-grad)" stroke="#8C7A5C" strokeWidth="1.5" />
        
        {/* Left Screw */}
        <circle cx="12" cy="20" r="3" fill="#6B5C43" stroke="#C7B79C" strokeWidth="0.8" />
        <line x1="10" y1="20" x2="14" y2="20" stroke="#3F3A32" strokeWidth="0.8" />

        {/* Right Screw */}
        <circle cx="108" cy="20" r="3" fill="#6B5C43" stroke="#C7B79C" strokeWidth="0.8" />
        <line x1="106" y1="20" x2="110" y2="20" stroke="#3F3A32" strokeWidth="0.8" />

        {/* Center Cup Handle Slot / Label Recess */}
        <rect x="26" y="8" width="68" height="24" rx="3" fill="#3F3A32" stroke="#8C7A5C" strokeWidth="1" />
        <rect x="28" y="10" width="64" height="20" rx="2" fill="#F5F0E6" />

        {/* Shading Highlights */}
        <path d="M 4 4 L 116 4" stroke="#E6D8BA" strokeWidth="1" opacity="0.6" />

        {/* Gradients */}
        <defs>
          <linearGradient id="brass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E6D8BA" />
            <stop offset="30%" stopColor="#C7B79C" />
            <stop offset="70%" stopColor="#A08D6F" />
            <stop offset="100%" stopColor="#6B5C43" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Label Text inside the cup slot */}
      {label && (
        <span className="absolute top-2.5 text-[9px] font-mono-tag font-bold text-[#3F3A32] uppercase tracking-wider text-center pointer-events-none">
          {label}
        </span>
      )}
    </div>
  );
};
