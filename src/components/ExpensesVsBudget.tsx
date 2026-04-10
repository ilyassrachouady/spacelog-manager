import React, { useState } from 'react';
import { Building2, Calendar, TrendingDown, TrendingUp, AlertCircle, Download, Layers, Banknote } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useApi } from '../ApiContext';

// Types
type SiteId = 'consolidated' | 'montigny' | 'boissy' | 'moussy' | 'trappes' | 'nouveauSite';
type Month = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';

interface ExpenseLine {
  id: string;
  category: string;
  budget: number;
  actual: number;
  comment: string;
}

// Mock Data structure (To be replaced by user data)
const MOCK_EXPENSES: Record<Exclude<SiteId, 'consolidated'>, Record<Month, ExpenseLine[]>> = {
  montigny: {
    '01': [
      { id: '1', category: 'Électricité', budget: 2300, actual: 3494, comment: 'Hausse des tarifs' },
      { id: '2', category: 'Leasing Alarme', budget: 521, actual: 2025, comment: 'Régularisation annuelle' },
      { id: '3', category: 'Leasing Mezzanine', budget: 1262, actual: 1653, comment: '' },
      { id: '4', category: 'Entretien locaux', budget: 395, actual: 2068, comment: 'Prestation supplémentaire' },
      { id: '5', category: 'Assurances Multirisques', budget: 600, actual: 1622, comment: 'Prime annuelle' },
      { id: '6', category: 'Assurance Leasing Mezzanine', budget: 0, actual: 403, comment: '' },
      { id: '7', category: 'Assurance Alarme', budget: 0, actual: 97, comment: '' },
      { id: '8', category: 'Internet - Telephonie', budget: 890, actual: 754, comment: '' },
      { id: '9', category: 'Taxes Foncières', budget: 3767, actual: 3767, comment: 'Conforme au BP' },
    ],
    '02': [
      { id: '1', category: 'Électricité', budget: 2300, actual: 3131, comment: 'Hausse des tarifs' },
      { id: '2', category: 'Leasing Alarme', budget: 521, actual: 1829, comment: '' },
      { id: '3', category: 'Leasing Mezzanine', budget: 1262, actual: 1493, comment: '' },
      { id: '4', category: 'Entretien locaux', budget: 395, actual: 2225, comment: 'Prestation supplémentaire' },
      { id: '5', category: 'Assurances Multirisques', budget: 600, actual: 1615, comment: '' },
      { id: '6', category: 'Assurance Leasing Mezzanine', budget: 0, actual: -334, comment: 'Régularisation' },
      { id: '7', category: 'Assurance Alarme', budget: 0, actual: 87, comment: '' },
      { id: '8', category: 'Internet - Telephonie', budget: 890, actual: 681, comment: '' },
      { id: '9', category: 'Taxes Foncières', budget: 3767, actual: 3767, comment: 'Conforme au BP' },
    ],
    '03': [], '04': [], '05': [], '06': [], '07': [], '08': [], '09': [], '10': [], '11': [], '12': []
  },
  boissy: {
    '01': [
      { id: '1', category: 'Électricité', budget: 1200, actual: 1751, comment: 'Hausse des tarifs' },
      { id: '2', category: 'Leasing Mezzanine', budget: 1262, actual: 2233, comment: '' },
      { id: '3', category: 'Leasing Alarme', budget: 521, actual: 1963, comment: '' },
      { id: '4', category: 'Leasing Enseigne', budget: 20, actual: 233, comment: '' },
      { id: '5', category: 'Entretien locaux', budget: 395, actual: 1619, comment: '' },
      { id: '6', category: 'Assurance Alarme', budget: 0, actual: 345, comment: '' },
      { id: '7', category: 'Assurance Leasing Enseigne', budget: 0, actual: 12, comment: '' },
      { id: '8', category: 'Internet - Telephonie', budget: 630, actual: 644, comment: '' },
      { id: '9', category: 'Taxes Foncières', budget: 817, actual: 817, comment: 'Conforme au BP' },
    ],
    '02': [
      { id: '1', category: 'Électricité', budget: 1200, actual: 1593, comment: 'Hausse des tarifs' },
      { id: '2', category: 'Leasing Mezzanine', budget: 1262, actual: 2017, comment: '' },
      { id: '3', category: 'Leasing Alarme', budget: 521, actual: 1773, comment: '' },
      { id: '4', category: 'Leasing Enseigne', budget: 20, actual: 210, comment: '' },
      { id: '5', category: 'Entretien locaux', budget: 395, actual: 1681, comment: '' },
      { id: '6', category: 'Assurance Alarme', budget: 0, actual: -345, comment: 'Régularisation' },
      { id: '7', category: 'Assurance Leasing Enseigne', budget: 0, actual: -12, comment: 'Régularisation' },
      { id: '8', category: 'Internet - Telephonie', budget: 630, actual: 644, comment: '' },
      { id: '9', category: 'Taxes Foncières', budget: 817, actual: 817, comment: 'Conforme au BP' },
    ],
    '03': [], '04': [], '05': [], '06': [], '07': [], '08': [], '09': [], '10': [], '11': [], '12': []
  },
  moussy: {
    '01': [
      { id: '1', category: 'Électricité', budget: 250, actual: 217, comment: '' },
      { id: '2', category: 'Leasing Mezzanine', budget: 1262, actual: 501, comment: '' },
      { id: '3', category: 'Leasing Alarme', budget: 521, actual: 404, comment: '' },
      { id: '4', category: 'Leasing Porte Sectionnelle', budget: 0, actual: 120, comment: '' },
      { id: '5', category: 'Assurance Alarme', budget: 0, actual: 59, comment: '' },
      { id: '6', category: 'Assurance Mezzanine', budget: 0, actual: 40, comment: '' },
      { id: '7', category: 'Internet', budget: 50, actual: 39, comment: '' },
    ],
    '02': [
      { id: '1', category: 'Électricité', budget: 250, actual: 182, comment: '' },
      { id: '2', category: 'Leasing Mezzanine', budget: 1262, actual: 453, comment: '' },
      { id: '3', category: 'Leasing Alarme', budget: 521, actual: 365, comment: '' },
      { id: '4', category: 'Leasing Porte Sectionnelle', budget: 0, actual: 108, comment: '' },
      { id: '5', category: 'Assurance Alarme', budget: 0, actual: -59, comment: 'Régularisation' },
      { id: '6', category: 'Assurance Mezzanine', budget: 0, actual: -40, comment: 'Régularisation' },
      { id: '7', category: 'Assurance Porte Sect', budget: 0, actual: -22, comment: 'Régularisation' },
      { id: '8', category: 'Internet', budget: 50, actual: 39, comment: '' },
    ],
    '03': [], '04': [], '05': [], '06': [], '07': [], '08': [], '09': [], '10': [], '11': [], '12': []
  },
  trappes: {
    '01': [
      { id: '1', category: 'Eau', budget: 0, actual: 86, comment: '' },
      { id: '2', category: 'Électricité', budget: 675, actual: 1290, comment: '' },
      { id: '3', category: 'Leasing Mezzanines', budget: 1262, actual: 62, comment: '' },
      { id: '4', category: 'Assurance Leasing Mezzanines', budget: 0, actual: 7, comment: '' },
    ],
    '02': [
      { id: '1', category: 'Électricité', budget: 675, actual: 607, comment: '' },
      { id: '2', category: 'Leasing Monte Charge', budget: 0, actual: 71, comment: '' },
      { id: '3', category: 'Leasing Mezzanines', budget: 1262, actual: 438, comment: '' },
      { id: '4', category: 'Assurance Leasing Mezzanines', budget: 0, actual: 54, comment: '' },
      { id: '5', category: 'Assurance Leasing Mont charges', budget: 0, actual: 64, comment: '' },
    ],
    '03': [], '04': [], '05': [], '06': [], '07': [], '08': [], '09': [], '10': [], '11': [], '12': []
  },
  nouveauSite: {
    '01': [], '02': [], '03': [], '04': [], '05': [], '06': [], '07': [], '08': [], '09': [], '10': [], '11': [], '12': []
  }
};

