import React, { useState, useMemo, useEffect } from 'react';
import {
  ComposedChart, Area, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  Euro, TrendingUp, TrendingDown, Landmark, Banknote, ShieldCheck,
  ArrowUpRight, ArrowDownRight, CreditCard, AlertTriangle, Check,
  PenLine, RotateCcw, Clock, Info, ChevronDown, ChevronRight,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { useApi } from '../ApiContext';
import {
  cashFlowData2026, cashFlowData2025, leasingContracts, leasingBySite,
  totalMonthlyLeasing, expectedInflows, vatCredits2026,
  type CashFlowMonth, type LeasingContract, type ExpectedInflow,
} from '../data';

// ═══════════ FORMATTERS ═══════════

const fmt = (v: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

const fmtK = (v: number) => {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `${Math.round(v / 1_000)}k`;
  return `${v}`;
};

const SITE_COLORS: Record<string, string> = {
  montigny: '#3b82f6',
  boissy: '#10b981',
  moussy: '#f59e0b',
  trappes: '#8b5cf6',
};

// ═══════════ CHART TOOLTIP ═══════════

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 backdrop-blur-xl text-white px-4 py-3 rounded-xl shadow-2xl border border-white/10 text-[13px] max-w-xs">
      <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-3 py-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color || p.fill }} />
          <span className="text-slate-300 truncate">{p.name}</span>
          <span className="font-bold ml-auto tabular-nums">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ═══════════ MANUAL INPUT MODAL ═══════════

