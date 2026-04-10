import React, { useState } from 'react';
import { Download, RefreshCw, CheckCircle2, AlertCircle, Clock, Euro, ArrowUpRight, ArrowDownRight, TrendingUp, FileText, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { realRevenues2026 } from '../data';
import { useApi } from '../ApiContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

// Real BP vs Réel data
const bpData = realRevenues2026.consolidated.map(d => ({
  month: d.month,
  prev: d.bp,
  reel: d.reel,
}));

const mapPennylaneStatus = (inv: { paid: boolean; status: string; remaining_amount: number }) => {
  if (inv.paid) return 'paid';
  if (inv.status === 'late' || inv.status === 'overdue') return 'overdue';
  return 'pending';
};

export default function Billing() {
  const api = useApi();
  const [search, setSearch] = useState('');

  const invoices = api.pennylaneInvoices
    .filter(inv => {
      if (!search) return true;
      const q = search.toLowerCase();
      return inv.customer.toLowerCase().includes(q) || inv.invoice_number.includes(q);
    });

  const paid = invoices.filter(i => i.paid);
  const pending = invoices.filter(i => !i.paid && mapPennylaneStatus(i) === 'pending');
  const overdue = invoices.filter(i => mapPennylaneStatus(i) === 'overdue');

  const paidTotal = paid.reduce((s, i) => s + i.amount, 0);
  const pendingTotal = pending.reduce((s, i) => s + i.amount, 0);
  const overdueTotal = overdue.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6 animate-page-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Facturation & Trésorerie</h1>
          {api.lastSync && (
            <p className="text-xs text-slate-400 mt-0.5">
              Dernière synchro Pennylane : {api.lastSync.toLocaleTimeString('fr-FR')}
              {' · '}{api.pennylaneInvoices.length} factures chargées
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Rechercher client ou n° facture..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => api.refresh()}
            disabled={api.loading}
            className="gap-2"
          >
            <RefreshCw size={15} className={api.loading ? 'animate-spin text-brand-blue' : ''} />
            {api.loading ? 'Synchronisation...' : 'Synchro Pennylane'}
          </Button>
        </div>
      </div>

      {/* Cashflow Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-success-light flex items-center justify-center text-success">
                <ArrowUpRight size={18} />
              </div>
              <h3 className="font-medium text-slate-500 text-sm">Encaissé</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">{paidTotal.toLocaleString('fr-FR')} €</p>
            <p className="text-xs text-slate-400 mt-1">{paid.length} factures encaissées</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-brand-blue-light flex items-center justify-center text-brand-blue">
                <Clock size={18} />
              </div>
              <h3 className="font-medium text-slate-500 text-sm">À encaisser</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">{pendingTotal.toLocaleString('fr-FR')} €</p>
            <p className="text-xs text-slate-400 mt-1">{pending.length} factures en attente</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-brand-pink hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-brand-pink-light flex items-center justify-center text-brand-pink">
                <AlertCircle size={18} />
              </div>
              <h3 className="font-medium text-slate-500 text-sm">Retards de paiement</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">{overdueTotal.toLocaleString('fr-FR')} €</p>
            <p className="text-xs text-brand-pink mt-1 font-medium">{overdue.length} facture(s) en retard</p>
          </CardContent>
        </Card>
      </div>

      {/* Stripe balance info */}
      {api.stripeBalance && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Euro size={18} />
                </div>
                <h3 className="font-medium text-slate-500 text-sm">Stripe — Disponible</h3>
              </div>
              <p className="text-2xl font-bold text-slate-900">{api.stripeBalance.available.toLocaleString('fr-FR')} €</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                  <Clock size={18} />
                </div>
                <h3 className="font-medium text-slate-500 text-sm">Stripe — En transit</h3>
              </div>
              <p className="text-2xl font-bold text-slate-900">{api.stripeBalance.pending.toLocaleString('fr-FR')} €</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* BP vs Réel Chart */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-sm font-semibold">Prévisionnel vs Réel</CardTitle>
              <CardDescription className="text-xs">CA mensuel (€ HT)</CardDescription>
            </div>
            <Badge variant="success" className="gap-1.5 text-xs">
              <TrendingUp size={14} />
              Fév : {bpData[1]?.reel && bpData[1]?.prev ? ((((bpData[1].reel - bpData[1].prev) / bpData[1].prev) * 100)).toFixed(1) : '—'}% vs BP
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bpData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.08)', fontSize: '13px' }}
                cursor={{ fill: '#f8fafc' }}
                formatter={(value: number) => [`${value.toLocaleString()} €`, '']}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '16px', fontSize: '12px', color: '#64748b' }} />
              <Bar dataKey="prev" name="BP Prévisionnel" fill="#e2e8f0" radius={[6, 6, 0, 0]} maxBarSize={36} />
              <Bar dataKey="reel" name="CA Réel" fill="var(--color-brand-blue)" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        </CardContent>
      </Card>

      {/* Invoices List from Pennylane */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <CardTitle className="text-sm font-semibold">Factures Pennylane ({invoices.length})</CardTitle>
            <div className="flex gap-2 text-xs">
              <Badge variant="success" className="gap-1 text-[10px]">{paid.length} payées</Badge>
              <Badge variant="blue" className="gap-1 text-[10px]">{pending.length} en attente</Badge>
              {overdue.length > 0 && <Badge variant="pink" className="gap-1 text-[10px]">{overdue.length} en retard</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
        {api.loading && api.pennylaneInvoices.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="w-6 h-6 text-brand-blue animate-spin mr-3" />
            <span className="text-slate-500">Chargement des factures Pennylane...</span>
          </div>
        ) : (
        <table className="w-full text-left text-sm" role="table">
          <thead className="text-slate-500 font-medium border-b border-slate-200 bg-slate-50/80">
            <tr>
              <th className="px-5 py-3.5 text-xs">N° Facture</th>
              <th className="px-5 py-3.5 text-xs">Client</th>
              <th className="px-5 py-3.5 text-xs hidden md:table-cell">Date</th>
              <th className="px-5 py-3.5 text-xs hidden lg:table-cell">Échéance</th>
              <th className="px-5 py-3.5 text-xs text-right">Montant TTC</th>
              <th className="px-5 py-3.5 text-xs">Statut</th>
              <th className="px-5 py-3.5 text-xs text-center">Doc</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv) => {
              const uiStatus = mapPennylaneStatus(inv);
              return (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900 text-xs font-mono">{inv.invoice_number}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-slate-800 text-sm">{inv.customer}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs hidden md:table-cell">{inv.date}</td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs hidden lg:table-cell">{inv.deadline}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900 text-right">{inv.amount.toLocaleString('fr-FR')} €</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={
                      uiStatus === 'paid' ? 'success' :
                      uiStatus === 'pending' ? 'blue' : 'pink'
                    }>
                      {uiStatus === 'paid' ? 'Payée' :
                       uiStatus === 'pending' ? 'En attente' : 'En retard'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {inv.file_url && (
                        <a href={inv.file_url} target="_blank" rel="noopener noreferrer" title="Télécharger PDF" className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors">
                          <FileText size={15} />
                        </a>
                      )}
                      {inv.public_url && (
                        <a href={inv.public_url} target="_blank" rel="noopener noreferrer" title="Voir en ligne" className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors">
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}

        {/* Pagination */}
        {api.pennylaneTotalPages > 1 && api.pennylaneInvoices.length > 0 && (
          <div className="border-t border-slate-200 px-5 py-3 flex items-center justify-between bg-slate-50/50">
            <span className="text-xs text-slate-400">{api.pennylaneInvoices.length} factures chargées sur ~{api.pennylaneTotalPages * 100}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => api.loadMoreInvoices(Math.floor(api.pennylaneInvoices.length / 100) + 1)}
              className="text-xs"
            >
              Charger plus de factures
            </Button>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
