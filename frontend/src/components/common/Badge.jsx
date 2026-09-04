import React from 'react';

export default function Badge({ status, text, size = 'sm' }) {
  const displayStatus = status || text;
  
  const getBadgeStyle = (val) => {
    switch (val) {
      case 'ACTIVE':
      case 'CONFIRMED':
      case 'SUCCESS':
      case 'COMPLETED':
      case 'AVAILABLE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'REJECTED':
      case 'CANCELLED':
      case 'FAILED':
      case 'INACTIVE':
      case 'UNAVAILABLE':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'USER':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'PARTNER':
        return 'bg-midnight-50 text-midnight-900 border-midnight-200';
      case 'ADMIN':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      default:
        return 'bg-warm-100 text-ink-secondary border-warm-300';
    }
  };

  const getDotColor = (val) => {
    switch (val) {
      case 'ACTIVE':
      case 'CONFIRMED':
      case 'SUCCESS':
      case 'COMPLETED':
      case 'AVAILABLE':
        return 'bg-emerald-500';
      case 'PENDING':
        return 'bg-amber-500';
      case 'REJECTED':
      case 'CANCELLED':
      case 'FAILED':
      case 'INACTIVE':
      case 'UNAVAILABLE':
        return 'bg-rose-500';
      case 'PARTNER':
        return 'bg-midnight-700';
      case 'ADMIN':
        return 'bg-amber-600';
      default:
        return 'bg-slate-400';
    }
  };

  const showDot = ['ACTIVE', 'CONFIRMED', 'SUCCESS', 'COMPLETED', 'AVAILABLE', 'PENDING', 'REJECTED', 'CANCELLED', 'INACTIVE'].includes(displayStatus);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle(displayStatus)}`}>
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${getDotColor(displayStatus)}`} />}
      {text || status}
    </span>
  );
}
