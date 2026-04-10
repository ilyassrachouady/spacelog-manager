import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Building2, TrendingUp, Euro, AlertTriangle, CheckCircle2,
  ArrowUpRight, Warehouse, Construction, Banknote,
  ChevronDown, ChevronUp, Calendar, Zap,
  ShieldCheck, FileWarning, Scale, CircleDollarSign, Users, Landmark,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend, AreaChart, Area, Cell,
} from 'recharts';
import {
  financialData, realCashFlow2026, realRevenues2026,
  vatCredits2026,
} from '../data';
import { clientData, siteData } from '../data';
import { useApi } from '../ApiContext';
import { runReconciliation, type ReconciliationAlert, type AlertSeverity, type AlertCategory } from '../reconciliation';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

// ═══════════ FORMATTERS ═══════════

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

const formatCompact = (value: number) => {
  if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(1)}M €`;
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(0)}k €`;
  return `${value} €`;
};

// ═══════════ SUB-COMPONENTS ═══════════

/** SVG ring indicator for occupancy */
function OccupancyRing({ percent, size = 76, strokeWidth = 5 }: { percent: number; size?: number; strokeWidth?: number }) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#34d399" strokeWidth={strokeWidth}
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[15px] font-extrabold text-slate-900 tabular-nums">{percent}%</span>
      </div>
    </div>
  );
}

