import React, { useState } from 'react';
import { Download, RefreshCw, CheckCircle2, AlertCircle, Clock, Euro, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const invoices = [
  { id: 'INV-2026-001', client: 'E-com Express', type: 'Loyer Mensuel', amount: 750, status: 'paid', date: '01/03/2026', sepa: true },
  { id: 'INV-2026-002', client: 'LogisTech', type: 'Loyer Mensuel', amount: 1400, status: 'pending', date: '05/03/2026', sepa: true },
  { id: 'INV-2026-003', client: 'Boutique Zen', type: 'Loyer Mensuel', amount: 400, status: 'overdue', date: '28/02/2026', sepa: false },
  { id: 'INV-2026-004', client: 'MegaStock', type: 'Dépôt de Garantie', amount: 5200, status: 'paid', date: '15/02/2026', sepa: true },
  { id: 'INV-2026-005', client: 'Nouveau Client', type: 'Dépôt de Garantie', amount: 3400, status: 'pending', date: '10/03/2026', sepa: false },
];

// Mockup data for BP vs Réel
const bpData = [
  { month: 'Jan', prev: 85000, reel: 82000 },
  { month: 'Fév', prev: 85000, reel: 86500 },
  { month: 'Mar', prev: 88000, reel: 89885 }, // Based on current total: 54385 + 31700 + 3800
  { month: 'Avr', prev: 90000, reel: null },
  { month: 'Mai', prev: 90000, reel: null },
  { month: 'Juin', prev: 92000, reel: null },
];

export default function Billing() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Facturation & Trésorerie</h1>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} className={isSyncing ? 'animate-spin text-brand-blue' : ''} />
          {isSyncing ? 'Synchronisation...' : 'Synchro Pennylane'}
        </button>
      </div>

      {/* Cashflow Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ArrowUpRight size={20} />
            </div>
            <h3 className="font-medium text-slate-600">Encaissé (Mars)</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">5 950 €</p>
          <p className="text-sm text-slate-500 mt-2">Loyers + Dépôts</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue">
              <Clock size={20} />
            </div>
            <h3 className="font-medium text-slate-600">À encaisser (Mars)</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">4 800 €</p>
          <p className="text-sm text-slate-500 mt-2">Prélèvements en cours</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-brand-pink">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-brand-pink">
              <AlertCircle size={20} />
            </div>
            <h3 className="font-medium text-slate-600">Retards de paiement</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">400 €</p>
          <p className="text-sm text-brand-pink mt-2 font-medium">1 facture échue</p>
        </div>
      </div>

      {/* BP vs Réel Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Suivi Business Plan : Prévisionnel vs Réel</h2>
            <p className="text-sm text-slate-500">Comparatif du Chiffre d'Affaires mensuel (en € HT)</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
            <TrendingUp size={16} />
            <span>Mars : +2.1% vs BP</span>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bpData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f8fafc' }}
                formatter={(value: number) => [`${value.toLocaleString()} €`, '']}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="prev" name="BP Prévisionnel" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="reel" name="Chiffre d'Affaires Réel" fill="#0000FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="font-semibold text-slate-900">Dernières Factures</h2>
          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
              <CheckCircle2 size={14} className="text-emerald-500" /> Mandat SEPA Actif
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
              <AlertCircle size={14} className="text-amber-500" /> Mandat Manquant
            </span>
          </div>
        </div>
        
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">N° Facture</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Montant HT</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{invoice.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{invoice.client}</span>
                    {invoice.sepa ? (
                      <CheckCircle2 size={16} className="text-emerald-500" title="Mandat SEPA GoCardless Actif" />
                    ) : (
                      <AlertCircle size={16} className="text-amber-500" title="Mandat SEPA Manquant" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500">{invoice.type}</td>
                <td className="px-6 py-4 text-slate-500">{invoice.date}</td>
                <td className="px-6 py-4 font-medium">{invoice.amount} €</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                    invoice.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                    'bg-pink-100 text-brand-pink'
                  }`}>
                    {invoice.status === 'paid' ? 'Payée' :
                     invoice.status === 'pending' ? 'En attente' : 'En retard'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-brand-blue transition-colors">
                    <Download size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
