'use client';

import { useEffect, useState } from 'react';
import { getRemainingAccess } from '../lib/accessKey';

export default function AccessStatus() {
  const [remaining, setRemaining] = useState<{
    type: 'usage' | 'time' | null;
    remaining: number;
    total: number;
  }>({ type: null, remaining: 0, total: 0 });

  useEffect(() => {
    const access = getRemainingAccess();
    setRemaining(access);

    // Update every minute for time-based access
    const interval = setInterval(() => {
      const updated = getRemainingAccess();
      setRemaining(updated);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!remaining.type) return null;

  const percentage = (remaining.remaining / remaining.total) * 100;
  const isLow = remaining.remaining <= (remaining.total * 0.2); // 20% or less remaining

  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-gray-700">
          {remaining.type === 'usage' ? 'Videos Remaining' : 'Access Time'}
        </span>
        <span className={`text-lg font-bold ${isLow ? 'text-red-500' : 'text-primary'}`}>
          {remaining.remaining}
          {remaining.type === 'time' && ' days'}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all ${
            isLow ? 'bg-red-500' : 'bg-primary'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-xs text-gray-600">
        {remaining.type === 'usage'
          ? `${remaining.remaining} of ${remaining.total} videos left`
          : `${remaining.remaining} days until expiration`}
      </p>

      {isLow && (
        <a
          href="https://thrivecart.com/your-product-link-here"
          className="mt-3 block w-full text-center bg-accent text-white text-sm font-bold py-2 px-4 rounded hover:bg-opacity-90 transition"
        >
          Get More Videos
        </a>
      )}
    </div>
  );
}
