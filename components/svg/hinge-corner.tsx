import React from 'react';

export type HingeCornerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

/**
 * Brass photo-corner hinge, as used to mount specimens onto an album page.
 * Rendered four times per frame — one per corner.
 */
const CORNERS: Record<HingeCornerPosition, string> = {
  'top-left': 'top-0 left-0 rotate-0',
  'top-right': 'top-0 right-0 rotate-90',
  'bottom-right': 'bottom-0 right-0 rotate-180',
  'bottom-left': 'bottom-0 left-0 -rotate-90',
};

export const HingeCorner: React.FC<{ position: HingeCornerPosition }> = ({ position }) => {
  return (
    <div className={`absolute w-4 h-4 text-[#C7B79C] pointer-events-none ${CORNERS[position]}`}>
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M0 0 H20 V4 H4 V20 H0 Z" fill="#C7B79C" opacity="0.85" />
        <circle cx="8" cy="8" r="1.5" fill="#6B5C43" />
      </svg>
    </div>
  );
};
