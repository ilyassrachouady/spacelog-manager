import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area
} from 'recharts';
import { UploadCloud, Wallet, Building2, TrendingUp, TrendingDown, CheckCircle2, AlertCircle, Euro, Landmark } from 'lucide-react';
import { buildingsList, realRevenues2026, realExpenses2026, debtService2026, realCashFlow2026, vatCredits2026 } from '../data';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function MonthlyTracking() {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('consolidated');
  const [bankPositions, setBankPositions] = useState({ bnp: '', sg: '', caisseEpargne: '' });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      // Simulate upload and processing
      setTimeout(() => {
        setIsUploading(false);
        alert("Fichier Excel importé avec succès ! (Ceci est une maquette d'intégration)");
      }, 1500);
    }
  };

  const handleSaveBankPositions = () => {
    alert("Positions bancaires enregistrées pour la fin du mois ! (Ceci est une maquette)");
  };

  // Prepare data for the selected building
  const revenues = realRevenues2026[selectedBuilding as keyof typeof realRevenues2026];
  const expenses = realExpenses2026[selectedBuilding as keyof typeof realExpenses2026];

  const monthlyData = revenues.map((rev, index) => {
    const exp = expenses[index];
    return {
      month: rev.month,
      prevCA: rev.bp,
      realCA: rev.reel,
      prevCharges: exp.bp,
      realCharges: exp.reel
    };
  });

  // Calculate Cash Flow Balances
  const cashFlows = realCashFlow2026[selectedBuilding as keyof typeof realCashFlow2026];
  let currentBalance = selectedBuilding === 'consolidated' ? 23309 : 0;
  const cashFlowDataWithBalances = cashFlows.filter(c => c.reel !== null).map(c => {
    const start = currentBalance;
    const flow = c.reel || 0;
    const end = start + flow;
    currentBalance = end;
    return {
      month: c.month,
      start,
      flow,
      end
    };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 flex items-center gap-3">
          <Wallet className="w-8 h-8 text-indigo-600" />
          Pilotage Mensuel & Trésorerie
        </h1>
        <p className="text-slate-500 mt-1">Suivi du Réel vs Prévisionnel et positions bancaires</p>
      </header>

      {/* SECTION 1: COMPTABILITÉ (RÉEL VS PRÉVISIONNEL) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">1. Comptabilité Mensuelle</h2>
          
          {/* Building Selector */}
          <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
            {buildingsList.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBuilding(b.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedBuilding === b.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Import Zone */}
          <div 
            className="bg-white rounded-2xl p-6 shadow-sm border-2 border-dashed border-slate-300 flex flex-col justify-center items-center text-center hover:bg-slate-50 transition-colors cursor-pointer relative"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                setIsUploading(true);
                setTimeout(() => {
                  setIsUploading(false);
                  alert("Fichier Excel importé avec succès ! (Ceci est une maquette d'intégration)");
                }, 1500);
              }
            }}
          >
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
            />
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Importer vos données</h3>
            <p className="text-sm text-slate-500 mb-4">
              Glissez-déposez votre fichier Excel (Compta & Tréso) ici, ou cliquez pour parcourir.
            </p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              {isUploading ? 'Analyse en cours...' : 'Sélectionner un fichier'}
            </button>
          </div>

          {/* Compte de Résultat Flash */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 lg:col-span-2 overflow-x-auto">
            <h3 className="text-base font-medium text-slate-900 mb-6">Compte de Résultat Flash : {buildingsList.find(b => b.id === selectedBuilding)?.name}</h3>
            
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="pb-3 text-sm font-semibold text-slate-500 border-b border-slate-200">Indicateur</th>
                  {monthlyData.filter(d => d.realCA !== null).map(m => (
                    <th key={m.month} className="pb-3 text-sm font-semibold text-slate-500 border-b border-slate-200 text-right">{m.month}</th>
                  ))}
                  <th className="pb-3 text-sm font-semibold text-slate-500 border-b border-slate-200 text-right">Total YTD</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {/* Revenues */}
                <tr className="border-b border-slate-100">
                  <td className="py-4 font-medium text-slate-900">Chiffre d'Affaires (Revenus)</td>
                  {monthlyData.filter(d => d.realCA !== null).map(m => (
                    <td key={m.month} className="py-4 text-right text-slate-600">{formatCurrency(m.realCA || 0)}</td>
                  ))}
                  <td className="py-4 text-right font-semibold text-slate-900">
                    {formatCurrency(monthlyData.reduce((acc, curr) => acc + (curr.realCA || 0), 0))}
                  </td>
                </tr>
                
                {/* Expenses */}
                <tr className="border-b border-slate-100">
                  <td className="py-4 font-medium text-slate-900">Charges d'Exploitation</td>
                  {monthlyData.filter(d => d.realCA !== null).map(m => (
                    <td key={m.month} className="py-4 text-right text-slate-600">{formatCurrency(m.realCharges || 0)}</td>
                  ))}
                  <td className="py-4 text-right font-semibold text-slate-900">
                    {formatCurrency(monthlyData.reduce((acc, curr) => acc + (curr.realCharges || 0), 0))}
                  </td>
                </tr>

                {/* EBITDA */}
                <tr className="bg-indigo-50/50 border-b border-indigo-100">
                  <td className="py-4 font-bold text-indigo-900 pl-2 rounded-l-lg">Marge Opérationnelle (EBITDA)</td>
                  {monthlyData.filter(d => d.realCA !== null).map(m => (
                    <td key={m.month} className="py-4 text-right font-semibold text-indigo-900">
                      {formatCurrency((m.realCA || 0) - (m.realCharges || 0))}
                    </td>
                  ))}
                  <td className="py-4 text-right font-bold text-indigo-900 pr-2 rounded-r-lg">
                    {formatCurrency(
                      monthlyData.reduce((acc, curr) => acc + (curr.realCA || 0), 0) - 
                      monthlyData.reduce((acc, curr) => acc + (curr.realCharges || 0), 0)
                    )}
                  </td>
                </tr>

                {/* Debt */}
                <tr className="border-b border-slate-100">
                  <td className="py-4 font-medium text-slate-900">Emprunt bancaire</td>
                  {monthlyData.filter(d => d.realCA !== null).map(m => (
                    <td key={m.month} className="py-4 text-right text-slate-600">
                      {formatCurrency(debtService2026[selectedBuilding as keyof typeof debtService2026])}
                    </td>
                  ))}
                  <td className="py-4 text-right font-semibold text-slate-900">
                    {formatCurrency(
                      monthlyData.filter(d => d.realCA !== null).length * debtService2026[selectedBuilding as keyof typeof debtService2026]
                    )}
                  </td>
                </tr>

                {/* Free Cash Flow */}
                <tr className="bg-emerald-50/50">
                  <td className="py-4 font-bold text-emerald-900 pl-2 rounded-l-lg">Cash-Flow Net</td>
                  {monthlyData.filter(d => d.realCA !== null).map(m => {
                    const ebitda = (m.realCA || 0) - (m.realCharges || 0);
                    const debt = debtService2026[selectedBuilding as keyof typeof debtService2026];
                    return (
                      <td key={m.month} className="py-4 text-right font-semibold text-emerald-900">
                        {formatCurrency(ebitda - debt)}
                      </td>
                    );
                  })}
                  <td className="py-4 text-right font-bold text-emerald-900 pr-2 rounded-r-lg">
                    {formatCurrency(
                      (monthlyData.reduce((acc, curr) => acc + (curr.realCA || 0), 0) - 
                      monthlyData.reduce((acc, curr) => acc + (curr.realCharges || 0), 0)) - 
                      (monthlyData.filter(d => d.realCA !== null).length * debtService2026[selectedBuilding as keyof typeof debtService2026])
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* SECTION 2: TRÉSORERIE (CASH FLOW) */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-800">2. Trésorerie Consolidée (Cash-Flow)</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Saisie des positions bancaires */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-base font-medium text-slate-900 mb-4 flex items-center gap-2">
              <Euro className="w-5 h-5 text-slate-500" />
              Positions Bancaires (Fin de mois)
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">BNP Paribas</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="Ex: 45000"
                    className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={bankPositions.bnp}
                    onChange={(e) => setBankPositions({...bankPositions, bnp: e.target.value})}
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400">€</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Société Générale</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="Ex: 82000"
                    className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={bankPositions.sg}
                    onChange={(e) => setBankPositions({...bankPositions, sg: e.target.value})}
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400">€</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Caisse d'Épargne</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="Ex: 45000"
                    className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={bankPositions.caisseEpargne}
                    onChange={(e) => setBankPositions({...bankPositions, caisseEpargne: e.target.value})}
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400">€</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button 
                  onClick={handleSaveBankPositions}
                  className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors"
                >
                  Enregistrer les soldes
                </button>
              </div>
            </div>
            
            {/* Info TVA -> Crédit de TVA */}
            <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <h4 className="text-sm font-medium text-indigo-900 mb-3 flex items-center gap-2">
                <Landmark className="w-4 h-4" />
                Trésorerie Latente (État)
              </h4>
              <div>
                <p className="text-sm font-medium text-indigo-800 mb-2">Crédits de TVA reportés :</p>
                <ul className="space-y-1 text-sm text-indigo-700 mb-3">
                  <li className="flex justify-between"><span>Janvier :</span> <span className="font-semibold">46 431 €</span></li>
                  <li className="flex justify-between"><span>Février :</span> <span className="font-semibold">33 259 €</span></li>
                  <li className="flex justify-between"><span>Mars (est.) :</span> <span className="font-semibold">55 766 €</span></li>
                </ul>
                <p className="text-xs text-indigo-600 leading-relaxed border-t border-indigo-100 pt-2">
                  Ces crédits agissent comme une trésorerie virtuelle. Ils viendront compenser vos futures TVA à décaisser et augmentent votre trésorerie globale.
                </p>
              </div>
            </div>
          </div>

          {/* Tableau Cash Flow */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 lg:col-span-2 overflow-x-auto">
            <h3 className="text-base font-medium text-slate-900 mb-6">Évolution de la Trésorerie : {buildingsList.find(b => b.id === selectedBuilding)?.name}</h3>
            
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="pb-3 text-sm font-semibold text-slate-500 border-b border-slate-200">Indicateur</th>
                  {cashFlowDataWithBalances.map(m => (
                    <th key={m.month} className="pb-3 text-sm font-semibold text-slate-500 border-b border-slate-200 text-right">{m.month}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-slate-100">
                  <td className="py-4 font-medium text-slate-900">
                    Solde d'ouverture (Début de mois)
                    {selectedBuilding !== 'consolidated' && <span className="text-xs text-slate-400 ml-1">*</span>}
                  </td>
                  {cashFlowDataWithBalances.map(m => (
                    <td key={m.month} className="py-4 text-right text-slate-600">{formatCurrency(m.start)}</td>
                  ))}
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-4 font-medium text-slate-900">Flux de trésorerie net (Free Cash Flow)</td>
                  {cashFlowDataWithBalances.map(m => (
                    <td key={m.month} className={`py-4 text-right font-medium ${m.flow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {m.flow > 0 ? '+' : ''}{formatCurrency(m.flow)}
                    </td>
                  ))}
                </tr>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <td className="py-4 font-bold text-slate-900 pl-2 rounded-l-lg">Solde de clôture (Banque)</td>
                  {cashFlowDataWithBalances.map(m => (
                    <td key={m.month} className="py-4 text-right font-bold text-slate-900 pr-2 rounded-r-lg">
                      {formatCurrency(m.end)}
                    </td>
                  ))}
                </tr>
                <tr className="bg-indigo-50/30 border-b border-indigo-100">
                  <td className="py-4 font-medium text-indigo-900 pl-2">
                    + Crédit de TVA (Trésorerie latente)
                  </td>
                  {cashFlowDataWithBalances.map(m => {
                    // Import vatCredits2026 at the top of the file to use it here
                    // We only show VAT credit for consolidated view to avoid double counting if looking at specific buildings
                    const vatAmount = selectedBuilding === 'consolidated' ? (vatCredits2026[m.month] || 0) : 0;
                    return (
                      <td key={m.month} className="py-4 text-right text-indigo-700">
                        {selectedBuilding === 'consolidated' ? formatCurrency(vatAmount) : '-'}
                      </td>
                    );
                  })}
                </tr>
                <tr className="bg-slate-900 text-white">
                  <td className="py-4 font-bold pl-2 rounded-l-lg">Trésorerie Globale (Banque + TVA)</td>
                  {cashFlowDataWithBalances.map(m => {
                    const vatAmount = selectedBuilding === 'consolidated' ? (vatCredits2026[m.month] || 0) : 0;
                    return (
                      <td key={m.month} className="py-4 text-right font-bold pr-2 rounded-r-lg">
                        {selectedBuilding === 'consolidated' ? formatCurrency(m.end + vatAmount) : formatCurrency(m.end)}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
            
            {selectedBuilding !== 'consolidated' && (
              <p className="text-xs text-slate-500 mt-4 italic">
                * Le solde bancaire initial au 01/01/2026 n'est connu qu'au niveau consolidé (+23 309 €). Pour les sites individuels, le solde affiché représente la trésorerie générée depuis le 1er janvier.
              </p>
            )}
            {selectedBuilding === 'consolidated' && (
              <p className="text-xs text-slate-500 mt-4 italic">
                * Le solde d'ouverture de Janvier inclut la position bancaire initiale de +23 309 € au 01/01/2026.
              </p>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
