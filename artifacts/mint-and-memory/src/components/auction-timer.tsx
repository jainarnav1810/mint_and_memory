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
          {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
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
