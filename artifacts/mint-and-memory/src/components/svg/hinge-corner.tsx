import React from 'react';

export const HingeCorner: React.FC<{ position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }> = ({ position }) => {
  const rotation = {
    'top-left': 'rotate-0',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': '-rotate-90',
  }[position];

  return (
    <div className={`absolute w-4 h-4 text-[#C7B79C] pointer-events-none ${rotation} ${position.replace('-', ':0 ')}`}>
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M0 0 H20 V4 H4 V20 H0 Z" fill="#C7B79C" opacity="0.85" />
        <circle cx="8" cy="8" r="1.5" fill="#6B5C43" />
      </svg>
    </div>
  );
};