/** Mini sparkline for KPI cards on dark background */
function Sparkline({ data, color = '#3b82f6', height = 42 }: { data: { v: number }[]; color?: string; height?: number }) {
  if (!data.length) return null;
  const id = `spark-${color.replace('#', '')}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.12} />
            <stop offset="100%" stopColor={color} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#${id})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Custom dark tooltip — shared across all charts */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip bg-slate-900/95 backdrop-blur-xl text-white px-4 py-3 rounded-xl shadow-2xl border border-white/10 text-[13px]">
      <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-3 py-0.5">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color || p.fill || '#94a3b8' }} />
          <span className="text-slate-300">{p.name}</span>
          <span className="font-bold ml-auto tabular-nums">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

/** Auto-rotating single-card carousel for reconciliation alerts */
function ReconCarousel({ alerts, criticalCount, warningCount }: {
  alerts: ReconciliationAlert[];
  criticalCount: number;
  warningCount: number;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const count = alerts.length;

  const goTo = useCallback((idx: number) => {
    setActiveIdx(((idx % count) + count) % count);
  }, [count]);

  // Auto-advance every 5s unless paused
  useEffect(() => {
    if (paused || count <= 1) return;
    timerRef.current = setInterval(() => setActiveIdx(prev => (prev + 1) % count), 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, count]);

  const alert = alerts[activeIdx];
  if (!alert) return null;

  const severityConfig: Record<AlertSeverity, { bg: string; border: string; iconBg: string; iconColor: string; amountColor: string; progressColor: string }> = {
    critical: { bg: 'bg-red-50/50', border: 'border-red-200/60', iconBg: 'bg-red-100', iconColor: 'text-red-600', amountColor: 'text-red-700', progressColor: 'bg-red-400' },
    warning:  { bg: 'bg-amber-50/40', border: 'border-amber-200/60', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', amountColor: 'text-amber-700', progressColor: 'bg-amber-400' },
    info:     { bg: 'bg-blue-50/40', border: 'border-blue-200/60', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', amountColor: 'text-blue-700', progressColor: 'bg-blue-400' },
  };
  const categoryIcons: Record<AlertCategory, React.ReactNode> = {
    treasury: <Landmark className="h-4 w-4" />,
    revenue: <CircleDollarSign className="h-4 w-4" />,
    expense: <FileWarning className="h-4 w-4" />,
    occupancy: <Building2 className="h-4 w-4" />,
    debt: <Banknote className="h-4 w-4" />,
    contract: <Users className="h-4 w-4" />,
    invoice: <AlertTriangle className="h-4 w-4" />,
    vat: <Euro className="h-4 w-4" />,
  };

  const cfg = severityConfig[alert.severity];

  return (
    <div
      className={`relative ${cfg.bg} border ${cfg.border} rounded-xl shadow-sm overflow-hidden transition-colors duration-300`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-2.5">
          <Scale className="h-4 w-4 text-slate-500" />
          <span className="text-[13px] font-semibold text-slate-700">Rapprochement & Anomalies</span>
          {criticalCount > 0 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 tabular-nums leading-none">
              {criticalCount}
            </span>
          )}
          {warningCount > 0 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 tabular-nums leading-none">
              {warningCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 tabular-nums mr-1">{activeIdx + 1}/{count}</span>
          {count > 1 && (
            <>
              <button onClick={() => goTo(activeIdx - 1)} className="p-1 rounded-md hover:bg-white/60 text-slate-400 hover:text-slate-600 transition-colors">
                <ChevronUp className="h-3.5 w-3.5 -rotate-90" />
              </button>
              <button onClick={() => goTo(activeIdx + 1)} className="p-1 rounded-md hover:bg-white/60 text-slate-400 hover:text-slate-600 transition-colors">
                <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Alert card — single visible item */}
      <div className="px-5 pb-4 flex items-start gap-3.5">
        <div className={`h-9 w-9 rounded-lg ${cfg.iconBg} ${cfg.iconColor} flex items-center justify-center shrink-0 mt-0.5`}>
          {categoryIcons[alert.category]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[14px] font-semibold text-slate-900 leading-snug">{alert.title}</p>
            {alert.site && (
              <span className="text-[10px] bg-slate-200/60 text-slate-500 px-1.5 py-0.5 rounded font-medium">{alert.site}</span>
            )}
          </div>
          <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2">{alert.description}</p>
          {alert.action && (
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
              <span className="text-slate-500 font-bold">→</span> {alert.action}
            </p>
          )}
        </div>
        {alert.amount != null && (
          <div className="text-right shrink-0 pt-0.5">
            <p className={`text-[17px] font-bold tabular-nums leading-tight ${cfg.amountColor}`}>
              {formatCurrency(alert.amount)}
            </p>
          </div>
        )}
      </div>

      {/* Progress dots */}
      {count > 1 && (
        <div className="flex justify-center gap-1 pb-3">
          {alerts.map((a, i) => {
            const dotCfg = severityConfig[a.severity];
            return (
              <button
                key={a.id}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIdx ? `w-5 ${dotCfg.progressColor}` : 'w-1.5 bg-slate-300/60 hover:bg-slate-400/60'
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════ SITE DATA (from Excel data) ═══════════
const siteColors: Record<string, { color: string; colorLight: string }> = {
  montigny: { color: '#0014ff', colorLight: '#eef0ff' },
  boissy: { color: '#10b981', colorLight: '#ecfdf5' },
  moussy: { color: '#f59e0b', colorLight: '#fffbeb' },
  trappes: { color: '#8b5cf6', colorLight: '#f5f3ff' },
};
const siteKeyMap: Record<string, string> = {
  montigny: 'montigny',
  boissy: 'boissy',
  moussy: 'boissyExt',
  trappes: 'batiment4',
};
const siteShortNames: Record<string, string> = {
  montigny: 'Montigny',
  boissy: 'Boissy',
  moussy: 'Moussy',
  trappes: 'Trappes',
};

const sites = (['montigny', 'boissy', 'moussy', 'trappes'] as const).map(siteKey => {
  const info = siteData[siteKey].info;
  const clients = clientData[siteKey];
  const cells = clients.map((c, i) => ({
    id: `${siteKey}-${i}`,
    name: c.cell,
    price: c.loyer,
    occupied: c.status === 'actif',
    client: c.client || null,
  }));
  const isUnderConstruction = siteKey === 'trappes';
  return {
    id: siteKey,
    key: siteKeyMap[siteKey] as 'montigny' | 'boissy' | 'boissyExt' | 'batiment4',
    name: info.lieu,
    shortName: siteShortNames[siteKey],
    color: siteColors[siteKey].color,
    colorLight: siteColors[siteKey].colorLight,
    totalCells: info.cellules,
    cells,
    ...(isUnderConstruction ? { underConstruction: true } : {}),
  };
});

// ═══════════ MAIN COMPONENT ═══════════

export default function Overview() {
  const [expandedSite, setExpandedSite] = useState<string | null>(null);
  const api = useApi();

  // ── Global metrics ──
  const activeSites = sites.filter(s => !('underConstruction' in s && s.underConstruction));
  const constructionSites = sites.filter(s => 'underConstruction' in s && s.underConstruction);

  const totalActiveCells = activeSites.reduce((sum, s) => sum + s.totalCells, 0);
  const totalOccupied = activeSites.reduce((sum, s) => sum + s.cells.filter(c => c.occupied).length, 0);
  const totalFree = totalActiveCells - totalOccupied;
  const occupancyPercent = Math.round((totalOccupied / totalActiveCells) * 100);

  const totalMonthlyRevenue = activeSites.reduce((sum, s) =>
    sum + s.cells.filter(c => c.occupied).reduce((cs, c) => cs + c.price, 0), 0);
  const totalAnnualRevenue = financialData.consolidated.yearlyData.find(d => d.year === 2026)!;

  const avgCellPrice = totalMonthlyRevenue / totalOccupied;
  const potentialMonthlyRevenue = totalFree * avgCellPrice;

  // Cash position — use live Qonto balance when available, fallback to computed
  const cashFlows = realCashFlow2026.consolidated.filter(c => c.reel !== null);
  let runningBalance = 23309;
  cashFlows.forEach(c => { runningBalance += c.reel || 0; });
  const latestVat = Object.values(vatCredits2026).reduce((sum, v) => sum + v, 0);
  const liveQontoBalance = api.qontoBalance;
  const bankBalance = liveQontoBalance != null ? liveQontoBalance : runningBalance;
  const stripePending = api.stripeBalance?.pending || 0;
  const totalTreasury = bankBalance + latestVat + stripePending;

  // YoY
  const rev2025 = financialData.consolidated.yearlyData.find(d => d.year === 2025)!;
  const revenueGrowth = ((totalAnnualRevenue.revenue - rev2025.revenue) / rev2025.revenue * 100);

  // Late payments from Pennylane
  const overdueInvoices = api.pennylaneInvoices.filter(inv => !inv.paid && (inv.status === 'late' || inv.status === 'overdue'));
  const latePayments = overdueInvoices.length;
  const lateAmount = overdueInvoices.reduce((s, inv) => s + inv.remaining_amount, 0);

  // ── Chart data ──
  const revenueBySite = activeSites.map(s => ({
    name: s.shortName,
    revenue: s.cells.filter(c => c.occupied).reduce((sum, c) => sum + c.price, 0),
    color: s.color,
  }));

  let cumBalance = 23309;
  const treasuryEvolution = realCashFlow2026.consolidated.filter(c => c.reel !== null).map(c => {
    cumBalance += c.reel || 0;
    const vat = vatCredits2026[c.month] || 0;
    return { month: c.month, bank: cumBalance, total: cumBalance + vat };
  });

  const monthlyComparison = realRevenues2026.consolidated.map(rev => ({
    month: rev.month,
    'Prévu': rev.bp,
    'Réel': rev.reel,
  }));

  // ── Sparkline data ──
  const revenueSparkData = realRevenues2026.consolidated
    .filter(r => r.reel != null)
    .map(r => ({ v: r.reel as number }));
  const treasurySparkData = treasuryEvolution.map(t => ({ v: t.total }));

  // ── Reconciliation alerts ──
  const reconAlerts = runReconciliation(api);
  const criticalCount = reconAlerts.filter(a => a.severity === 'critical').length;
  const warningCount = reconAlerts.filter(a => a.severity === 'warning').length;

  // ═══════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-6 stagger-in">

        {/* ─────────── HERO SECTION ─────────── */}
        {/* Dashboard header */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em]">Temps réel</span>
            </div>
            <h1 className="text-[26px] font-bold text-slate-900 tracking-[-0.025em]">Vue d'ensemble</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white border border-slate-200/70 rounded-full px-3 py-1.5 text-[11px] text-slate-500 font-medium shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <Calendar className="h-3 w-3 text-slate-400" />Avril 2026
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-slate-200/70 rounded-full px-3 py-1.5 text-[11px] text-slate-500 font-medium shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <Building2 className="h-3 w-3 text-slate-400" />{activeSites.length + constructionSites.length} sites
            </div>
          </div>
        </div>

        {/* ──── Premium Metric Cards ──── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue */}
          <div className="metric-card group">
            <div className="h-[2px] bg-gradient-to-r from-blue-500 to-blue-400" />
            <div className="p-5">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="h-8 w-8 rounded-[10px] bg-blue-50 flex items-center justify-center">
                  <Euro className="h-4 w-4 text-blue-500" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.06em]">Revenu mensuel</span>
              </div>
              <p className="text-[28px] font-extrabold text-slate-900 tracking-[-0.02em] tabular-nums leading-none mb-2.5">
                {formatCurrency(totalMonthlyRevenue)}
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-600 rounded-full px-2 py-[3px] text-[11px] font-bold tabular-nums">
                  <ArrowUpRight className="h-3 w-3" />+{revenueGrowth.toFixed(1)}%
                </span>
                <span className="text-[11px] text-slate-300 font-medium">vs 2025</span>
              </div>
              <div className="h-[42px] opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkline data={revenueSparkData} color="#3b82f6" />
              </div>
            </div>
          </div>

          {/* Occupation */}
          <div className="metric-card">
            <div className="h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400" />
            <div className="p-5">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="h-8 w-8 rounded-[10px] bg-emerald-50 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-emerald-500" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.06em]">Occupation</span>
              </div>
              <div className="flex items-center gap-5">
                <OccupancyRing percent={occupancyPercent} size={76} />
                <div>
                  <p className="text-[22px] font-extrabold text-slate-900 tabular-nums leading-none">
                    {totalOccupied}<span className="text-slate-300 font-semibold text-[14px]">/{totalActiveCells}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1.5">cellules occupées</p>
                  <p className="text-[11px] text-emerald-500 mt-1.5 font-semibold">
                    {totalFree === 0 ? '● Complet' : `${totalFree} disponible${totalFree > 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Potentiel */}
          <div className="metric-card">
            <div className="h-[2px] bg-gradient-to-r from-amber-500 to-orange-400" />
            <div className="p-5">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="h-8 w-8 rounded-[10px] bg-amber-50 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-amber-500" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.06em]">Potentiel</span>
              </div>
              <p className="text-[28px] font-extrabold text-slate-900 tracking-[-0.02em] tabular-nums leading-none mb-1.5">
                {totalFree}
              </p>
              <p className="text-[11px] text-slate-400 mb-4">cellules disponibles</p>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50/80 border border-amber-200/40 rounded-xl px-3.5 py-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] text-amber-700 font-bold tabular-nums">{formatCompact(potentialMonthlyRevenue)}<span className="text-amber-500/70 font-semibold">/mois</span></p>
                    <p className="text-[10px] text-amber-500/60 mt-0.5">revenu potentiel</p>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-amber-100/60 flex items-center justify-center">
                    <ArrowUpRight className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trésorerie */}
          <div className="metric-card group">
            <div className="h-[2px] bg-gradient-to-r from-violet-500 to-purple-400" />
            <div className="p-5">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="h-8 w-8 rounded-[10px] bg-violet-50 flex items-center justify-center">
                  <Banknote className="h-4 w-4 text-violet-500" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.06em]">Trésorerie</span>
              </div>
              <p className="text-[28px] font-extrabold text-slate-900 tracking-[-0.02em] tabular-nums leading-none mb-2">
                {formatCurrency(totalTreasury)}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-3 flex-wrap">
                <span className="tabular-nums">Qonto {formatCompact(bankBalance)}</span>
                <span className="text-slate-200">·</span>
                {stripePending > 0 && <><span className="tabular-nums text-indigo-500/70">Stripe {formatCompact(stripePending)}</span><span className="text-slate-200">·</span></>}
                <span className="tabular-nums">TVA {formatCompact(latestVat)}</span>
              </div>
              <div className="h-[42px] opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkline data={treasurySparkData} color="#8b5cf6" />
              </div>
            </div>
          </div>
        </div>

        {/* ─────────── ALERT ─────────── */}
        {latePayments > 0 && (
          <div className="flex items-center gap-4 bg-gradient-to-r from-red-50 to-red-50/50 border border-red-200/60 rounded-xl px-6 py-4 shadow-sm" role="alert">
            <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-red-900">{latePayments} impayé en retard</p>
              <p className="text-[13px] text-red-500/80 mt-0.5">{formatCurrency(lateAmount)} — Action requise</p>
            </div>
            <Button size="default" className="bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg shadow-sm shadow-red-600/20 shrink-0">
              Relancer
            </Button>
          </div>
        )}

        {/* ─────────── RECONCILIATION CAROUSEL ─────────── */}
        {reconAlerts.length > 0 && <ReconCarousel alerts={reconAlerts} criticalCount={criticalCount} warningCount={warningCount} />}

        {reconAlerts.length === 0 && !api.loading && (
          <div className="flex items-center gap-3 bg-emerald-50/60 border border-emerald-200/60 rounded-xl px-5 py-3.5 shadow-sm">
            <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-emerald-900">Aucune anomalie détectée</p>
              <p className="text-[12px] text-emerald-600/70 mt-0.5">Données Excel, bancaires et comptables cohérentes</p>
            </div>
          </div>
        )}

        {/* ─────────── SITES (unified list) ─────────── */}
        <Card className="overflow-hidden border-slate-200/60 shadow-sm">
          <div className="px-6 pt-6 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Patrimoine immobilier</h2>
              <p className="text-[13px] text-slate-400 mt-1">{sites.length} sites · {totalActiveCells + constructionSites.reduce((s, site) => s + site.totalCells, 0)} cellules au total</p>
            </div>
            <div className="flex items-center gap-4 text-[12px] text-slate-400 font-medium">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500/80" />Occupée</span>
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />Libre</span>
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-slate-200" />Travaux</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100/80">
            {sites.map(site => {
              const isConstruction = 'underConstruction' in site && site.underConstruction;
              const occupied = site.cells.filter(c => c.occupied).length;
              const monthlyRev = site.cells.filter(c => c.occupied).reduce((s, c) => s + c.price, 0);
              const occRate = isConstruction ? 0 : Math.round((occupied / site.totalCells) * 100);
              const data2026 = financialData[site.key]?.yearlyData.find(d => d.year === 2026);
              const isExpanded = expandedSite === site.id;

              return (
                <div key={site.id} className="group/row">
                  {/* Site row */}
                  <button
                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors text-left"
                    onClick={() => setExpandedSite(isExpanded ? null : site.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`detail-${site.id}`}
                  >
                    {/* Icon */}
                    <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-shadow group-hover/row:shadow-md" style={{ backgroundColor: site.colorLight }}>
                      {isConstruction
                        ? <Construction className="h-5 w-5" style={{ color: site.color }} />
                        : <Warehouse className="h-5 w-5" style={{ color: site.color }} />}
                    </div>
                    {/* Name */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[14px] font-semibold text-slate-900 truncate">{site.name}</span>
                        {isConstruction && <Badge variant="warning" className="text-[10px]">Travaux</Badge>}
                        {!isConstruction && occRate === 100 && <Badge variant="success" className="text-[10px]">Complet</Badge>}
                      </div>
                      <p className="text-[12px] text-slate-400 mt-0.5">
                        {isConstruction ? `${site.totalCells} cellules prévues` : `${occupied}/${site.totalCells} occupées`}
                      </p>
                    </div>
                    {/* Occupancy bar — desktop only */}
                    {!isConstruction && (
                      <div className="hidden sm:flex items-center gap-3 w-40">
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${occRate}%`, backgroundColor: site.color }} />
                        </div>
                        <span className="text-[13px] font-bold tabular-nums w-10 text-right" style={{ color: site.color }}>{occRate}%</span>
                      </div>
                    )}
                    {/* Revenue — desktop only */}
                    <div className="text-right hidden md:block w-32">
                      <p className="text-[14px] font-semibold text-slate-900 tabular-nums">{isConstruction ? '—' : formatCurrency(monthlyRev)}</p>
                      {!isConstruction && <p className="text-[11px] text-slate-400 mt-0.5">/mois</p>}
                    </div>
                    {/* Expand chevron */}
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 ${isExpanded ? 'bg-slate-100 text-slate-600' : 'text-slate-300 group-hover/row:text-slate-500'}`}>
                      <ChevronDown className={`h-4.5 w-4.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {/* Expanded panel */}
                  {isExpanded && (
                    <div id={`detail-${site.id}`} className="bg-slate-50/70 border-t border-slate-100 px-6 py-5 space-y-4 animate-expand">
                      {/* Cell grid */}
                      <div className="flex flex-wrap gap-1.5" role="list" aria-label={`Cellules ${site.shortName}`}>
                        {site.cells.map(cell => (
                          <Tooltip key={cell.id}>
                            <TooltipTrigger asChild>
                              <div
                                role="listitem"
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold cursor-default transition-all duration-150 hover:scale-110 ${
                                  isConstruction
                                    ? 'bg-white text-slate-300 border border-slate-200'
                                    : cell.occupied
                                      ? 'bg-blue-500/10 text-blue-600 border border-blue-200/60 hover:bg-blue-500/20'
                                      : 'bg-emerald-500/10 text-emerald-600 border border-emerald-200/60 hover:bg-emerald-500/20 cell-available'
                                }`}
                              >
                                {cell.name.match(/\d+/)?.[0] || cell.name.charAt(0)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-[13px]">
                              <p className="font-semibold">{cell.name}</p>
                              {cell.occupied && cell.client && <p className="text-slate-400 mt-0.5">{cell.client}</p>}
                              {cell.occupied && cell.price > 0 && <p className="text-blue-600 font-semibold mt-0.5">{formatCurrency(cell.price)}/mois</p>}
                              {!cell.occupied && !isConstruction && <p className="text-emerald-600 font-semibold mt-0.5">Disponible</p>}
                              {isConstruction && <p className="text-amber-600 mt-0.5">En construction</p>}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>

                      {/* Detail list */}
                      {!isConstruction && (
                        <div className="bg-white rounded-xl border border-slate-200/60 divide-y divide-slate-100/80 overflow-hidden shadow-sm">
                          {site.cells.filter(c => c.occupied).map(cell => (
                            <div key={cell.id} className="flex items-center justify-between text-[13px] px-4 py-3 hover:bg-slate-50/50 transition-colors">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: site.color }} />
                                <span className="font-medium text-slate-700">{cell.name}</span>
                                <span className="text-slate-200">·</span>
                                <span className="text-slate-500 truncate">{cell.client}</span>
                              </div>
                              <span className="font-semibold text-slate-900 tabular-nums shrink-0 ml-4">{formatCurrency(cell.price)}</span>
                            </div>
                          ))}
                          {site.cells.filter(c => !c.occupied).map(cell => (
                            <div key={cell.id} className="flex items-center justify-between text-[13px] px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span className="font-medium text-emerald-600">{cell.name}</span>
                              </div>
                              <Badge variant="success" className="text-[11px]">Libre</Badge>
                            </div>
                          ))}
                          <div className="bg-slate-50/80 px-4 py-3 flex items-center justify-between">
                            <span className="text-[13px] font-semibold text-slate-600">Total mensuel</span>
                            <span className="text-[14px] font-bold tabular-nums" style={{ color: site.color }}>{formatCurrency(monthlyRev)}</span>
                          </div>
                        </div>
                      )}
                      {isConstruction && data2026 && (
                        <div className="bg-white rounded-xl border border-slate-200/60 px-4 py-3 shadow-sm">
                          <p className="text-[13px] text-slate-500">14 cellules + 10 box prévus</p>
                          <div className="flex justify-between text-[13px] mt-1.5">
                            <span className="text-slate-400">Prév. CA 2026</span>
                            <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(data2026.revenue)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* ─────────── CHARTS ─────────── */}
        <div className="grid gap-5 lg:grid-cols-2">

          {/* Revenue by Site */}
          <Card className="border-slate-200/60 shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Revenus par site</h3>
                  <p className="text-[13px] text-slate-400 mt-1">Loyers mensuels HT</p>
                </div>
                <div className="bg-slate-900 rounded-lg px-3.5 py-2">
                  <p className="text-[15px] font-bold text-white tabular-nums">{formatCurrency(totalMonthlyRevenue)}</p>
                </div>
              </div>
              <div className="h-[230px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueBySite} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={45} />
                    <RechartsTooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} />
                    <Bar dataKey="revenue" name="Revenus" radius={[8, 8, 2, 2]} maxBarSize={52} animationDuration={800}>
                      {revenueBySite.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Treasury Evolution */}
          <Card className="border-slate-200/60 shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Trésorerie</h3>
                  <p className="text-[13px] text-slate-400 mt-1">Évolution S1 2026</p>
                </div>
                <div className="bg-slate-900 rounded-lg px-3.5 py-2">
                  <p className="text-[15px] font-bold text-white tabular-nums">{formatCurrency(totalTreasury)}</p>
                </div>
              </div>
              <div className="h-[230px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={treasuryEvolution} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradBank" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity={0.18} />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={45} />
                    <RechartsTooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="bank" name="Banque" stroke="#94a3b8" strokeWidth={2} fill="url(#gradBank)" dot={false} activeDot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />
                    <Area type="monotone" dataKey="total" name="Tréso + TVA" stroke="#2563eb" strokeWidth={2.5} fill="url(#gradTotal)" dot={false} activeDot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <span className="flex items-center gap-2.5 text-[12px] text-slate-400 font-medium">
                  <span className="w-4 h-[3px] rounded-full bg-slate-400" />Banque
                </span>
                <span className="flex items-center gap-2.5 text-[12px] text-slate-400 font-medium">
                  <span className="w-4 h-[3px] rounded-full bg-blue-600" />Total (+ TVA)
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─────────── BP vs RÉEL ─────────── */}
        <Card className="border-slate-200/60 shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Prévisionnel vs Réel</h3>
                <p className="text-[13px] text-slate-400 mt-1">Chiffre d'affaires consolidé — S1 2026</p>
              </div>
              <Badge variant="blue" className="gap-1.5 text-[12px] self-start sm:self-auto">
                <TrendingUp className="h-3.5 w-3.5" />+{revenueGrowth.toFixed(1)}% YoY
              </Badge>
            </div>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyComparison} margin={{ top: 5, right: 5, left: -10, bottom: 0 }} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={45} />
                  <RechartsTooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: '#94a3b8', paddingTop: '14px' }} />
                  <Bar dataKey="Prévu" fill="#e2e8f0" radius={[6, 6, 2, 2]} maxBarSize={36} />
                  <Bar dataKey="Réel" fill="#2563eb" radius={[6, 6, 2, 2]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* ─────────── FINANCIAL TABLE ─────────── */}
        <Card className="border-slate-200/60 shadow-sm overflow-hidden">
          <div className="px-6 pt-6 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Synthèse financière 2026</h3>
              <p className="text-[13px] text-slate-400 mt-1">Par site — occupation, revenus et résultats</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-y border-slate-100 bg-slate-50/60">
                  <th className="text-left font-medium text-slate-400 px-6 py-3 text-[12px] uppercase tracking-wider">Site</th>
                  <th className="text-right font-medium text-slate-400 px-4 py-3 text-[12px] uppercase tracking-wider">Cellules</th>
                  <th className="text-right font-medium text-slate-400 px-4 py-3 text-[12px] uppercase tracking-wider">Occup.</th>
                  <th className="text-right font-medium text-slate-400 px-4 py-3 text-[12px] uppercase tracking-wider">Loyer/mois</th>
                  <th className="text-right font-medium text-slate-400 px-4 py-3 text-[12px] uppercase tracking-wider hidden lg:table-cell">CA annuel</th>
                  <th className="text-right font-medium text-slate-400 px-4 py-3 text-[12px] uppercase tracking-wider hidden lg:table-cell">Charges</th>
                  <th className="text-right font-medium text-slate-400 px-4 py-3 text-[12px] uppercase tracking-wider">Résultat</th>
                  <th className="text-center font-medium text-slate-400 px-4 py-3 text-[12px] uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sites.map(site => {
                  const isConstruction = 'underConstruction' in site && site.underConstruction;
                  const data = financialData[site.key]?.yearlyData.find(d => d.year === 2026);
                  const occupied = site.cells.filter(c => c.occupied).length;
                  const monthlyRev = site.cells.filter(c => c.occupied).reduce((s, c) => s + c.price, 0);
                  const occRate = isConstruction ? 0 : Math.round((occupied / site.totalCells) * 100);
                  const isProfit = (data?.profit || 0) >= 0;

                  return (
                    <tr key={site.id} className="group/tr hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="w-3 h-3 rounded-md shrink-0 shadow-sm" style={{ backgroundColor: site.color }} />
                          <span className="font-semibold text-slate-900 text-[14px]">{site.shortName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right text-[14px] tabular-nums">
                        <span className="font-semibold text-slate-900">{occupied}</span>
                        <span className="text-slate-300 font-normal">/{site.totalCells}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {isConstruction ? (
                          <Badge variant="warning" className="text-[11px]">Travaux</Badge>
                        ) : (
                          <div className="flex items-center justify-end gap-3">
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${occRate}%`, backgroundColor: site.color }} />
                            </div>
                            <span className="font-semibold text-slate-900 text-[14px] tabular-nums w-10 text-right">{occRate}%</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right text-[14px] font-medium text-slate-900 tabular-nums">
                        {isConstruction ? '—' : formatCurrency(monthlyRev)}
                      </td>
                      <td className="px-4 py-3.5 text-right text-[14px] font-medium text-slate-700 tabular-nums hidden lg:table-cell">
                        {formatCurrency(data?.revenue || 0)}
                      </td>
                      <td className="px-4 py-3.5 text-right text-[14px] text-slate-400 tabular-nums hidden lg:table-cell">
                        {formatCurrency(data?.expenses || 0)}
                      </td>
                      <td className={`px-4 py-3.5 text-right text-[14px] font-bold tabular-nums ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatCurrency(data?.profit || 0)}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {isConstruction ? (
                          <Badge variant="warning" className="text-[11px]">Travaux</Badge>
                        ) : isProfit ? (
                          <Badge variant="success" className="gap-1.5 text-[11px]"><CheckCircle2 className="h-3.5 w-3.5" />Rentable</Badge>
                        ) : (
                          <Badge variant="danger" className="gap-1.5 text-[11px]"><AlertTriangle className="h-3.5 w-3.5" />Déficit</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50/80 border-t border-slate-200">
                  <td className="px-6 py-3.5 font-bold text-[14px] text-slate-900">Consolidé</td>
                  <td className="px-4 py-3.5 text-right text-[14px] font-bold text-slate-900 tabular-nums">
                    {totalOccupied}<span className="text-slate-300 font-normal">/{totalActiveCells + constructionSites.reduce((s, site) => s + site.totalCells, 0)}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-[14px] font-bold tabular-nums" style={{ color: '#2563eb' }}>{occupancyPercent}%</td>
                  <td className="px-4 py-3.5 text-right text-[14px] font-bold text-slate-900 tabular-nums">{formatCurrency(totalMonthlyRevenue)}</td>
                  <td className="px-4 py-3.5 text-right text-[14px] font-bold text-slate-900 tabular-nums hidden lg:table-cell">{formatCurrency(totalAnnualRevenue.revenue)}</td>
                  <td className="px-4 py-3.5 text-right text-[14px] text-slate-400 tabular-nums hidden lg:table-cell">{formatCurrency(totalAnnualRevenue.expenses)}</td>
                  <td className={`px-4 py-3.5 text-right text-[14px] font-bold tabular-nums ${totalAnnualRevenue.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatCurrency(totalAnnualRevenue.profit)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

      </div>
    </TooltipProvider>
  );
}
