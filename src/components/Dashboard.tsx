import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Building2, TrendingUp, Euro, Activity } from 'lucide-react';
import { VatCorrection } from './VatCorrection';
import { SpacelogLogo } from './SpacelogLogo';

// Mock data for the dashboard (representing the 4 buildings, excluding Spacelog 5-12)
const buildingData = [
  { name: 'Bâtiment Alpha', revenue: 450000, opex: 120000, margin: 330000 },
  { name: 'Bâtiment Beta', revenue: 380000, opex: 95000, margin: 285000 },
  { name: 'Bâtiment Gamma', revenue: 520000, opex: 140000, margin: 380000 },
  { name: 'Bâtiment Delta', revenue: 290000, opex: 80000, margin: 210000 },
];

const cashFlowData = [
  { month: 'Jan', in: 135000, out: 85000, net: 50000, cumulative: 50000 },
  { month: 'Fév', in: 140000, out: 90000, net: 50000, cumulative: 100000 },
  { month: 'Mar', in: 138000, out: 88000, net: 50000, cumulative: 150000 },
  { month: 'Avr', in: 145000, out: 92000, net: 53000, cumulative: 203000 },
  { month: 'Mai', in: 142000, out: 89000, net: 53000, cumulative: 256000 },
  { month: 'Juin', in: 150000, out: 95000, net: 55000, cumulative: 311000 },
];

export function Dashboard() {
  const totalRevenue = buildingData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalOpex = buildingData.reduce((acc, curr) => acc + curr.opex, 0);
  const totalMargin = buildingData.reduce((acc, curr) => acc + curr.margin, 0);
  const marginPercent = ((totalMargin / totalRevenue) * 100).toFixed(1);

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
          <p className="text-slate-500 mt-1">Analyse consolidée du portefeuille (4 Bâtiments actifs)</p>
        </div>
        <div className="bg-amber-50 text-amber-800 px-4 py-2 rounded-md text-sm font-medium border border-amber-200">
          Exclusion appliquée : Spacelog 5 à 12
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Revenus Locatifs (2026)</CardTitle>
            <Euro className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">+4.2% vs 2025</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Charges d'Exploitation (OPEX)</CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalOpex)}</div>
            <p className="text-xs text-slate-500 mt-1">26.5% des revenus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Marge Nette (NOI)</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalMargin)}</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">Marge : {marginPercent}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Bâtiments Actifs</CardTitle>
            <Building2 className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">4</div>
            <p className="text-xs text-slate-500 mt-1">Périmètre restreint</p>
          </CardContent>
        </Card>
      </div>

      {/* VAT Correction Section */}
      <VatCorrection />

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Performance par Bâtiment (2026)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="revenue" name="Revenus" fill="#0f172a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="margin" name="Marge Nette" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Projection de Trésorerie Cumulée (S1 2026)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="cumulative" name="Trésorerie Cumulée" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="net" name="Flux Net Mensuel" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
