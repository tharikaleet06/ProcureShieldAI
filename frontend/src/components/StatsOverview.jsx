import React from 'react';
import { ShieldAlert, IndianRupee, Lock, AlertTriangle } from 'lucide-react';

export const StatsOverview = ({ stats }) => {
  if (!stats) return null;

  const exposureLakhs = (stats.financialExposureINR / 100000).toFixed(2);

  const statCards = [
    {
      title: 'Flagged Critical Risks',
      value: stats.flaggedCritical,
      subtitle: `${stats.totalUnderReview} active transactions audited`,
      icon: ShieldAlert,
      iconColor: 'text-rose-400',
      bgColor: 'bg-rose-950/20',
      borderColor: 'border-rose-900/40',
      badge: 'Immediate Action'
    },
    {
      title: 'Financial Leakage Exposure',
      value: `₹${exposureLakhs} L`,
      subtitle: `₹${stats.financialExposureINR.toLocaleString('en-IN')} total at risk`,
      icon: IndianRupee,
      iconColor: 'text-amber-400',
      bgColor: 'bg-amber-950/20',
      borderColor: 'border-amber-900/40',
      badge: 'Pre-Disbursement'
    },
    {
      title: 'Disbursement Holds Placed',
      value: stats.paymentsFrozen,
      subtitle: 'ERP payment run freezes applied',
      icon: Lock,
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-950/20',
      borderColor: 'border-emerald-900/40',
      badge: 'Protected'
    },
    {
      title: 'Average Audit Risk Index',
      value: `${stats.averageAuditRisk}%`,
      subtitle: 'Weighted multi-factor assessment',
      icon: AlertTriangle,
      iconColor: 'text-orange-400',
      bgColor: 'bg-orange-950/20',
      borderColor: 'border-orange-900/40',
      badge: 'Composite'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl border ${card.borderColor} ${card.bgColor} relative overflow-hidden backdrop-blur-xs`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">{card.title}</span>
              <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono-numbers text-white tracking-tight">
                {card.value}
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                {card.badge}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 truncate">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
};
