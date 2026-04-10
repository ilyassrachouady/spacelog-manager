import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Building2, TrendingUp, Euro, Activity, Percent } from 'lucide-react';
import { VatCorrection } from './VatCorrection';
import { SpacelogLogo } from './SpacelogLogo';
import { financialData, occupancyRates, realCashFlow2026, realRevenues2026, realExpenses2026, vatCredits2026 } from '../data';

const buildingData = [
  { name: 'Montigny', revenue: financialData.montigny.yearlyData.find(d => d.year === 2026)!.revenue, opex: financialData.montigny.yearlyData.find(d => d.year === 2026)!.expenses, margin: financialData.montigny.yearlyData.find(d => d.year === 2026)!.profit, occupancy: occupancyRates.montigny },
  { name: 'Boissy', revenue: financialData.boissy.yearlyData.find(d => d.year === 2026)!.revenue, opex: financialData.boissy.yearlyData.find(d => d.year === 2026)!.expenses, margin: financialData.boissy.yearlyData.find(d => d.year === 2026)!.profit, occupancy: occupancyRates.boissy },
  { name: 'Moussy', revenue: financialData.boissyExt.yearlyData.find(d => d.year === 2026)!.revenue, opex: financialData.boissyExt.yearlyData.find(d => d.year === 2026)!.expenses, margin: financialData.boissyExt.yearlyData.find(d => d.year === 2026)!.profit, occupancy: occupancyRates.boissyExt },
  { name: 'Trappes', revenue: financialData.batiment4.yearlyData.find(d => d.year === 2026)!.revenue, opex: financialData.batiment4.yearlyData.find(d => d.year === 2026)!.expenses, margin: financialData.batiment4.yearlyData.find(d => d.year === 2026)!.profit, occupancy: occupancyRates.batiment4 },
];

// Real cash flow data
let cumulativeBalance = 23309;
const cashFlowData = realCashFlow2026.consolidated
  .filter(c => c.reel !== null)
  .map((c, idx) => {
    const rev = realRevenues2026.consolidated[idx];
    const exp = realExpenses2026.consolidated[idx];
    const net = c.reel || 0;
    cumulativeBalance += net;
    const vatCredit = vatCredits2026[c.month] || 0;
    return {
      month: c.month,
      in: rev?.reel || 0,
      out: exp?.reel || 0,
      net,
      cumulative: cumulativeBalance,
      cumulativeWithVat: cumulativeBalance + vatCredit,
    };
  });

export function Dashboard() {
  const totalRevenue = buildingData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalOpex = buildingData.reduce((acc, curr) => acc + curr.opex, 0);
  const totalMargin = buildingData.reduce((acc, curr) => acc + curr.margin, 0);
  const marginPercent = totalRevenue > 0 ? ((totalMargin / totalRevenue) * 100).toFixed(1) : '0.0';
  const avgOccupancy = occupancyRates.consolidated;

  const rev2025 = financialData.consolidated.yearlyData.find(d => d.year === 2025)!;
  const rev2026 = financialData.consolidated.yearlyData.find(d => d.year === 2026)!;
  const revenueGrowth = ((rev2026.revenue - rev2025.revenue) / rev2025.revenue * 100).toFixed(1);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <SpacelogLogo className="h-16 w-auto" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Reporting Investisseurs 2026</h2>
          <p className="text-slate-500 mt-1">Analyse consolidée du portefeuille (4 Sites actifs)</p>
        </div>
        <div className="bg-amber-50 text-amber-800 px-4 py-2 rounded-md text-sm font-medium border border-amber-200">
          Exclusion appliquée : Spacelog 5 à 12
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Revenus Locatifs (2026)</CardTitle>
            <Euro className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">+{revenueGrowth}% vs 2025</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Charges d'Exploitation</CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalOpex)}</div>
            <p className="text-xs text-slate-500 mt-1">{totalRevenue > 0 ? ((totalOpex / totalRevenue) * 100).toFixed(1) : 0}% des revenus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Résultat Net</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalMargin >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>{formatCurrency(totalMargin)}</div>
            <p className="text-xs text-slate-500 mt-1">Marge : {marginPercent}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Taux d'Occupation</CardTitle>
            <Percent className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{avgOccupancy}%</div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
              <div className="bg-brand-blue rounded-full h-1.5" style={{ width: `${avgOccupancy}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Sites Actifs</CardTitle>
            <Building2 className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">4</div>
            <p className="text-xs text-slate-500 mt-1">Montigny, Boissy, Moussy, Trappes</p>
          </CardContent>
        </Card>
      </div>

      {/* VAT Correction Section */}
      <VatCorrection />

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Performance par Site (2026)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="revenue" name="Revenus" fill="#0014ff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="margin" name="Résultat Net" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Trésorerie Consolidée (2026)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="cumulativeWithVat" name="Trésorerie Globale (+ TVA)" stroke="#0014ff" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="cumulative" name="Solde Bancaire" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
