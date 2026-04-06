import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Building2, Globe, Download, FileSpreadsheet, Calculator, Presentation } from 'lucide-react';
import { financialData, buildingsList } from '../data';
import InvestorUploader from './InvestorUploader';

const COLORS = ['#0ea5e9', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#64748b', '#cbd5e1'];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function FinancialReporting() {
  const [viewMode, setViewMode] = useState<'projections' | 'investor'>('investor');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedBuilding, setSelectedBuilding] = useState<keyof typeof financialData>('consolidated');
  
  const [isInvestorModalOpen, setIsInvestorModalOpen] = useState(false);
  const [investorData, setInvestorData] = useState<any>(null);

  const currentBuildingData = financialData[selectedBuilding];
  const currentYearData = currentBuildingData.yearlyData.find(d => d.year === selectedYear) || currentBuildingData.yearlyData[0];
  const currentExpenses = (currentBuildingData.expenseBreakdown as any)[selectedYear] || [];
  const margin = currentYearData.revenue > 0 ? ((currentYearData.profit / currentYearData.revenue) * 100).toFixed(1) : '0.0';
  
  const handleInvestorDataExtracted = (data: any) => {
    setInvestorData(data);
    setViewMode('investor');
  };

  const handleDownloadCSV = () => {
    const headers = ['Année', 'Chiffre d\'Affaires', 'Charges', 'Bénéfice Net'];
    const rows = currentBuildingData.yearlyData.map(d => [
      d.year,
      d.revenue,
      d.expenses,
      d.profit
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reporting_${selectedBuilding}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderInvestorView = () => {
    if (!investorData) {
      return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <Presentation className="w-16 h-16 text-indigo-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Analyse Investisseur 2024 vs 2025</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Importez vos bilans, comptes de résultat (PDF) ou balances comptables de 2024 et 2025 pour générer automatiquement un comparatif et une synthèse pour vos investisseurs.
          </p>
          <button
            onClick={() => setIsInvestorModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <FileSpreadsheet size={20} />
            Importer les documents 2024 et 2025
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden text-white">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Presentation className="text-indigo-400" />
              Executive Summary (2024 vs 2025)
            </h2>
          </div>
          <div className="p-6">
            <p className="text-lg leading-relaxed text-indigo-50">
              {investorData.analysis}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Comparatif Détaillé Ligne par Ligne</h2>
              <p className="text-sm text-slate-500 mt-1">Évolution entre 2024 et 2025</p>
            </div>
            <button
              onClick={() => setIsInvestorModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
            >
              <FileSpreadsheet size={16} />
              Mettre à jour
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Catégorie</th>
                  <th className="px-6 py-4 font-medium text-right">Année 2024</th>
                  <th className="px-6 py-4 font-medium text-right">Année 2025</th>
                  <th className="px-6 py-4 font-medium text-right">Évolution (€)</th>
                  <th className="px-6 py-4 font-medium text-right">Évolution (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {investorData.comparison.map((row: any, idx: number) => {
                  const diff = row.year2025 - row.year2024;
                  const percent = row.year2024 !== 0 ? (diff / Math.abs(row.year2024)) * 100 : 0;
                  const isPositive = diff > 0;
                  
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{row.category}</td>
                      <td className="px-6 py-4 text-right text-slate-600">{formatCurrency(row.year2024)}</td>
                      <td className="px-6 py-4 text-right text-slate-900 font-medium">{formatCurrency(row.year2025)}</td>
                      <td className={`px-6 py-4 text-right font-medium ${isPositive ? 'text-emerald-600' : diff < 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                        {isPositive ? '+' : ''}{formatCurrency(diff)}
                      </td>
                      <td className={`px-6 py-4 text-right font-medium ${isPositive ? 'text-emerald-600' : diff < 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                        {isPositive ? '+' : ''}{percent.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {isInvestorModalOpen && (
        <InvestorUploader 
          onClose={() => setIsInvestorModalOpen(false)} 
          onDataExtracted={handleInvestorDataExtracted} 
        />
      )}
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-indigo-600" />
            Reporting Financier
          </h1>
          <p className="text-slate-500 mt-1">Analyse des performances et suivi budgétaire</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('investor')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                viewMode === 'investor' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Presentation size={16} />
              Investisseur
            </button>
            <button
              onClick={() => setViewMode('projections')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'projections' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Projections Annuelles
            </button>
          </div>
        </div>
      </header>

      {/* Building Selector */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {buildingsList.map(b => (
          <button
            key={b.id}
            onClick={() => setSelectedBuilding(b.id as keyof typeof financialData)}
            className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              selectedBuilding === b.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {b.id === 'consolidated' ? <Globe size={16} /> : <Building2 size={16} />}
            {b.name}
          </button>
        ))}
      </div>

      {viewMode === 'investor' ? (
        renderInvestorView()
      ) : (
        <>
          {/* Projections View */}
          <div className="flex justify-end">
            <div className="flex items-center gap-4">
              <button
                onClick={handleDownloadCSV}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Télécharger CSV</span>
              </button>
              
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                {financialData.consolidated.yearlyData.map((d) => (
                  <button
                    key={d.year}
                    onClick={() => setSelectedYear(d.year)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      selectedYear === d.year 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {d.year}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Chiffre d'Affaires</p>
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p className="text-3xl font-light mt-4 text-slate-900">{formatCurrency(currentYearData.revenue)}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Charges Totales</p>
                <div className="p-2 bg-rose-50 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-rose-600" />
                </div>
              </div>
              <p className="text-3xl font-light mt-4 text-slate-900">{formatCurrency(currentYearData.expenses)}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Bénéfice Net</p>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-light mt-4 text-slate-900">{formatCurrency(currentYearData.profit)}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Marge Nette</p>
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Activity className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <p className="text-3xl font-light mt-4 text-slate-900">{margin}%</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Bar Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
              <h2 className="text-lg font-medium text-slate-900 mb-6">Évolution CA vs Charges (2025-2033)</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentBuildingData.yearlyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="year" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="revenue" name="Chiffre d'Affaires" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="expenses" name="Charges" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-medium text-slate-900 mb-6">Répartition des Charges ({selectedYear})</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={currentExpenses}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {currentExpenses.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-3">
                {currentExpenses.map((expense: any, index: number) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-slate-600">{expense.name}</span>
                    </div>
                    <span className="font-medium text-slate-900">{formatCurrency(expense.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