const SITES = [
  { id: 'consolidated', name: 'Consolidé (Global)' },
  { id: 'montigny', name: 'Site Montigny' },
  { id: 'boissy', name: 'Site Boissy' },
  { id: 'moussy', name: 'Site Moussy' },
  { id: 'trappes', name: 'Site Trappes (Travaux)' },
  { id: 'nouveauSite', name: 'Nouveau Site' },
];

const MONTHS = [
  { id: '01', name: 'Janvier' },
  { id: '02', name: 'Février' },
  { id: '03', name: 'Mars' },
  { id: '04', name: 'Avril' },
  { id: '05', name: 'Mai' },
  { id: '06', name: 'Juin' },
  { id: '07', name: 'Juillet' },
  { id: '08', name: 'Août' },
  { id: '09', name: 'Septembre' },
  { id: '10', name: 'Octobre' },
  { id: '11', name: 'Novembre' },
  { id: '12', name: 'Décembre' },
];

export default function ExpensesVsBudget() {
  const [activeSite, setActiveSite] = useState<SiteId>('consolidated');
  const [activeMonth, setActiveMonth] = useState<Month>('01');
  const [year] = useState('2026');
  const api = useApi();

  let currentData: ExpenseLine[] = [];

  if (activeSite === 'consolidated') {
    const aggregated: Record<string, ExpenseLine> = {};
    Object.keys(MOCK_EXPENSES).forEach(site => {
      const siteData = MOCK_EXPENSES[site as keyof typeof MOCK_EXPENSES][activeMonth] || [];
      siteData.forEach(item => {
        if (!aggregated[item.category]) {
          aggregated[item.category] = {
            id: item.category,
            category: item.category,
            budget: 0,
            actual: 0,
            comment: ''
          };
        }
        aggregated[item.category].budget += item.budget;
        aggregated[item.category].actual += item.actual;
      });
    });
    currentData = Object.values(aggregated);
  } else {
    currentData = MOCK_EXPENSES[activeSite as keyof typeof MOCK_EXPENSES][activeMonth] || [];
  }

  const totalBudget = currentData.reduce((sum, item) => sum + item.budget, 0);
  const totalActual = currentData.reduce((sum, item) => sum + item.actual, 0);
  const totalVariance = totalActual - totalBudget;
  const variancePercentage = totalBudget > 0 ? (totalVariance / totalBudget) * 100 : 0;

  const chartData = currentData.map(item => ({
    name: item.category,
    Prévisionnel: item.budget,
    Réel: item.actual,
    Écart: item.actual - item.budget
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Suivi des Charges (Réel vs Budget)</h1>
          <p className="text-slate-500">Analysez vos coûts d'exploitation et justifiez les écarts.</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors">
          <Download size={20} />
          Exporter PDF
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Site</label>
          <div className="flex flex-wrap gap-2">
            {SITES.map(site => (
              <button
                key={site.id}
                onClick={() => setActiveSite(site.id as SiteId)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                  activeSite === site.id 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {site.id === 'consolidated' ? <Layers size={16} /> : <Building2 size={16} />}
                {site.name}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:w-64">
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Mois ({year})</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              value={activeMonth}
              onChange={(e) => setActiveMonth(e.target.value as Month)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm font-medium text-slate-900 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none appearance-none"
            >
              {MONTHS.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {currentData.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Aucune donnée pour ce mois</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Veuillez fournir vos comptes de charges réels et votre budget prévisionnel pour que nous puissions générer le comparatif.
          </p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <p className="text-sm font-medium text-slate-500">Budget Prévisionnel</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {totalBudget.toLocaleString()} €
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <p className="text-sm font-medium text-slate-500">Dépenses Réelles</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {totalActual.toLocaleString()} €
              </p>
            </div>
            <div className={`p-5 rounded-xl shadow-sm border relative overflow-hidden ${
              totalVariance > 0 ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-sm font-medium ${totalVariance > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                    Écart (Dépassement)
                  </p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <p className={`text-2xl font-bold ${totalVariance > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {totalVariance > 0 ? '+' : ''}{totalVariance.toLocaleString()} €
                    </p>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                      totalVariance > 0 ? 'bg-rose-200 text-rose-800' : 'bg-emerald-200 text-emerald-800'
                    }`}>
                      {totalVariance > 0 ? '+' : ''}{variancePercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                {totalVariance > 0 ? (
                  <TrendingUp className="text-rose-500" size={24} />
                ) : (
                  <TrendingDown className="text-emerald-500" size={24} />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-200">
                <h2 className="font-bold text-slate-900">Détail des charges</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">Catégorie</th>
                      <th className="px-5 py-3 font-medium text-right">Prévisionnel</th>
                      <th className="px-5 py-3 font-medium text-right">Réel</th>
                      <th className="px-5 py-3 font-medium text-right">Écart</th>
                      <th className="px-5 py-3 font-medium">Explication de l'écart</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentData.map((item) => {
                      const variance = item.actual - item.budget;
                      const isOverBudget = variance > 0;
                      
                      return (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4 font-medium text-slate-900">{item.category}</td>
                          <td className="px-5 py-4 text-right text-slate-600">{item.budget.toLocaleString()} €</td>
                          <td className="px-5 py-4 text-right font-medium text-slate-900">{item.actual.toLocaleString()} €</td>
                          <td className="px-5 py-4 text-right">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${
                              variance === 0 ? 'bg-slate-100 text-slate-600' :
                              isOverBudget ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {variance > 0 ? '+' : ''}{variance.toLocaleString()} €
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            {item.comment ? (
                              <span className="text-slate-600 text-xs">{item.comment}</span>
                            ) : (
                              <span className="text-slate-300 text-xs italic">Aucune explication</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="font-bold text-slate-900 mb-6">Répartition Réel vs Budget</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#475569', fontSize: 11 }} width={100} />
                    <Tooltip 
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                    <Bar dataKey="Prévisionnel" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={12} />
                    <Bar dataKey="Réel" fill="#0f172a" radius={[0, 4, 4, 0]} barSize={12}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.Écart > 0 ? '#ef4444' : '#0f172a'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-brand-blue shrink-0 mt-0.5" size={16} />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Les barres rouges indiquent les postes de dépenses ayant dépassé le budget prévisionnel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Live Qonto Debits */}
      {api.qontoTransactions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Banknote size={18} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Derniers débits Qonto</h2>
                <p className="text-xs text-slate-400">Transactions réelles depuis le compte bancaire</p>
              </div>
            </div>
            {api.lastSync && (
              <span className="text-xs text-slate-400">Synchro : {api.lastSync.toLocaleTimeString('fr-FR')}</span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Libellé</th>
                  <th className="px-5 py-3 font-medium">Référence</th>
                  <th className="px-5 py-3 font-medium text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {api.qontoTransactions
                  .filter(tx => tx.side === 'debit')
                  .slice(0, 15)
                  .map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 text-slate-600 text-xs">
                        {tx.settled_at ? new Date(tx.settled_at).toLocaleDateString('fr-FR') : tx.emitted_at ? new Date(tx.emitted_at).toLocaleDateString('fr-FR') : '—'}
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-900 max-w-xs truncate">{tx.label || tx.counterparty || '—'}</td>
                      <td className="px-5 py-3 text-slate-500 text-xs max-w-xs truncate">{tx.reference || '—'}</td>
                      <td className="px-5 py-3 text-right font-semibold text-rose-600">
                        −{tx.amount?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
