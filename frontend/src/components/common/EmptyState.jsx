import React from 'react';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({ icon: Icon = PackageOpen, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
      <div className="p-3 bg-slate-800/80 rounded-2xl text-slate-400">
        <Icon className="h-8 w-8" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-base font-bold text-white">{title}</h4>
        {description && <p className="text-xs text-slate-400">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
