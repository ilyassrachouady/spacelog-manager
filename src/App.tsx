import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import Overview from './components/Overview';
import Inventory from './components/Inventory';
import FinancialReporting from './components/FinancialReporting';
import Billing from './components/Billing';
import Clients from './components/Clients';
import ExpensesVsBudget from './components/ExpensesVsBudget';
import MonthlyTracking from './components/MonthlyTracking';
import ForecastCash from './components/ForecastCash';
import Integrations from './components/Integrations';
import Drive from './components/Drive';
import { useApi } from './ApiContext';
import { SpacelogLogo } from './components/SpacelogLogo';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { ScrollArea } from './components/ui/scroll-area';
import { Separator } from './components/ui/separator';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './components/ui/tooltip';
import {
  LayoutDashboard, FileSpreadsheet, LogOut, Package, PieChart, Receipt,
  Users, Calculator, Calendar, Link, HardDrive, Building2, ChevronLeft,
  ChevronRight, Bell, Menu, X, TrendingUp,
} from 'lucide-react';

const tabs = [
  { id: 'dashboard', name: 'Tableau de Bord', icon: LayoutDashboard, description: 'Vue d\'ensemble de votre activité' },
  { id: 'inventory', name: 'Inventaire', icon: Package, description: 'Cellules & sites' },
  { id: 'clients', name: 'Clients', icon: Users, description: 'Contrats & locataires' },
  { id: 'billing', name: 'Facturation', icon: Receipt, description: 'Factures & paiements' },
  { id: 'expenses', name: 'Dépenses', icon: Calculator, description: 'Suivi budgétaire' },
  { id: 'monthly', name: 'Suivi Mensuel', icon: Calendar, description: 'P&L mensuel' },
  { id: 'forecast', name: 'Prev & Cash', icon: TrendingUp, description: 'Prévisionnel & Trésorerie' },
  { id: 'reporting', name: 'Reporting', icon: PieChart, description: 'Reporting financier' },
  { id: 'investors', name: 'Investisseurs', icon: Building2, description: 'Reporting investisseurs' },
  { id: 'integrations', name: 'Intégrations', icon: Link, description: 'APIs & connexions' },
  { id: 'drive', name: 'Documents', icon: HardDrive, description: 'Fichiers & stockage' },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { refresh } = useApi();

  // Re-fetch all API data on every tab change so data is always current
  useEffect(() => { refresh(); }, [activeTab]);

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
      case 'dashboard':
        return <Overview />;
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
      case 'forecast':
        return <ForecastCash />;
      case 'integrations':
        return <Integrations />;
      case 'drive':
        return <Drive />;
      default:
        return <Overview />;
    }
  };

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            ${sidebarCollapsed ? 'w-[68px]' : 'w-[232px]'}
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            fixed lg:relative z-50 flex flex-col shrink-0 h-full
            bg-white/80 backdrop-blur-xl border-r border-slate-200/70
            transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
          `}
          role="navigation"
          aria-label="Menu principal"
        >
          {/* Logo area */}
          <div className={`h-14 flex items-center ${sidebarCollapsed ? 'justify-center px-3' : 'px-5'} border-b border-slate-100/80`}>
            {sidebarCollapsed ? (
              <SpacelogLogo className="h-7 w-auto" />
            ) : (
              <SpacelogLogo className="h-7 w-auto" />
            )}
            {/* Mobile close */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden ml-auto p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-3">
            <nav className={`${sidebarCollapsed ? 'px-2' : 'px-3'} space-y-0.5`}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const navButton = (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : ''} gap-2.5 ${sidebarCollapsed ? 'p-2' : 'px-2.5 py-[7px]'} rounded-lg text-[13px] font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/10'
                        : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-700'
                    }`}
                  >
                    <Icon className={`h-[17px] w-[17px] shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {!sidebarCollapsed && <span className="truncate">{tab.name}</span>}
                  </button>
                );

                return sidebarCollapsed ? (
                  <Tooltip key={tab.id} delayDuration={0}>
                    <TooltipTrigger asChild>{navButton}</TooltipTrigger>
                    <TooltipContent side="right" className="font-medium text-xs">{tab.name}</TooltipContent>
                  </Tooltip>
                ) : (
                  <React.Fragment key={tab.id}>{navButton}</React.Fragment>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Collapse toggle */}
          <div className="p-2.5 border-t border-slate-100/80 hidden lg:block">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 transition-colors"
              aria-label={sidebarCollapsed ? 'Élargir la barre latérale' : 'Réduire la barre latérale'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <>
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Réduire</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top bar */}
          <header className="h-14 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-4 lg:px-6 shrink-0">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 -ml-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Ouvrir le menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <h1 className="text-[15px] font-semibold text-slate-900 leading-tight tracking-tight">
                  {currentTab?.name}
                </h1>
                <p className="text-[12px] text-slate-400 hidden sm:block leading-tight mt-0.5">{currentTab?.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {activeTab === 'investors' && isDataLoaded && (
                <>
                  <Badge variant="secondary" className="hidden md:flex gap-1.5 text-xs">
                    <FileSpreadsheet className="h-3 w-3" />
                    <span className="truncate max-w-[140px]">{fileName}</span>
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5 text-xs">
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Nouveau</span>
                  </Button>
                  <Separator orientation="vertical" className="h-5 mx-1" />
                </>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="relative p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="h-[18px] w-[18px]" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-pink rounded-full ring-2 ring-white" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-[#f8f9fb]" role="main">
            <div className="max-w-[1360px] mx-auto px-4 py-5 lg:px-8 lg:py-6">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;