function ManualInputRow({
  label,
  monthKey,
  value,
  onSave,
  icon,
  color,
}: {
  label: string;
  monthKey: string;
  value: number | null;
  onSave: (monthKey: string, amount: number) => void;
  icon: React.ReactNode;
  color: string;
}) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(value !== null ? String(value) : '');

  const handleSave = () => {
    const num = Number(input.replace(/\s/g, ''));
    if (!isNaN(num)) {
      onSave(monthKey, num);
      setEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-slate-50/80 border border-slate-200/50">
      <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-slate-700">{label}</p>
        <p className="text-[10px] text-slate-400">{monthKey}</p>
      </div>
      {editing ? (
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            className="w-28 px-2 py-1.5 text-[12px] font-mono text-right text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            autoFocus
          />
          <button onClick={handleSave} className="p-1 rounded-md bg-emerald-100 text-emerald-600 hover:bg-emerald-200">
            <Check className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-slate-900 tabular-nums">
            {value !== null ? fmt(value) : <span className="text-slate-300">—</span>}
          </span>
          <button onClick={() => { setInput(value !== null ? String(value) : ''); setEditing(true); }} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <PenLine className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════ MAIN COMPONENT ═══════════

export default function ForecastCash() {
  const { qontoBalance, loading: apiLoading, lastSync } = useApi();
  const [viewYear, setViewYear] = useState<2025 | 2026>(2026);
  const [showSiteBreakdown, setShowSiteBreakdown] = useState(false);
  const [showDecaissements, setShowDecaissements] = useState(false);
  const [vatOverrides, setVatOverrides] = useState<Record<string, number>>({
    'Mar-2026': 72182,  // Pre-filled per Didier's instruction
  });
  const [bankOverrides, setBankOverrides] = useState<Record<string, number>>({});
  const [inflows, setInflows] = useState<ExpectedInflow[]>(expectedInflows);
  const [toast, setToast] = useState<string | null>(null);

  // Auto-populate current-month bank balance from live Qonto data
  useEffect(() => {
    if (qontoBalance !== null && qontoBalance !== undefined) {
      const now = new Date();
      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      const key = `${monthNames[now.getMonth()]}-${now.getFullYear()}`;
      setBankOverrides(prev => ({ ...prev, [key]: qontoBalance }));
    }
  }, [qontoBalance]);

  const rawData = viewYear === 2026 ? cashFlowData2026 : cashFlowData2025;

  // ── Merge overrides & expected inflows into data ──
  const data = useMemo(() => {
    return rawData.map(m => {
      const key = `${m.month}-${m.year}`;
      // VAT credit override
      const creditTVA = vatOverrides[key] ?? m.creditTVA;
      // Bank balance override
      const soldeBancaireReel = bankOverrides[key] ?? m.soldeBancaireReel;
      // Expected inflows for this month
      const monthInflows = inflows.filter(
        f => f.expectedMonth === m.month && f.expectedYear === m.year && f.status === 'pending'
      );
      const inflowTotal = monthInflows.reduce((sum, f) => sum + f.amount, 0);
      // Adjusted net cash = BP net + expected inflows
      const tresorerieNetAdjusted = m.tresorerieNet + inflowTotal;
      const tresoBPapresTVAAdjusted = m.tresoBPapresTVA + inflowTotal;
      // Position consolidée
      const positionConsolidee = (soldeBancaireReel !== null && creditTVA !== null)
        ? soldeBancaireReel + creditTVA
        : m.positionConsolidee;
      const ecartReelVsBP = soldeBancaireReel !== null
        ? soldeBancaireReel - m.tresoBPapresTVA
        : m.ecartReelVsBP;
      const ecartConsoVsBP = positionConsolidee !== null
        ? positionConsolidee - m.tresoBPapresTVA
        : m.ecartConsoVsBP;

      return {
        ...m,
        creditTVA,
        soldeBancaireReel,
        positionConsolidee,
        ecartReelVsBP,
        ecartConsoVsBP,
        inflowTotal,
        tresorerieNetAdjusted,
        tresoBPapresTVAAdjusted,
      };
    });
  }, [rawData, vatOverrides, bankOverrides, inflows]);

  // ── KPI Computations ──
  const latestReal = [...data].reverse().find(m => m.soldeBancaireReel !== null);
  const latestMonth = data[data.length - 1];
  const currentMonth = data.find(m => m.monthIndex === 3); // April (current)
  const totalLeasing = totalMonthlyLeasing;

  // ── Chart data ──
  const chartData = data.map(m => ({
    name: m.month,
    tresoNetBP: m.tresoBPapresTVA,
    tresoAdjusted: m.tresoBPapresTVAAdjusted !== m.tresoBPapresTVA ? m.tresoBPapresTVAAdjusted : undefined,
    soldeBancaire: m.soldeBancaireReel,
    positionConso: m.positionConsolidee,
    inflowTotal: m.inflowTotal > 0 ? m.inflowTotal : undefined,
  }));

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleVatSave = (monthKey: string, amount: number) => {
    setVatOverrides(prev => ({ ...prev, [monthKey]: amount }));
    showToast(`Crédit TVA ${monthKey}: ${fmt(amount)}`);
  };

  const handleBankSave = (monthKey: string, amount: number) => {
    setBankOverrides(prev => ({ ...prev, [monthKey]: amount }));
    showToast(`Solde bancaire ${monthKey}: ${fmt(amount)}`);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-6 stagger-in">

        {/* Toast */}
        {toast && (
          <div className="fixed top-4 right-4 z-[60] flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-[13px] font-medium animate-page-in">
            <Check className="h-4 w-4 text-emerald-400" />
            {toast}
          </div>
        )}

        {/* ═══ Header ═══ */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[26px] font-bold text-slate-900 tracking-[-0.025em]">Prévisionnel & Trésorerie</h1>
            <p className="text-[13px] text-slate-400 mt-1">
              Cash flow consolidé · BP vs Réel · Position de trésorerie
              {lastSync && (
                <span className="ml-2 text-emerald-500">
                  · Synchro {lastSync.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              {apiLoading && <span className="ml-2 text-blue-400 animate-pulse">· Chargement…</span>}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-white border border-slate-200/70 rounded-full p-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            {([2025, 2026] as const).map(y => (
              <button
                key={y}
                onClick={() => setViewYear(y)}
                className={`px-3 py-1.5 text-[12px] font-semibold rounded-full transition-all duration-200 ${
                  viewYear === y ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* ═══ KPI Cards ═══ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Trésorerie nette BP */}
          <div className="metric-card">
            <div className="h-[2px] bg-gradient-to-r from-blue-500 to-blue-400" />
            <div className="p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-[10px] bg-blue-50 flex items-center justify-center">
                  <Landmark className="h-4 w-4 text-blue-500" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.06em]">Tréso nette BP</span>
              </div>
              <p className={`text-[24px] font-extrabold tracking-[-0.02em] tabular-nums leading-none ${latestMonth.tresorerieNet >= 0 ? 'text-slate-900' : 'text-red-500'}`}>
                {fmt(latestMonth.tresorerieNet)}
              </p>
              <p className="text-[11px] text-slate-300 mt-1.5 font-medium">{latestMonth.month} {viewYear} · avant TVA</p>
            </div>
          </div>

          {/* Solde bancaire réel */}
          <div className="metric-card">
            <div className="h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400" />
            <div className="p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-[10px] bg-emerald-50 flex items-center justify-center">
                  <Banknote className="h-4 w-4 text-emerald-500" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.06em]">Solde banque réel</span>
              </div>
              {latestReal ? (
                <>
                  <p className="text-[24px] font-extrabold text-emerald-600 tracking-[-0.02em] tabular-nums leading-none">{fmt(latestReal.soldeBancaireReel!)}</p>
                  <p className="text-[11px] text-slate-300 mt-1.5 font-medium">{latestReal.month} {viewYear} · ⭐ Qonto</p>
                </>
              ) : (
                <p className="text-[16px] text-slate-300 font-medium">Aucune saisie</p>
              )}
            </div>
          </div>

          {/* Position consolidée */}
          <div className="metric-card">
            <div className="h-[2px] bg-gradient-to-r from-violet-500 to-purple-400" />
            <div className="p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-[10px] bg-violet-50 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-violet-500" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.06em]">Position conso.</span>
              </div>
              {latestReal?.positionConsolidee ? (
                <>
                  <p className="text-[24px] font-extrabold text-violet-600 tracking-[-0.02em] tabular-nums leading-none">{fmt(latestReal.positionConsolidee)}</p>
                  <p className="text-[11px] text-slate-300 mt-1.5 font-medium">Banque + Crédit TVA</p>
                </>
              ) : (
                <p className="text-[16px] text-slate-300 font-medium">—</p>
              )}
            </div>
          </div>

          {/* Leasing mensuel */}
          <div className="metric-card">
            <div className="h-[2px] bg-gradient-to-r from-amber-500 to-orange-400" />
            <div className="p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-[10px] bg-amber-50 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-amber-500" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.06em]">Leasing mensuel</span>
              </div>
              <p className="text-[24px] font-extrabold text-slate-900 tracking-[-0.02em] tabular-nums leading-none">{fmt(totalLeasing)}</p>
              <p className="text-[11px] text-slate-300 mt-1.5 font-medium">{leasingContracts.length} contrats Grenke</p>
            </div>
          </div>
        </div>

        {/* ═══ Expected Inflows Banner ═══ */}
        {inflows.filter(f => f.status === 'pending').length > 0 && (
          <div className="bg-amber-50 border border-amber-200/60 rounded-xl px-5 py-3.5 flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-amber-900">Encaissements attendus</p>
              <div className="flex flex-wrap gap-3 mt-1">
                {inflows.filter(f => f.status === 'pending').map(f => (
                  <span key={f.id} className="text-[12px] text-amber-700">
                    <span className="font-bold">{fmt(f.amount)}</span> · {f.label} · prévu {f.expectedMonth} {f.expectedYear}
                  </span>
                ))}
              </div>
            </div>
            <Badge variant="warning" className="text-[10px] shrink-0">En attente</Badge>
          </div>
        )}

        {/* ═══ Cash Flow Chart ═══ */}
        <div className="metric-card">
          <div className="h-[2px] bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500" />
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-[15px] font-bold text-slate-900">Évolution Trésorerie {viewYear}</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">BP après TVA · Solde bancaire réel · Position consolidée</p>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500 rounded-full" /> BP après TVA</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Réel banque</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Position conso.</span>
                {inflows.some(f => f.status === 'pending') && (
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Inflows attendus</span>
                )}
              </div>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `${fmtK(v)} €`} tickLine={false} axisLine={false} width={70} />
                  <ReTooltip content={<ChartTip />} />
                  <ReferenceLine y={0} stroke="#e2e8f0" strokeDasharray="4 4" />
                  {/* Expected inflows as bars */}
                  <Bar dataKey="inflowTotal" name="Encaissements attendus" fill="#fbbf24" opacity={0.5} radius={[4, 4, 0, 0]} />
                  {/* BP after TVA line */}
                  <Area dataKey="tresoNetBP" name="BP après TVA" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.06} strokeWidth={2} dot={false} />
                  {/* Adjusted BP line (with inflows) */}
                  <Line dataKey="tresoAdjusted" name="BP + Inflows" stroke="#3b82f6" strokeWidth={2} strokeDasharray="6 3" dot={false} connectNulls={false} />
                  {/* Real bank balance dots */}
                  <Line dataKey="soldeBancaire" name="Solde banque réel" stroke="#10b981" strokeWidth={0} dot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} connectNulls={false} />
                  {/* Consolidated position dots */}
                  <Line dataKey="positionConso" name="Position consolidée" stroke="#8b5cf6" strokeWidth={0} dot={{ r: 5, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }} connectNulls={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ═══ Manual Inputs Section ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* VAT Credit Manual Entry */}
          <div className="metric-card">
            <div className="h-[2px] bg-gradient-to-r from-purple-500 to-violet-400" />
            <div className="p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-7 w-7 rounded-lg bg-violet-50 flex items-center justify-center">
                  <ShieldCheck className="h-3.5 w-3.5 text-violet-500" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-slate-900">🟣 Crédit de TVA</h3>
                  <p className="text-[11px] text-slate-400">Saisie manuelle par déclaration mensuelle</p>
                </div>
              </div>
              <div className="space-y-2">
                {data.filter(m => m.year === 2026).slice(0, 6).map(m => {
                  const key = `${m.month}-${m.year}`;
                  const val = vatOverrides[key] ?? m.creditTVA;
                  return (
                    <ManualInputRow
                      key={key}
                      label={`Crédit TVA — ${m.month} ${m.year}`}
                      monthKey={key}
                      value={val}
                      onSave={handleVatSave}
                      icon={<Euro className="h-3 w-3 text-violet-500" />}
                      color="bg-violet-50"
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bank Balance Manual Entry */}
          <div className="metric-card">
            <div className="h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400" />
            <div className="p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Banknote className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-slate-900">⭐ Solde Bancaire Réel</h3>
                  <p className="text-[11px] text-slate-400">Solde Qonto fin de mois</p>
                </div>
              </div>
              <div className="space-y-2">
                {data.filter(m => m.year === 2026).slice(0, 6).map(m => {
                  const key = `${m.month}-${m.year}`;
                  const val = bankOverrides[key] ?? m.soldeBancaireReel;
                  return (
                    <ManualInputRow
                      key={key}
                      label={`Solde banque — ${m.month} ${m.year}`}
                      monthKey={key}
                      value={val}
                      onSave={handleBankSave}
                      icon={<Landmark className="h-3 w-3 text-emerald-500" />}
                      color="bg-emerald-50"
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Cash Flow Data Table ═══ */}
        <div className="metric-card overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-slate-400 to-slate-300" />
          <div className="p-5 pb-0">
            <h2 className="text-[15px] font-bold text-slate-900 mb-1">Tableau de Trésorerie Détaillé</h2>
            <p className="text-[11px] text-slate-400 mb-4">Données {viewYear} · toutes valeurs en euros</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-slate-50/80 border-y border-slate-200/60">
                  <th className="py-2.5 px-4 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px] sticky left-0 bg-slate-50/80 z-10 min-w-[200px]">Ligne</th>
                  {data.map(m => (
                    <th key={m.month} className="py-2.5 px-3 text-right font-semibold text-slate-500 uppercase tracking-wider text-[10px] min-w-[90px]">{m.month}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60">
                {/* ── Site breakdown (collapsible) ── */}
                <tr
                  className="cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => setShowSiteBreakdown(!showSiteBreakdown)}
                >
                  <td className="py-2 px-4 font-semibold text-slate-700 sticky left-0 bg-white z-10 flex items-center gap-1.5">
                    {showSiteBreakdown ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    Trésorerie par site
                  </td>
                  {data.map(m => (
                    <td key={m.month} className="py-2 px-3 text-right tabular-nums text-slate-500">
                      {fmt(m.montigny + m.boissy + m.moussy + m.trappes)}
                    </td>
                  ))}
                </tr>
                {showSiteBreakdown && (
                  <>
                    {(['montigny', 'boissy', 'moussy', 'trappes'] as const).map(site => (
                      <tr key={site} className="bg-slate-50/30">
                        <td className="py-1.5 px-4 pl-10 text-slate-400 sticky left-0 bg-slate-50/30 z-10 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SITE_COLORS[site] }} />
                          {site.charAt(0).toUpperCase() + site.slice(1)}
                        </td>
                        {data.map(m => (
                          <td key={m.month} className={`py-1.5 px-3 text-right tabular-nums ${m[site] < 0 ? 'text-red-500' : 'text-slate-500'}`}>
                            {fmtK(m[site])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}

                {/* Trésorerie exploitation conso */}
                <tr className="font-semibold bg-blue-50/30">
                  <td className="py-2 px-4 text-blue-700 sticky left-0 bg-blue-50/30 z-10">📊 Tréso. Exploitation Conso</td>
                  {data.map(m => (
                    <td key={m.month} className="py-2 px-3 text-right tabular-nums text-blue-700">{fmt(m.tresoExploitConso)}</td>
                  ))}
                </tr>

                {/* TVA à déduire hors exploitation */}
                <tr>
                  <td className="py-2 px-4 text-slate-500 sticky left-0 bg-white z-10">TVA à déduire hors exploit.</td>
                  {data.map(m => (
                    <td key={m.month} className="py-2 px-3 text-right tabular-nums text-slate-500">{m.tvaDeduireHorsExploit > 0 ? fmt(m.tvaDeduireHorsExploit) : '—'}</td>
                  ))}
                </tr>

                {/* Total Tréso Conso */}
                <tr className="font-semibold border-t border-slate-200/80">
                  <td className="py-2 px-4 text-slate-900 sticky left-0 bg-white z-10">Total Tréso. Conso</td>
                  {data.map(m => (
                    <td key={m.month} className="py-2 px-3 text-right tabular-nums text-slate-900">{fmt(m.totalTresoConso)}</td>
                  ))}
                </tr>

                {/* Variation mensuelle */}
                <tr>
                  <td className="py-2 px-4 text-slate-500 sticky left-0 bg-white z-10">Variation mensuelle</td>
                  {data.map(m => (
                    <td key={m.month} className={`py-2 px-3 text-right tabular-nums ${m.variationMensuelle > 0 ? 'text-emerald-600' : m.variationMensuelle < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                      {m.variationMensuelle !== 0 ? `${m.variationMensuelle > 0 ? '+' : ''}${fmtK(m.variationMensuelle)}` : '—'}
                    </td>
                  ))}
                </tr>

                {/* Décaissements (collapsible) */}
                <tr
                  className="cursor-pointer hover:bg-red-50/30 transition-colors border-t border-slate-200/80"
                  onClick={() => setShowDecaissements(!showDecaissements)}
                >
                  <td className="py-2 px-4 font-semibold text-red-600 sticky left-0 bg-white z-10 flex items-center gap-1.5">
                    {showDecaissements ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    Total Décaissements
                  </td>
                  {data.map(m => (
                    <td key={m.month} className="py-2 px-3 text-right tabular-nums text-red-600 font-semibold">
                      {m.totalDecaissement > 0 ? `-${fmtK(m.totalDecaissement)}` : '—'}
                    </td>
                  ))}
                </tr>
                {showDecaissements && (
                  <>
                    {[
                      { key: 'paiementBati' as const, label: 'Paiement Bâtiment' },
                      { key: 'travauxHT' as const, label: 'Travaux HT' },
                      { key: 'tvaTravaux' as const, label: 'TVA Travaux' },
                      { key: 'fraisNotaire' as const, label: 'Frais Notaire' },
                      { key: 'fraisAgence' as const, label: 'Frais Agence' },
                      { key: 'rembtCompteCourant' as const, label: 'Rembt Compte Courant' },
                    ].map(({ key, label }) => (
                      <tr key={key} className="bg-red-50/20">
                        <td className="py-1.5 px-4 pl-10 text-slate-400 sticky left-0 bg-red-50/20 z-10">{label}</td>
                        {data.map(m => (
                          <td key={m.month} className="py-1.5 px-3 text-right tabular-nums text-slate-400">
                            {m[key] > 0 ? fmtK(m[key]) : '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}

                {/* Total Encaissement */}
                <tr className="border-t border-slate-200/80">
                  <td className="py-2 px-4 font-semibold text-emerald-600 sticky left-0 bg-white z-10">Total Encaissements</td>
                  {data.map(m => (
                    <td key={m.month} className="py-2 px-3 text-right tabular-nums text-emerald-600 font-semibold">
                      {m.totalEncaissement > 0 ? `+${fmtK(m.totalEncaissement)}` : '—'}
                    </td>
                  ))}
                </tr>

                {/* ═════ TRÉSORERIE NETTE (big row) ═════ */}
                <tr className="bg-slate-900/[0.03] border-t-2 border-slate-900/10">
                  <td className="py-3 px-4 font-bold text-slate-900 sticky left-0 bg-slate-100/50 z-10 text-[13px]">💰 TRÉSORERIE NETTE</td>
                  {data.map(m => (
                    <td key={m.month} className={`py-3 px-3 text-right font-bold tabular-nums text-[13px] ${m.tresorerieNet >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
                      {fmt(m.tresorerieNet)}
                    </td>
                  ))}
                </tr>

                {/* ═════ SYNTHÈSE BP ═════ */}
                <tr className="border-t-2 border-blue-200/50">
                  <td colSpan={data.length + 1} className="py-2 px-4 text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50/30">
                    ① Business Plan
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-slate-500 sticky left-0 bg-white z-10">Impact TVA selon BP</td>
                  {data.map(m => (
                    <td key={m.month} className="py-2 px-3 text-right tabular-nums text-red-400">{fmt(m.impactTVA_BP)}</td>
                  ))}
                </tr>
                <tr className="font-semibold">
                  <td className="py-2 px-4 text-blue-700 sticky left-0 bg-white z-10">Tréso BP après TVA</td>
                  {data.map(m => (
                    <td key={m.month} className={`py-2 px-3 text-right tabular-nums font-semibold ${m.tresoBPapresTVA >= 0 ? 'text-blue-700' : 'text-red-500'}`}>
                      {fmt(m.tresoBPapresTVA)}
                    </td>
                  ))}
                </tr>

                {/* ═════ RÉEL ═════ */}
                <tr className="border-t-2 border-emerald-200/50">
                  <td colSpan={data.length + 1} className="py-2 px-4 text-[11px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50/30">
                    ② Réel & Crédit TVA
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-slate-700 sticky left-0 bg-white z-10 font-medium">⭐ Solde bancaire réel</td>
                  {data.map(m => (
                    <td key={m.month} className={`py-2 px-3 text-right tabular-nums font-semibold ${m.soldeBancaireReel !== null ? 'text-emerald-600' : 'text-slate-200'}`}>
                      {m.soldeBancaireReel !== null ? fmt(m.soldeBancaireReel) : '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-4 text-slate-700 sticky left-0 bg-white z-10 font-medium">🟣 Crédit TVA à reporter</td>
                  {data.map(m => (
                    <td key={m.month} className={`py-2 px-3 text-right tabular-nums font-semibold ${m.creditTVA !== null && m.creditTVA > 0 ? 'text-violet-600' : 'text-slate-200'}`}>
                      {m.creditTVA !== null ? fmt(m.creditTVA) : '—'}
                    </td>
                  ))}
                </tr>

                {/* ═════ ANALYSE ═════ */}
                <tr className="border-t-2 border-violet-200/50">
                  <td colSpan={data.length + 1} className="py-2 px-4 text-[11px] font-bold text-violet-600 uppercase tracking-wider bg-violet-50/30">
                    ③ Analyse · Position Consolidée
                  </td>
                </tr>
                <tr className="font-semibold">
                  <td className="py-2 px-4 text-violet-700 sticky left-0 bg-white z-10">Position consolidée (Banque + TVA)</td>
                  {data.map(m => (
                    <td key={m.month} className={`py-2 px-3 text-right tabular-nums font-bold ${m.positionConsolidee !== null ? 'text-violet-600' : 'text-slate-200'}`}>
                      {m.positionConsolidee !== null ? fmt(m.positionConsolidee) : '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-4 text-slate-500 sticky left-0 bg-white z-10">Écart Réel vs BP</td>
                  {data.map(m => (
                    <td key={m.month} className={`py-2 px-3 text-right tabular-nums ${m.ecartReelVsBP !== null ? (m.ecartReelVsBP >= 0 ? 'text-emerald-600 font-semibold' : 'text-red-500 font-semibold') : 'text-slate-200'}`}>
                      {m.ecartReelVsBP !== null ? `${m.ecartReelVsBP >= 0 ? '+' : ''}${fmtK(m.ecartReelVsBP)}` : '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-4 text-slate-500 sticky left-0 bg-white z-10">Écart Position conso. vs BP</td>
                  {data.map(m => (
                    <td key={m.month} className={`py-2 px-3 text-right tabular-nums ${m.ecartConsoVsBP !== null ? (m.ecartConsoVsBP >= 0 ? 'text-emerald-600 font-semibold' : 'text-red-500 font-semibold') : 'text-slate-200'}`}>
                      {m.ecartConsoVsBP !== null ? `${m.ecartConsoVsBP >= 0 ? '+' : ''}${fmtK(m.ecartConsoVsBP)}` : '—'}
                    </td>
                  ))}
                </tr>

                {/* Expected inflows row */}
                {inflows.some(f => f.status === 'pending') && (
                  <tr className="bg-amber-50/30 border-t border-amber-200/50">
                    <td className="py-2 px-4 text-amber-700 font-semibold sticky left-0 bg-amber-50/30 z-10">⏳ Inflows attendus</td>
                    {data.map(m => {
                      const monthInflows = inflows.filter(f => f.expectedMonth === m.month && f.expectedYear === m.year && f.status === 'pending');
                      const total = monthInflows.reduce((s, f) => s + f.amount, 0);
                      return (
                        <td key={m.month} className={`py-2 px-3 text-right tabular-nums font-semibold ${total > 0 ? 'text-amber-600' : 'text-slate-200'}`}>
                          {total > 0 ? `+${fmtK(total)}` : '—'}
                        </td>
                      );
                    })}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-[10px] text-slate-400">
              ⭐ Solde en banque · 🟣 Crédit TVA récupérable · Position consolidée = vraie tréso si remboursement TVA · <span className="text-emerald-500">Vert = mieux que prévu</span> / <span className="text-red-400">Rouge = moins bien</span>
            </p>
          </div>
        </div>

        {/* ═══ Leasing Contracts Table ═══ */}
        <div className="metric-card overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-amber-500 to-orange-400" />
          <div className="p-5 pb-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[15px] font-bold text-slate-900">Contrats de Leasing Grenke</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">{leasingContracts.length} contrats · {fmt(totalLeasing)}/mois · {fmt(totalLeasing * 3)}/trimestre</p>
              </div>
              <div className="flex items-center gap-2">
                {Object.entries(leasingBySite).map(([site, { total }]) => (
                  <Tooltip key={site}>
                    <TooltipTrigger asChild>
                      <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-[10px] font-semibold text-slate-500">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SITE_COLORS[site] || '#94a3b8' }} />
                        {site.charAt(0).toUpperCase() + site.slice(1)}: {fmt(total)}/m
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{leasingBySite[site].contracts.length} contrats</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-slate-50/80 border-y border-slate-200/60">
                  <th className="py-2.5 px-4 text-left font-semibold text-slate-400 uppercase tracking-wider text-[10px]">N° Contrat</th>
                  <th className="py-2.5 px-4 text-left font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Description</th>
                  <th className="py-2.5 px-4 text-left font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Site</th>
                  <th className="py-2.5 px-4 text-left font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Fournisseur</th>
                  <th className="py-2.5 px-4 text-right font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Mensuel</th>
                  <th className="py-2.5 px-4 text-right font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Trimestriel</th>
                  <th className="py-2.5 px-4 text-center font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Durée</th>
                  <th className="py-2.5 px-4 text-center font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Échéance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60">
                {leasingContracts.map(c => {
                  const isExpiring = new Date(c.echeance) <= new Date('2028-12-31');
                  return (
                    <tr key={c.numero} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2.5 px-4 font-mono text-slate-500 text-[11px]">{c.numero}</td>
                      <td className="py-2.5 px-4">
                        <span className="font-semibold text-slate-900">{c.description}</span>
                        <span className="text-slate-400 ml-1.5">· {c.detail}</span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SITE_COLORS[c.lieu.toLowerCase()] || '#94a3b8' }} />
                          <span className="text-slate-600">{c.lieu}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-500">{c.fournisseur}</td>
                      <td className="py-2.5 px-4 text-right font-semibold text-slate-900 tabular-nums">{fmt(c.loyerMensuel)}</td>
                      <td className="py-2.5 px-4 text-right text-slate-500 tabular-nums">{fmt(c.loyerTrimestriel)}</td>
                      <td className="py-2.5 px-4 text-center text-slate-500">{c.duree} mois</td>
                      <td className="py-2.5 px-4 text-center">
                        {isExpiring ? (
                          <Badge variant="warning" className="text-[10px]">{c.echeance}</Badge>
                        ) : (
                          <span className="text-slate-500">{c.echeance}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {/* Totals */}
                <tr className="bg-slate-50/80 font-semibold border-t border-slate-200">
                  <td className="py-2.5 px-4 text-slate-900" colSpan={4}>TOTAL</td>
                  <td className="py-2.5 px-4 text-right text-slate-900 tabular-nums">{fmt(totalLeasing)}</td>
                  <td className="py-2.5 px-4 text-right text-slate-900 tabular-nums">{fmt(totalLeasing * 3)}</td>
                  <td colSpan={2} />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══ Info footer ═══ */}
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-blue-50/50 border border-blue-200/40">
          <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-600 leading-relaxed">
            <strong>Méthodologie :</strong> Les données BP proviennent du fichier reporting consolidé (avril 2026).
            Les valeurs ⭐ Solde bancaire et 🟣 Crédit TVA sont à saisir manuellement chaque mois.
            Les <span className="text-amber-600 font-semibold">encaissements attendus</span> (remboursement TVA de 65 000 €) sont visibles dans les projections
            mais <strong>ne modifient pas</strong> le solde bancaire réel actuel.
            Les contrats de leasing ({fmt(totalLeasing)}/mois) sont intégrés dans les charges d'exploitation du BP.
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}
