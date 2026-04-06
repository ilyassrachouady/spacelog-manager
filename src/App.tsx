import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import Inventory from './components/Inventory';
import FinancialReporting from './components/FinancialReporting';
import Billing from './components/Billing';
import Clients from './components/Clients';
import ExpensesVsBudget from './components/ExpensesVsBudget';
import MonthlyTracking from './components/MonthlyTracking';
import Integrations from './components/Integrations';
import Drive from './components/Drive';
import { SpacelogLogo } from './components/SpacelogLogo';
import { LayoutDashboard, FileSpreadsheet, LogOut, Package, PieChart, Receipt, Users, Calculator, Calendar, Link, HardDrive, Building2 } from 'lucide-react';

const tabs = [
  { id: 'investors', name: 'Reporting Investisseurs', icon: Building2 },
  { id: 'inventory', name: 'Inventaire', icon: Package },
  { id: 'reporting', name: 'Reporting Financier', icon: PieChart },
  { id: 'billing', name: 'Facturation', icon: Receipt },
  { id: 'clients', name: 'Clients', icon: Users },
  { id: 'expenses', name: 'Dépenses vs Budget', icon: Calculator },
  { id: 'monthly', name: 'Suivi Mensuel', icon: Calendar },
  { id: 'integrations', name: 'Intégrations', icon: Link },
  { id: 'drive', name: 'Drive', icon: HardDrive },
];

function App() {
  const [activeTab, setActiveTab] = useState('investors');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDataLoaded = (data: any) => {
    setIsDataLoaded(true);
    if (data.fileName) {
      setFileName(data.fileName);
    } else {
      setFileName("Données de démonstration");
    }
  };

  const handleReset = () => {
    setIsDataLoaded(false);
    setFileName(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'investors':
        return !isDataLoaded ? (
          <FileUpload onDataLoaded={handleDataLoaded} />
        ) : (
          <Dashboard />
        );
      case 'inventory':
        return <Inventory />;
      case 'reporting':
        return <FinancialReporting />;
      case 'billing':
        return <Billing />;
      case 'clients':
        return <Clients />;
      case 'expenses':
        return <ExpensesVsBudget />;
      case 'monthly':
        return <MonthlyTracking />;
      case 'integrations':
        return <Integrations />;
      case 'drive':
        return <Drive />;
      default:
        return <Inventory />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="h-20 flex items-center justify-center px-6 bg-white border-b border-slate-200">
          <SpacelogLogo className="h-14 w-auto" />
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-semibold text-slate-800">
            {tabs.find(t => t.id === activeTab)?.name}
          </h1>
          
          {activeTab === 'investors' && isDataLoaded && (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                <FileSpreadsheet className="h-4 w-4" />
                <span className="truncate max-w-[200px]">{fileName}</span>
              </div>
              <button 
                onClick={handleReset}
                className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Nouveau fichier</span>
              </button>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
