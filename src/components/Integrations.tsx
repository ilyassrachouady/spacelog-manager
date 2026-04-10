import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  CreditCard, 
  Building, 
  Wallet,
  Settings,
  X,
  Lock,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { useApi } from '../ApiContext';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

export default function Integrations() {
  const api = useApi();
  const [showConfig, setShowConfig] = useState(false);
  const [activePanel, setActivePanel] = useState<'stripe' | 'qonto' | 'pennylane' | null>(null);

  const getStatusDot = (connected: boolean) => (
    <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-slate-300'}`} />
  );

  const getPaymentStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      succeeded: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Payé' },
      requires_payment_method: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'En attente' },
      requires_confirmation: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'À confirmer' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Traitement' },
      canceled: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Annulé' },
      requires_action: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Action requise' },
    };
    const s = map[status] || { bg: 'bg-slate-100', text: 'text-slate-600', label: status };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>{s.label}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cash & Intégrations</h1>
          <p className="text-slate-500 mt-1">Suivi de la trésorerie en temps réel et rapprochement bancaire.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowConfig(true)}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurer
          </button>
          <button
            onClick={() => api.refresh()}
            disabled={api.loading}
            className="flex items-center px-4 py-2 bg-brand-blue text-white rounded-lg hover:opacity-85 transition-all disabled:opacity-70"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${api.loading ? 'animate-spin' : ''}`} />
            {api.loading ? 'Synchronisation...' : 'Synchroniser'}
          </button>
        </div>
      </div>

      {/* API Status Cards — clickable */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setActivePanel(activePanel === 'stripe' ? null : 'stripe')}
          className={`bg-white p-5 rounded-xl shadow-sm border cursor-pointer transition-all hover:shadow-md ${
            activePanel === 'stripe' ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Stripe</p>
                <p className="text-xs text-slate-500">Encaissements & Paiements</p>
              </div>
            </div>
            {getStatusDot(api.status.stripe)}
          </div>
          {api.stripeBalance && (
            <div className="mt-2">
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(api.stripeBalance.available)}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Disponible{api.stripeBalance.pending > 0 && <> · {formatCurrency(api.stripeBalance.pending)} en attente</>}
              </p>
            </div>
          )}
        </div>

        <div
          onClick={() => setActivePanel(activePanel === 'qonto' ? null : 'qonto')}
          className={`bg-white p-5 rounded-xl shadow-sm border cursor-pointer transition-all hover:shadow-md ${
            activePanel === 'qonto' ? 'border-purple-400 ring-2 ring-purple-100' : 'border-slate-200 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Qonto</p>
                <p className="text-xs text-slate-500">Banque{api.qontoOrgName ? ` · ${api.qontoOrgName}` : ''}</p>
              </div>
            </div>
            {getStatusDot(api.status.qonto)}
          </div>
          {api.qontoBalance != null && (
            <div className="mt-2">
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(api.qontoBalance)}</p>
              <p className="text-xs text-slate-500 mt-0.5">Solde disponible</p>
            </div>
          )}
        </div>

        <div
          onClick={() => setActivePanel(activePanel === 'pennylane' ? null : 'pennylane')}
          className={`bg-white p-5 rounded-xl shadow-sm border cursor-pointer transition-all hover:shadow-md ${
            activePanel === 'pennylane' ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Pennylane</p>
                <p className="text-xs text-slate-500">Comptabilité</p>
              </div>
            </div>
            {getStatusDot(api.status.pennylane)}
          </div>
          {api.pennylaneInvoices.length > 0 && (
            <div className="mt-2">
              <p className="text-2xl font-bold text-slate-900">{api.pennylaneInvoices.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Factures récentes</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {activePanel && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              {activePanel === 'stripe' && <><CreditCard className="w-5 h-5 text-indigo-600" /> Stripe — Derniers paiements</>}
              {activePanel === 'qonto' && <><Building className="w-5 h-5 text-purple-600" /> Qonto — Dernières transactions</>}
              {activePanel === 'pennylane' && <><Wallet className="w-5 h-5 text-emerald-600" /> Pennylane — Factures clients</>}
            </h2>
            <div className="flex items-center gap-2">
              {api.lastSync && <span className="text-xs text-slate-400">Synchro: {api.lastSync.toLocaleTimeString('fr-FR')}</span>}
              <button onClick={() => setActivePanel(null)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>

            <div className="overflow-x-auto">
              {/* ── Stripe payments ── */}
              {activePanel === 'stripe' && (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 font-medium">ID</th>
                      <th className="px-5 py-3 font-medium">Description</th>
                      <th className="px-5 py-3 font-medium text-right">Montant</th>
                      <th className="px-5 py-3 font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {api.stripePayments.length === 0 && (
                      <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">Aucun paiement trouvé</td></tr>
                    )}
                    {api.stripePayments.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/80">
                        <td className="px-5 py-3 text-slate-600">{p.created}</td>
                        <td className="px-5 py-3 font-mono text-xs text-slate-500">{p.id.slice(0, 20)}…</td>
                        <td className="px-5 py-3 text-slate-900">{p.description || '—'}</td>
                        <td className="px-5 py-3 text-right font-semibold">{formatCurrency(p.amount)}</td>
                        <td className="px-5 py-3">{getPaymentStatusBadge(p.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* ── Qonto transactions ── */}
              {activePanel === 'qonto' && (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 font-medium">Libellé</th>
                      <th className="px-5 py-3 font-medium">Catégorie</th>
                      <th className="px-5 py-3 font-medium text-right">Montant</th>
                      <th className="px-5 py-3 font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {api.qontoTransactions.length === 0 && (
                      <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">Aucune transaction trouvée</td></tr>
                    )}
                    {api.qontoTransactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50/80">
                        <td className="px-5 py-3 text-slate-600">{tx.settled_at ? new Date(tx.settled_at).toLocaleDateString('fr-FR') : tx.emitted_at ? new Date(tx.emitted_at).toLocaleDateString('fr-FR') : '—'}</td>
                        <td className="px-5 py-3 text-slate-900 max-w-xs truncate">{tx.label || tx.counterparty || '—'}</td>
                        <td className="px-5 py-3 text-slate-500 text-xs">{tx.category || '—'}</td>
                        <td className={`px-5 py-3 text-right font-semibold ${tx.side === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {tx.side === 'credit' ? '+' : '−'}{tx.amount?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            tx.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                            tx.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-600'
                          }`}>{tx.status === 'completed' ? 'Confirmé' : tx.status === 'pending' ? 'En cours' : tx.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* ── Pennylane invoices ── */}
              {activePanel === 'pennylane' && (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3 font-medium">N° Facture</th>
                      <th className="px-5 py-3 font-medium">Client</th>
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 font-medium">Échéance</th>
                      <th className="px-5 py-3 font-medium text-right">Montant</th>
                      <th className="px-5 py-3 font-medium">Statut</th>
                      <th className="px-5 py-3 font-medium text-center">Document</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {api.pennylaneInvoices.length === 0 && (
                      <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-400">Aucune facture trouvée</td></tr>
                    )}
                    {api.pennylaneInvoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50/80">
                        <td className="px-5 py-3 font-mono text-xs text-slate-700">{inv.invoice_number || '—'}</td>
                        <td className="px-5 py-3 font-medium text-slate-900">{inv.customer || '—'}</td>
                        <td className="px-5 py-3 text-slate-600">{inv.date || '—'}</td>
                        <td className="px-5 py-3 text-slate-600">{inv.deadline || '—'}</td>
                        <td className="px-5 py-3 text-right font-semibold">{formatCurrency(inv.amount)}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            inv.paid ? 'bg-emerald-100 text-emerald-800' :
                            inv.remaining_amount > 0 ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-600'
                          }`}>{inv.paid ? 'Payée' : inv.remaining_amount > 0 ? `Reste ${formatCurrency(inv.remaining_amount)}` : inv.status}</span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {inv.file_url && (
                              <a href={inv.file_url} target="_blank" rel="noopener noreferrer" title="Télécharger PDF" className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors">
                                <FileText className="w-4 h-4" />
                              </a>
                            )}
                            {inv.public_url && (
                              <a href={inv.public_url} target="_blank" rel="noopener noreferrer" title="Voir en ligne" className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            {!inv.file_url && !inv.public_url && <span className="text-slate-300">—</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfig && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-slate-900">Configuration des Intégrations</h2>
              <button onClick={() => setShowConfig(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm flex items-start gap-3">
                <Lock className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Sécurité renforcée</p>
                  <p>Les clés API sont stockées dans le fichier <code className="bg-emerald-100 px-1 rounded">.env</code> côté serveur et ne transitent jamais par le navigateur.</p>
                </div>
              </div>

              {[
                { key: 'stripe', icon: CreditCard, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', label: 'Stripe', desc: 'Encaissement & paiements', envKeys: ['STRIPE_SECRET_KEY'] },
                { key: 'qonto', icon: Building, iconBg: 'bg-purple-100', iconColor: 'text-purple-600', label: 'Qonto', desc: 'Banque', envKeys: ['QONTO_API_KEY', 'QONTO_SLUG'] },
                { key: 'pennylane', icon: Wallet, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', label: 'Pennylane', desc: 'Comptabilité', envKeys: ['PENNYLANE_API_KEY'] },
              ].map(svc => (
                <div key={svc.key} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 ${svc.iconBg} ${svc.iconColor} rounded-lg`}>
                      <svc.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{svc.label} ({svc.desc})</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{svc.envKeys.map(k => <code key={k} className="bg-slate-100 px-1 rounded mr-1">{k}</code>)}</p>
                    </div>
                  </div>
                  {api.status[svc.key as keyof typeof api.status] ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-4 h-4 mr-1" /> Connecté</span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Non configuré</span>
                  )}
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-end">
              <button onClick={() => setShowConfig(false)} className="px-4 py-2 bg-brand-blue text-white font-medium rounded-lg hover:opacity-85 transition-all">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
