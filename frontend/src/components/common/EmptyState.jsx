import React from 'react';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({ icon: Icon = PackageOpen, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-warm-300 rounded-3xl space-y-4 shadow-subtle">
      <div className="p-4 bg-warm-100 rounded-2xl text-midnight-900 border border-warm-200">
        <Icon className="h-8 w-8 stroke-[1.5]" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-base font-bold text-ink-primary">{title}</h4>
        {description && <p className="text-xs text-ink-secondary leading-relaxed">{description}</p>}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
