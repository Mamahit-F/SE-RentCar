import React from 'react';

export default function Badge({ status, text }) {
  const displayStatus = status || text;
  
  const getBadgeStyle = (val) => {
    switch (val) {
      case 'ACTIVE':
      case 'CONFIRMED':
      case 'SUCCESS':
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'REJECTED':
      case 'CANCELLED':
      case 'FAILED':
      case 'INACTIVE':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'USER':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'PARTNER':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'ADMIN':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle(displayStatus)}`}>
      {text || status}
    </span>
  );
}
