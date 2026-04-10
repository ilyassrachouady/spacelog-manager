import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area, Line,
} from 'recharts';
import {
  Wallet, Building2, TrendingUp, TrendingDown, CheckCircle2,
  Euro, Landmark, ArrowUpRight, ArrowDownRight, Banknote, CreditCard,
} from 'lucide-react';
import { buildingsList, realRevenues2026, realExpenses2026, debtService2026, realCashFlow2026, vatCredits2026 } from '../data';
import { useApi } from '../ApiContext';

const fmt = (v: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

const fmtK = (v: number) => {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M €`;
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(0)}k €`;
  return `${v} €`;
};

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 backdrop-blur-xl text-white px-4 py-3 rounded-xl shadow-2xl border border-white/10 text-[13px]">
      <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-3 py-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color || p.fill }} />
          <span className="text-slate-300">{p.name}</span>
          <span className="font-bold ml-auto tabular-nums">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function MonthlyTracking() {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('consolidated');
  const api = useApi();

  // ── Data prep ──
  const revenues = realRevenues2026[selectedBuilding as keyof typeof realRevenues2026];
  const expenses = realExpenses2026[selectedBuilding as keyof typeof realExpenses2026];
  const debt = debtService2026[selectedBuilding as keyof typeof debtService2026];

  const actualMonths = revenues.filter(r => r.reel !== null);
  const monthlyData = actualMonths.map((rev, i) => {
    const exp = expenses[i];
    const ebitdaBP = rev.bp - exp.bp;
    const ebitdaReel = (rev.reel || 0) - (exp.reel || 0);
    const cfBP = ebitdaBP - debt;
    const cfReel = ebitdaReel - debt;
    return {
      month: rev.month,
      prevCA: rev.bp,
      realCA: rev.reel || 0,
      prevCharges: exp.bp,
      realCharges: exp.reel || 0,
      ebitdaBP,
      ebitdaReel,
      cfBP,
      cfReel,
    };
  });

  const totals = monthlyData.reduce(
    (acc, m) => ({
      prevCA: acc.prevCA + m.prevCA,
      realCA: acc.realCA + m.realCA,
      prevCharges: acc.prevCharges + m.prevCharges,
      realCharges: acc.realCharges + m.realCharges,
      ebitdaBP: acc.ebitdaBP + m.ebitdaBP,
      ebitdaReel: acc.ebitdaReel + m.ebitdaReel,
      cfBP: acc.cfBP + m.cfBP,
      cfReel: acc.cfReel + m.cfReel,
    }),
    { prevCA: 0, realCA: 0, prevCharges: 0, realCharges: 0, ebitdaBP: 0, ebitdaReel: 0, cfBP: 0, cfReel: 0 },
  );

  const caVariance = totals.realCA - totals.prevCA;
  const caVariancePct = totals.prevCA ? ((caVariance / totals.prevCA) * 100).toFixed(1) : '0';

  // ── Cash-flow evolution ──
  const cashFlows = realCashFlow2026[selectedBuilding as keyof typeof realCashFlow2026];
  let bal = selectedBuilding === 'consolidated' ? 23309 : 0;
  const cfRows = cashFlows.filter(c => c.reel !== null).map(c => {
    const start = bal;
    const flow = c.reel || 0;
    bal = start + flow;
    return { month: c.month, start, flow, end: bal };
  });

  // ── Live balances ──
  const qontoBalance = api.qontoBalance;
  const stripeAvail = api.stripeBalance?.available || 0;
  const stripePending = api.stripeBalance?.pending || 0;

  // ── Chart data ──
  const chartData = monthlyData.map(m => ({
    month: m.month,
    'BP': m.prevCA,
    'Réel': m.realCA,
    'EBITDA': m.ebitdaReel,
  }));

  // ── Treasury chart ──
  const treasuryChart = cfRows.map(r => {
    const vat = selectedBuilding === 'consolidated' ? (vatCredits2026[r.month] || 0) : 0;
    return { month: r.month, Banque: r.end, 'Total + TVA': r.end + vat };
  });

  const buildingName = buildingsList.find(b => b.id === selectedBuilding)?.name || '';

  return (
    <div className="space-y-8">
      {/* ═══ Header ═══ */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-slate-900 tracking-[-0.025em]">Pilotage Mensuel & Trésorerie</h1>
          <p className="text-[13px] text-slate-400 mt-1">Suivi du Réel vs Prévisionnel et positions bancaires — 2026</p>
        </div>
        {/* Building Selector — pill style */}
        <div className="flex items-center gap-1 bg-white border border-slate-200/70 rounded-full p-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          {buildingsList.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBuilding(b.id)}
              className={`px-3.5 py-1.5 text-[12px] font-semibold rounded-full transition-all duration-200 ${
                selectedBuilding === b.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ KPI Summary Bar ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'CA Réel YTD',
            value: fmt(totals.realCA),
            sub: `BP: ${fmtK(totals.prevCA)}`,
            delta: `${Number(caVariancePct) >= 0 ? '+' : ''}${caVariancePct}%`,
            positive: Number(caVariancePct) >= 0,
            color: 'blue',
          },
          {
            label: 'Charges YTD',
            value: fmt(totals.realCharges),
            sub: `BP: ${fmtK(totals.prevCharges)}`,
            delta: `${((totals.realCharges - totals.prevCharges) / (totals.prevCharges || 1) * 100).toFixed(1)}%`,
            positive: totals.realCharges <= totals.prevCharges,
            color: 'rose',
          },
          {
            label: 'EBITDA YTD',
            value: fmt(totals.ebitdaReel),
            sub: `Marge ${totals.realCA ? ((totals.ebitdaReel / totals.realCA) * 100).toFixed(1) : 0}%`,
            delta: `${((totals.ebitdaReel - totals.ebitdaBP) / (Math.abs(totals.ebitdaBP) || 1) * 100).toFixed(1)}%`,
            positive: totals.ebitdaReel >= totals.ebitdaBP,
            color: 'emerald',
          },
          {
            label: 'Cash-Flow Net YTD',
            value: fmt(totals.cfReel),
            sub: `BP: ${fmtK(totals.cfBP)}`,
            delta: totals.cfReel >= 0 ? 'Positif' : 'Négatif',
            positive: totals.cfReel >= 0,
            color: 'violet',
          },
        ].map(kpi => (
          <div key={kpi.label} className="metric-card">
            <div className={`h-[2px] bg-gradient-to-r from-${kpi.color}-500 to-${kpi.color}-400`} />
            <div className="p-5">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.06em] mb-3">{kpi.label}</p>
              <p className="text-[22px] font-extrabold text-slate-900 tracking-[-0.02em] tabular-nums leading-none mb-1.5">{kpi.value}</p>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold rounded-full px-1.5 py-[2px] ${
                  kpi.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {kpi.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.delta}
                </span>
                <span className="text-[11px] text-slate-300 font-medium">{kpi.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Live Bank Balances (compact) ═══ */}
      {(qontoBalance != null || api.stripeBalance) && (
        <div className="flex items-center gap-3 flex-wrap">
          {qontoBalance != null && (
            <div className="flex items-center gap-3 bg-white border border-slate-200/70 rounded-xl px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <Landmark className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-purple-500 uppercase tracking-wider">Qonto</p>
                <p className="text-[16px] font-extrabold text-slate-900 tabular-nums">{fmt(qontoBalance)}</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-400 ml-2" />
            </div>
          )}
          {api.stripeBalance && (
            <div className="flex items-center gap-3 bg-white border border-slate-200/70 rounded-xl px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-indigo-500" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider">Stripe</p>
                <p className="text-[16px] font-extrabold text-slate-900 tabular-nums">{fmt(stripeAvail + stripePending)}</p>
              </div>
              <span className="text-[10px] text-slate-400 ml-1">
                {stripePending > 0 && <span className="tabular-nums">({fmtK(stripePending)} en transit)</span>}
              </span>
              <div className="h-2 w-2 rounded-full bg-emerald-400 ml-1" />
            </div>
          )}
        </div>
      )}

      {/* ═══ SECTION 1: COMPTE DE RÉSULTAT FLASH (Full width) ═══ */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[15px] font-bold text-slate-900">Compte de Résultat Flash</h2>
          <span className="text-[11px] font-medium text-slate-400 bg-slate-100 rounded-full px-2.5 py-0.5">{buildingName}</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/60">
                  <th className="py-3 px-5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-56">Indicateur</th>
                  {monthlyData.map(m => (
                    <th key={m.month} className="py-3 px-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">{m.month}</th>
                  ))}
                  <th className="py-3 px-4 text-[11px] font-semibold text-slate-900 uppercase tracking-wider text-right bg-slate-100/80">Total YTD</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {/* ── CA Prévu ── */}
                <tr className="border-b border-slate-100/80 hover:bg-slate-50/40 transition-colors">
                  <td className="py-3 px-5 font-medium text-slate-500">CA Prévu (BP)</td>
                  {monthlyData.map(m => (
                    <td key={m.month} className="py-3 px-2 text-right text-slate-400 tabular-nums">{fmt(m.prevCA)}</td>
                  ))}
                  <td className="py-3 px-4 text-right font-semibold text-slate-500 tabular-nums bg-slate-50/50">{fmt(totals.prevCA)}</td>
                </tr>
                {/* ── CA Réel ── */}
                <tr className="border-b border-slate-100/80 hover:bg-slate-50/40 transition-colors">
                  <td className="py-3 px-5 font-semibold text-slate-900">CA Réel (Revenus)</td>
                  {monthlyData.map(m => (
                    <td key={m.month} className="py-3 px-2 text-right text-slate-700 tabular-nums font-medium">{fmt(m.realCA)}</td>
                  ))}
                  <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums bg-slate-50/50">{fmt(totals.realCA)}</td>
                </tr>
                {/* ── Écart CA ── */}
                <tr className="border-b border-slate-200/60 hover:bg-slate-50/40 transition-colors">
                  <td className="py-3 px-5 font-medium text-slate-400 text-[12px] pl-8">↳ Écart</td>
                  {monthlyData.map(m => {
                    const d = m.realCA - m.prevCA;
                    return (
                      <td key={m.month} className={`py-3 px-2 text-right tabular-nums text-[12px] font-semibold ${d >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {d >= 0 ? '+' : ''}{fmt(d)}
                      </td>
                    );
                  })}
                  <td className={`py-3 px-4 text-right tabular-nums text-[12px] font-bold bg-slate-50/50 ${caVariance >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {caVariance >= 0 ? '+' : ''}{fmt(caVariance)}
                  </td>
                </tr>

                {/* ── Charges ── */}
                <tr className="border-b border-slate-100/80 hover:bg-slate-50/40 transition-colors">
                  <td className="py-3 px-5 font-semibold text-slate-900">Charges d'Exploitation</td>
                  {monthlyData.map(m => (
                    <td key={m.month} className="py-3 px-2 text-right text-slate-700 tabular-nums font-medium">{fmt(m.realCharges)}</td>
                  ))}
                  <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums bg-slate-50/50">{fmt(totals.realCharges)}</td>
                </tr>

                {/* ── EBITDA ── */}
                <tr className="bg-blue-50/40 border-b border-blue-100/60">
                  <td className="py-3.5 px-5 font-bold text-blue-900">Marge Opérationnelle (EBITDA)</td>
                  {monthlyData.map(m => (
                    <td key={m.month} className="py-3.5 px-2 text-right font-bold text-blue-900 tabular-nums">{fmt(m.ebitdaReel)}</td>
                  ))}
                  <td className="py-3.5 px-4 text-right font-extrabold text-blue-900 tabular-nums bg-blue-50/60">{fmt(totals.ebitdaReel)}</td>
                </tr>

                {/* ── Emprunt ── */}
                <tr className="border-b border-slate-100/80 hover:bg-slate-50/40 transition-colors">
                  <td className="py-3 px-5 font-medium text-slate-700">Emprunt bancaire</td>
                  {monthlyData.map(m => (
                    <td key={m.month} className="py-3 px-2 text-right text-slate-500 tabular-nums">{fmt(debt)}</td>
                  ))}
                  <td className="py-3 px-4 text-right font-semibold text-slate-700 tabular-nums bg-slate-50/50">{fmt(monthlyData.length * debt)}</td>
                </tr>

                {/* ── Cash-Flow Net ── */}
                <tr className="bg-emerald-50/50 border-b border-emerald-100/60">
                  <td className="py-3.5 px-5 font-bold text-emerald-900">Cash-Flow Net</td>
                  {monthlyData.map(m => (
                    <td key={m.month} className={`py-3.5 px-2 text-right font-bold tabular-nums ${m.cfReel >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {fmt(m.cfReel)}
                    </td>
                  ))}
                  <td className={`py-3.5 px-4 text-right font-extrabold tabular-nums bg-emerald-50/60 ${totals.cfReel >= 0 ? 'text-emerald-900' : 'text-rose-600'}`}>
                    {fmt(totals.cfReel)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══ CA Chart: BP vs Réel ═══ */}
      <section className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[15px] font-bold text-slate-900">CA Prévu vs Réel</h3>
            <p className="text-[12px] text-slate-400 mt-0.5">{buildingName} — par mois</p>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-slate-200" />BP</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-blue-500" />Réel</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-[2px] rounded-full bg-emerald-500" />EBITDA</span>
          </div>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={45} />
              <Tooltip content={<ChartTip />} cursor={{ fill: 'rgba(241,245,249,0.5)' }} />
              <Bar dataKey="BP" name="Prévu" fill="#e2e8f0" radius={[6, 6, 2, 2]} maxBarSize={32} />
              <Bar dataKey="Réel" name="Réel" fill="#3b82f6" radius={[6, 6, 2, 2]} maxBarSize={32} />
              <Line type="monotone" dataKey="EBITDA" name="EBITDA" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#fff', stroke: '#10b981', strokeWidth: 2 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ═══ SECTION 2: TRÉSORERIE ═══ */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[15px] font-bold text-slate-900">Trésorerie Consolidée</h2>
          <span className="text-[11px] font-medium text-slate-400 bg-slate-100 rounded-full px-2.5 py-0.5">{buildingName}</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/60">
                  <th className="py-3 px-5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-56">Indicateur</th>
                  {cfRows.map(m => (
                    <th key={m.month} className="py-3 px-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">{m.month}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {/* Opening */}
                <tr className="border-b border-slate-100/80 hover:bg-slate-50/40 transition-colors">
                  <td className="py-3 px-5 font-medium text-slate-700">Solde d'ouverture</td>
                  {cfRows.map(m => (
                    <td key={m.month} className="py-3 px-2 text-right text-slate-500 tabular-nums">{fmt(m.start)}</td>
                  ))}
                </tr>
                {/* FCF */}
                <tr className="border-b border-slate-100/80 hover:bg-slate-50/40 transition-colors">
                  <td className="py-3 px-5 font-medium text-slate-700">Free Cash Flow</td>
                  {cfRows.map(m => (
                    <td key={m.month} className={`py-3 px-2 text-right font-semibold tabular-nums ${m.flow >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {m.flow >= 0 ? '+' : ''}{fmt(m.flow)}
                    </td>
                  ))}
                </tr>
                {/* Closing */}
                <tr className="bg-slate-50/60 border-b border-slate-200/60">
                  <td className="py-3.5 px-5 font-bold text-slate-900">Solde de clôture (Banque)</td>
                  {cfRows.map(m => (
                    <td key={m.month} className="py-3.5 px-2 text-right font-bold text-slate-900 tabular-nums">{fmt(m.end)}</td>
                  ))}
                </tr>
                {/* VAT credits */}
                <tr className="border-b border-blue-100/60 hover:bg-blue-50/20 transition-colors">
                  <td className="py-3 px-5 font-medium text-blue-700">+ Crédit de TVA</td>
                  {cfRows.map(m => {
                    const vat = selectedBuilding === 'consolidated' ? (vatCredits2026[m.month] || 0) : 0;
                    return (
                      <td key={m.month} className="py-3 px-2 text-right text-blue-600 tabular-nums">
                        {selectedBuilding === 'consolidated' ? fmt(vat) : '—'}
                      </td>
                    );
                  })}
                </tr>
                {/* Grand total */}
                <tr className="bg-slate-900">
                  <td className="py-3.5 px-5 font-bold text-white">Trésorerie Globale</td>
                  {cfRows.map(m => {
                    const vat = selectedBuilding === 'consolidated' ? (vatCredits2026[m.month] || 0) : 0;
                    return (
                      <td key={m.month} className="py-3.5 px-2 text-right font-bold text-white tabular-nums">{fmt(m.end + vat)}</td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          {selectedBuilding === 'consolidated' && (
            <p className="text-[11px] text-slate-400 px-5 py-3 border-t border-slate-100">
              Solde d'ouverture Janvier : +23 309 € (position bancaire au 01/01/2026)
            </p>
          )}
          {selectedBuilding !== 'consolidated' && (
            <p className="text-[11px] text-slate-400 px-5 py-3 border-t border-slate-100">
              Le solde initial n'est connu qu'au consolidé (+23 309 €). Ici : trésorerie générée depuis le 01/01/2026.
            </p>
          )}
        </div>
      </section>

      {/* ═══ Treasury Chart ═══ */}
      <section className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[15px] font-bold text-slate-900">Évolution de la Trésorerie</h3>
            <p className="text-[12px] text-slate-400 mt-0.5">{buildingName} — S1 2026</p>
          </div>
          {selectedBuilding === 'consolidated' && cfRows.length > 0 && (
            <div className="bg-slate-900 rounded-xl px-4 py-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Dernier solde</p>
              <p className="text-[16px] font-extrabold text-white tabular-nums mt-0.5">
                {fmt(cfRows[cfRows.length - 1].end + (vatCredits2026[cfRows[cfRows.length - 1].month] || 0))}
              </p>
            </div>
          )}
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={treasuryChart} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradBankLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradTotalLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={50} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="Banque" stroke="#94a3b8" strokeWidth={2} fill="url(#gradBankLine)" dot={false} activeDot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />
              <Area type="monotone" dataKey="Total + TVA" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gradTotalLine)" dot={false} activeDot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <span className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
            <span className="w-4 h-[2px] rounded-full bg-slate-400" />Banque
          </span>
          <span className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
            <span className="w-4 h-[2px] rounded-full bg-blue-500" />Total (+ TVA)
          </span>
        </div>
      </section>
    </div>
  );
}
