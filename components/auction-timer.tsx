'use client';

import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface AuctionTimerProps {
  endTime?: string | null;
  onExpire?: () => void;
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };

export const AuctionTimer: React.FC<AuctionTimerProps> = ({ endTime, onExpire, compact = false }) => {
  // `null` until the first client tick so server and client markup agree — the
  // server has no way to render a countdown that matches the browser's clock.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    if (!endTime) return;

    let expiredNotified = false;

    const calculateTimeLeft = () => {
      const difference = new Date(endTime).getTime() - Date.now();

      if (difference <= 0) {
        setTimeLeft({ ...ZERO, isExpired: true });
        if (onExpire && !expiredNotified) {
          expiredNotified = true;
          onExpire();
        }
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  if (!endTime) return null;

  if (timeLeft === null) {
    // Pre-hydration placeholder, sized like the real thing to avoid layout shift.
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#EDE0D4] text-[#A08D6F] border border-[#A08D6F]/40 font-mono-tag text-xs font-bold">
        <Clock className="w-3.5 h-3.5" />
        <span>--:--:--</span>
      </div>
    );
  }

  if (timeLeft.isExpired) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-100 text-rose-900 border border-rose-300 font-mono-tag text-xs font-bold">
        <Clock className="w-3.5 h-3.5" />
        <span>Auction Ended</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#D8DCC8] text-[#3F3A32] border border-[#8C9B7E] font-mono-tag text-xs font-bold">
        <Clock className="w-3.5 h-3.5 text-[#3F3A32]" />
        <span>
          {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
          {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-2 rounded bg-[#D8DCC8] border border-[#8C9B7E] text-[#3F3A32] shadow-sm font-mono-tag">
        <Clock className="w-4 h-4 text-[#3F3A32]" />
        <span className="text-xs uppercase font-bold tracking-wider">Time Remaining:</span>
        <div className="flex items-center gap-1 font-mono font-bold text-sm">
          {timeLeft.days > 0 && (
            <span>
              <strong>{timeLeft.days}</strong>d{' '}
            </span>
          )}
          <span>
            <strong>{String(timeLeft.hours).padStart(2, '0')}</strong>h{' '}
          </span>
          <span>
            <strong>{String(timeLeft.minutes).padStart(2, '0')}</strong>m{' '}
          </span>
          <span>
            <strong>{String(timeLeft.seconds).padStart(2, '0')}</strong>s
          </span>
        </div>
      </div>
    </div>
  );
};
