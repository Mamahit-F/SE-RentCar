import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, count, max = 5, size = 'sm', showNumber = true }) {
  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const validRating = Number(rating) || 0;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[...Array(max)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClasses[size] || sizeClasses.sm} ${
              i < Math.round(validRating)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-200 fill-slate-100'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-xs font-bold text-ink-primary">
          {validRating > 0 ? validRating.toFixed(1) : 'Baru'}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-ink-secondary">({count})</span>
      )}
    </div>
  );
}
