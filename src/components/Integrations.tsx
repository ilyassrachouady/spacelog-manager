import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  CreditCard, 
  Building, 
  FileSpreadsheet, 
  Wallet,
  TrendingUp,
  DollarSign,
  Settings,
  X,
  Lock
} from 'lucide-react';

const mockPipeline = [
  { id: 1, client: 'DIRECT ASSISTANCE', amount: 3400, chargebee: 'issued', stripe: 'paid', qonto: 'received', pennylane: 'reconciled' },
  { id: 2, client: 'KBE TECHNOLOGY', amount: 4600, chargebee: 'issued', stripe: 'paid', qonto: 'received', pennylane: 'reconciled' },
  { id: 3, client: 'ADF PLOMBERIE', amount: 2600, chargebee: 'issued', stripe: 'pending', qonto: 'pending', pennylane: 'pending' },
  { id: 4, client: 'AFAQ', amount: 2500, chargebee: 'issued', stripe: 'failed', qonto: 'pending', pennylane: 'pending' },
  { id: 5, client: 'EXCELLENCE RENOV', amount: 2200, chargebee: 'issued', stripe: 'paid', qonto: 'received', pennylane: 'to_reconcile' },
];

export default function Integrations() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showChargebeeTransactions, setShowChargebeeTransactions] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [lastSync, setLastSync] = useState('il y a 5 min');
  const [apiStatus, setApiStatus] = useState({
    chargebee: false,
    stripe: false,
    qonto: false,
    pennylane: false
  });

  const [chargebeeTransactions, setChargebeeTransactions] = useState<any[]>([]);
  const [chargebeeError, setChargebeeError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/integrations/status')
      .then(res => res.json())
      .then(data => setApiStatus(data))
      .catch(err => console.error('Failed to fetch API status:', err));
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/integrations/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setApiStatus(data.status);
        setLastSync('à l\'instant');
      }
    } catch (err) {
      console.error('Failed to sync:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOpenChargebee = async () => {
    setShowChargebeeTransactions(true);
    setIsLoadingTransactions(true);
    setChargebeeError(null);
    
    try {
      const res = await fetch('/api/integrations/chargebee/transactions');
      const data = await res.json();
      
      if (data.success) {
        setChargebeeTransactions(data.transactions);
      } else {
        setChargebeeError(data.error || "Erreur lors de la récupération des données");
        // Fallback to mock data if API fails (e.g., wrong site name or key)
        setChargebeeTransactions(mockChargebeeTransactions);
      }
    } catch (err) {
      console.error('Failed to fetch Chargebee transactions:', err);
      setChargebeeError("Erreur de connexion à l'API Chargebee");
      setChargebeeTransactions(mockChargebeeTransactions);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const mockChargebeeTransactions = [
    { id: 'inv_1001', date: '2026-03-23', client: 'DIRECT ASSISTANCE', amount: 3400, status: 'paid' },
    { id: 'inv_1002', date: '2026-03-22', client: 'KBE TECHNOLOGY', amount: 4600, status: 'paid' },
    { id: 'inv_1003', date: '2026-03-21', client: 'ADF PLOMBERIE', amount: 2600, status: 'pending' },
    { id: 'inv_1004', date: '2026-03-20', client: 'AFAQ', amount: 2500, status: 'failed' },
    { id: 'inv_1005', date: '2026-03-19', client: 'EXCELLENCE RENOV', amount: 2200, status: 'paid' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'issued':
      case 'paid':
      case 'received':
      case 'reconciled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-3 h-3 mr-1" /> OK</span>;
      case 'pending':
      case 'to_reconcile':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><RefreshCw className="w-3 h-3 mr-1" /> En cours</span>;
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" /> Échec</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cash & Intégrations</h1>
          <p className="text-slate-500 mt-1">Suivi de la trésorerie, rapprochement bancaire et état des API.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowConfig(true)}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurer les API
          </button>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Synchronisation...' : 'Synchroniser les données'}
          </button>
        </div>
      </div>

      {/* API Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div 
          onClick={handleOpenChargebee}
          className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between cursor-pointer hover:border-brand-blue hover:shadow-md transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Chargebee</p>
              <p className="text-xs text-slate-500">Facturation</p>
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${apiStatus.chargebee ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-slate-300'}`}></div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Stripe</p>
              <p className="text-xs text-slate-500">Encaissement</p>
            </div>
          </div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Qonto</p>
              <p className="text-xs text-slate-500">Banque</p>
            </div>
          </div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Pennylane</p>
              <p className="text-xs text-slate-500">Comptabilité</p>
            </div>
          </div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
        </div>
      </div>

      {/* Cash Flow & BP vs Actuals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">Trésorerie Disponible (Qonto)</h3>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">142 500 €</p>
          <div className="mt-2 flex items-center text-sm text-emerald-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+12% vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">Créances Clients (Stripe)</h3>
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">8 400 €</p>
          <div className="mt-2 flex items-center text-sm text-amber-600">
            <span>3 factures en attente</span>
          </div>
        </div>
      </div>

      {/* Pipeline de Lettrage */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Pipeline de Lettrage (Temps Réel)</h2>
          <span className="text-sm text-slate-500">Dernière synchro: {lastSync}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Montant</th>
                <th className="px-6 py-4 font-medium">Chargebee<br/><span className="text-xs font-normal">Facture émise</span></th>
                <th className="px-6 py-4 font-medium">Stripe<br/><span className="text-xs font-normal">Paiement client</span></th>
                <th className="px-6 py-4 font-medium">Qonto<br/><span className="text-xs font-normal">Virement reçu</span></th>
                <th className="px-6 py-4 font-medium">Pennylane<br/><span className="text-xs font-normal">Rapprochement</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockPipeline.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{row.client}</td>
                  <td className="px-6 py-4">{row.amount.toLocaleString()} €</td>
                  <td className="px-6 py-4">{getStatusBadge(row.chargebee)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <ArrowRight className="w-4 h-4 text-slate-300 mr-2" />
                      {getStatusBadge(row.stripe)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <ArrowRight className="w-4 h-4 text-slate-300 mr-2" />
                      {getStatusBadge(row.qonto)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <ArrowRight className="w-4 h-4 text-slate-300 mr-2" />
                      {getStatusBadge(row.pennylane)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Configuration Modal */}
      {showConfig && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-slate-900">Configuration des Intégrations</h2>
              <button 
                onClick={() => setShowConfig(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm leading-relaxed flex items-start gap-3">
                <Lock className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Sécurité renforcée activée</p>
                  <p>Vos clés API sont désormais gérées de manière sécurisée côté serveur via le menu "Secrets" de Google AI Studio. Elles ne transitent plus par le navigateur et ne sont pas visibles ici.</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Chargebee */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Chargebee (Facturation)</h3>
                      <p className="text-sm text-slate-500">Clés requises : <code className="bg-slate-100 px-1 rounded">CHARGEBEE_API_KEY</code> et <code className="bg-slate-100 px-1 rounded">CHARGEBEE_SITE</code></p>
                    </div>
                  </div>
                  <div>
                    {apiStatus.chargebee ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-4 h-4 mr-1" /> Connecté</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Non configuré</span>
                    )}
                  </div>
                </div>

                {/* Stripe */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Stripe (Encaissement)</h3>
                      <p className="text-sm text-slate-500">Clé secrète : <code className="bg-slate-100 px-1 rounded">STRIPE_SECRET_KEY</code></p>
                    </div>
                  </div>
                  <div>
                    {apiStatus.stripe ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-4 h-4 mr-1" /> Connecté</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Non configuré</span>
                    )}
                  </div>
                </div>

                {/* Qonto */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Qonto (Banque)</h3>
                      <p className="text-sm text-slate-500">Clé secrète : <code className="bg-slate-100 px-1 rounded">QONTO_API_KEY</code></p>
                    </div>
                  </div>
                  <div>
                    {apiStatus.qonto ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-4 h-4 mr-1" /> Connecté</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Non configuré</span>
                    )}
                  </div>
                </div>

                {/* Pennylane */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Pennylane (Comptabilité)</h3>
                      <p className="text-sm text-slate-500">Clé secrète : <code className="bg-slate-100 px-1 rounded">PENNYLANE_API_KEY</code></p>
                    </div>
                  </div>
                  <div>
                    {apiStatus.pennylane ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-4 h-4 mr-1" /> Connecté</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Non configuré</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
              <button 
                onClick={() => setShowConfig(false)}
                className="px-4 py-2 bg-brand-blue text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chargebee Transactions Modal */}
      {showChargebeeTransactions && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Dernières transactions Chargebee</h2>
                  <p className="text-sm text-slate-500">
                    {apiStatus.chargebee 
                      ? "Synchronisé en temps réel via l'API" 
                      : "Mode démo (Clé API non configurée)"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowChargebeeTransactions(false)} 
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {isLoadingTransactions ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <RefreshCw className="w-8 h-8 text-brand-blue animate-spin mb-4" />
                  <p className="text-slate-500">Récupération des transactions depuis Chargebee...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chargebeeError && (
                    <div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-sm flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold">Erreur de synchronisation</p>
                        <p>{chargebeeError}</p>
                        <p className="mt-2 text-xs opacity-90 bg-amber-100/50 p-2 rounded border border-amber-200">
                          <strong>Solution :</strong> Chargebee a besoin de 2 informations dans vos "Secrets" Google AI Studio :<br/>
                          1. <code>CHARGEBEE_API_KEY</code> (votre clé API)<br/>
                          2. <code>CHARGEBEE_SITE</code> (le nom de votre site, ex: si votre URL est <em>mon-entreprise.chargebee.com</em>, le site est <em>mon-entreprise</em>)
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 font-medium">Date</th>
                          <th className="px-6 py-4 font-medium">Facture</th>
                          <th className="px-6 py-4 font-medium">Client (ID)</th>
                          <th className="px-6 py-4 font-medium">Montant</th>
                          <th className="px-6 py-4 font-medium">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {chargebeeTransactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 text-slate-600">{tx.date}</td>
                            <td className="px-6 py-4 font-mono text-slate-500">{tx.id}</td>
                            <td className="px-6 py-4 font-medium text-slate-900">{tx.client}</td>
                            <td className="px-6 py-4 font-medium">{tx.amount.toLocaleString()} €</td>
                            <td className="px-6 py-4">
                              {(tx.status === 'paid' || tx.status === 'payment_due') && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Payée</span>}
                              {tx.status === 'pending' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">En attente</span>}
                              {tx.status === 'failed' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800">Échouée</span>}
                              {tx.status !== 'paid' && tx.status !== 'payment_due' && tx.status !== 'pending' && tx.status !== 'failed' && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{tx.status}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                        {chargebeeTransactions.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                              Aucune transaction trouvée sur ce compte Chargebee.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
