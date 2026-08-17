import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface AuctionTimerProps {
  endTime?: string | null;
  onExpire?: () => void;
  compact?: boolean;
}

export const AuctionTimer: React.FC<AuctionTimerProps> = ({ endTime, onExpire, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number; isExpired: boolean }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeLeft = () => {
      const difference = new Date(endTime).getTime() - Date.now();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        if (onExpire) onExpire();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  if (!endTime) return null;

  if (timeLeft.isExpired) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <Clock className="w-3.5 h-3.5" />
        <span>Auction Ended</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
        <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>
          {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
          {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 shadow-sm backdrop-blur-sm">
        <Clock className="w-4 h-4 text-amber-400 animate-spin-slow" />
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/80">Time Left:</span>
        <div className="flex items-center gap-1 font-mono font-bold text-sm">
          {timeLeft.days > 0 && (
            <span>
              <strong className="text-amber-200">{timeLeft.days}</strong>d{' '}
            </span>
          )}
          <span>
            <strong className="text-amber-200">{String(timeLeft.hours).padStart(2, '0')}</strong>h{' '}
          </span>
          <span>
            <strong className="text-amber-200">{String(timeLeft.minutes).padStart(2, '0')}</strong>m{' '}
          </span>
          <span>
            <strong className="text-amber-200">{String(timeLeft.seconds).padStart(2, '0')}</strong>s
          </span>
        </div>
      </div>
    </div>
  );
};
