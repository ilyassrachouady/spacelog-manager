import React, { useState } from 'react';
import { Plus, Search, Filter, MapPin } from 'lucide-react';

// Data based on the provided PDF
const sites = [
  {
    id: 'montigny',
    name: 'Site Montigny',
    totalRevenue: 54385,
    capacity: 15,
    capacityText: '15 cellules',
    isUnderConstruction: false,
    cells: [
      { id: 'M01', name: 'Cellule 1', price: 2500, status: 'occupied', client: 'KBE TECHNOLOGY' },
      { id: 'M02', name: 'Cellule 2', price: 2500, status: 'occupied', client: 'SOLAROCK' },
      { id: 'M03', name: 'Cellule 3', price: 2100, status: 'occupied', client: 'KOUASSI ASSIENIN - EMITEL MARKET' },
      { id: 'M04', name: 'Cellule 4', price: 1800, status: 'occupied', client: 'PIC REFRIGERATION' },
      { id: 'M05', name: 'Cellule 5', price: 2340, status: 'occupied', client: 'OZ DISTRIBUTION' },
      { id: 'M06', name: 'Cellule 6', price: 1925, status: 'occupied', client: 'SOGBADJI COMLAN' },
      { id: 'M07', name: 'Cellule 7', price: 2300, status: 'occupied', client: 'AFAQ' },
      { id: 'M08', name: 'Cellule 8', price: 2600, status: 'occupied', client: 'ADF PLOMBERIE' },
      { id: 'M09', name: 'Cellule 9', price: 2100, status: 'occupied', client: 'KBE TECHNOLOGY' },
      { id: 'M10', name: 'Cellule 10', price: 2100, status: 'occupied', client: 'SEMO SERTVICE' },
      { id: 'M11', name: 'Cellule 11', price: 2070, status: 'occupied', client: 'VOLTPOWER' },
      { id: 'M12', name: 'Cellule 12', price: 2210, status: 'occupied', client: 'ID SOL' },
      { id: 'M13', name: 'Cellule 13', price: 2100, status: 'occupied', client: 'ABBYNAYA EXOTIQUE' },
      { id: 'M14', name: 'Cellule 14', price: 2040, status: 'occupied', client: 'JOLIZ' },
      { id: 'M15', name: 'Cellule 15', price: 2200, status: 'occupied', client: 'N ET RENOVATION' },
      { id: 'M-DEP', name: 'Depot', price: 21250, status: 'occupied', client: 'WOODSTOCK TRADING' },
      { id: 'M-BUR', name: 'Bureau 5', price: 250, status: 'occupied', client: 'ADF PLOMBERIE' },
    ]
  },
  {
    id: 'boissy',
    name: 'Site Boissy',
    totalRevenue: 33100,
    capacity: 19,
    capacityText: '19 cellules',
    isUnderConstruction: false,
    cells: [
      { id: 'B01', name: 'Cellule 1', price: 1800, status: 'occupied', client: 'BEN HADEF ZIED' },
      { id: 'B02', name: 'Cellule 2', price: 1700, status: 'occupied', client: 'KOUS PRODUCTION' },
      { id: 'B03', name: 'Cellule 3', price: 1700, status: 'occupied', client: 'VERNOVA FRANCE' },
      { id: 'B04', name: 'Cellule 4', price: 1800, status: 'occupied', client: 'DIRECT ASSISTANCE' },
      { id: 'B05', name: 'Cellule 5', price: 1600, status: 'occupied', client: 'DIRECT ASSISTANCE' },
      { id: 'B06', name: 'Cellule 6', price: 1700, status: 'occupied', client: 'MADE IN WORLD' },
      { id: 'B07', name: 'Cellule 7', price: 1700, status: 'occupied', client: 'PLAIDY' },
      { id: 'B08', name: 'Cellule 8', price: 0, status: 'available', client: null },
      { id: 'B09', name: 'Cellule 9', price: 1650, status: 'occupied', client: 'SYL DEVELLOPEMENT' },
      { id: 'B10', name: 'Cellule 10', price: 1900, status: 'occupied', client: 'JB GARAGE AUTO-SERVICES' },
      { id: 'B11', name: 'Cellule 11', price: 1400, status: 'occupied', client: 'ET VOILA' },
      { id: 'B12', name: 'Cellule 12', price: 1400, status: 'occupied', client: 'TEMF TRANSPORT LOGISTICS' },
      { id: 'B13', name: 'Cellule 13', price: 1400, status: 'occupied', client: 'TRANSIMPEX INTERNATIONAL' },
      { id: 'B14', name: 'Cellule 14', price: 4300, status: 'occupied', client: 'WOODSTOCK TRADING' },
      { id: 'B15', name: 'Cellule 15', price: 1650, status: 'occupied', client: 'KOZEN LOG' },
      { id: 'B16', name: 'Cellule 16', price: 1700, status: 'occupied', client: 'AUTOLAVEUSE CENTER' },
      { id: 'B17', name: 'Cellule 17', price: 2200, status: 'occupied', client: 'EXCELLENCE RENOV MULTISERVICES' },
      { id: 'B18', name: 'Cellule 18', price: 1700, status: 'occupied', client: 'MELSCHER SARL' },
      { id: 'B19', name: 'Cellule 19', price: 1700, status: 'occupied', client: 'PARFUM GLOBAL' },
    ]
  },
  {
    id: 'boissy-ext',
    name: 'Site Moussy',
    totalRevenue: 3800,
    capacity: 4,
    capacityText: '4 cellules',
    isUnderConstruction: false,
    cells: [
      { id: 'BE01', name: 'Cellule 1', price: 0, status: 'available', client: null },
      { id: 'BE02', name: 'Cellule 2', price: 0, status: 'available', client: null },
      { id: 'BE03', name: 'Cellule 3', price: 1800, status: 'occupied', client: 'INTERTRADE LOGISTICS' },
      { id: 'BE04', name: 'Cellule 4', price: 2000, status: 'occupied', client: 'SOW COUVERTURE' },
    ]
  },
  {
    id: 'trappes',
    name: 'Site Trappes',
    totalRevenue: 0,
    capacity: 24,
    capacityText: 'En travaux (prévision 14 cellules + 10 box)',
    isUnderConstruction: true,
    cells: [
      { id: 'T01', name: 'Cellule 1', price: 0, status: 'available', client: null },
      { id: 'T02', name: 'Cellule 2', price: 0, status: 'available', client: null },
      { id: 'T03', name: 'Cellule 3', price: 0, status: 'available', client: null },
      { id: 'T04', name: 'Cellule 4', price: 0, status: 'available', client: null },
    ]
  },
  {
    id: 'nouveauSite',
    name: 'Nouveau Site',
    totalRevenue: 0,
    capacity: 10,
    capacityText: '10 cellules (Prévisionnel)',
    isUnderConstruction: true,
    cells: [
      { id: 'NS01', name: 'Cellule 1', price: 0, status: 'available', client: null },
      { id: 'NS02', name: 'Cellule 2', price: 0, status: 'available', client: null },
    ]
  }
];

export default function Inventory() {
  const [activeSite, setActiveSite] = useState(sites[0].id);

  const currentSite = sites.find(s => s.id === activeSite) || sites[0];

  // Global metrics
  const activeSites = sites.filter(s => !s.isUnderConstruction);
  const globalRevenue = sites.reduce((sum, site) => sum + site.totalRevenue, 0);
  const globalCapacity = activeSites.reduce((sum, site) => sum + site.capacity, 0);
  const globalOccupied = activeSites.reduce((sum, site) => sum + site.cells.filter(c => c.status === 'occupied').length, 0);
  const globalFillRate = Math.min(100, Math.round((globalOccupied / globalCapacity) * 100));
  const totalConstruction = sites.filter(s => s.isUnderConstruction).reduce((sum, site) => sum + site.capacity, 0);

  // Calculate Total DG (Assuming 2 months rent for DG as standard, can be adjusted per client later)
  const getDeposit = (cell: any) => {
    if (cell.status !== 'occupied' || cell.price <= 0) return 0;
    if (cell.client === 'WOODSTOCK TRADING') return 0;
    return cell.price * 2;
  };

  const globalDeposit = sites.reduce((sum, site) => {
    return sum + site.cells.reduce((cellSum, cell) => {
      return cellSum + getDeposit(cell);
    }, 0);
  }, 0);

  const currentSiteDeposit = currentSite.cells.reduce((sum, cell) => {
    return sum + getDeposit(cell);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Inventaire des Cellules</h1>
        <button className="bg-brand-blue text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-800 transition-colors">
          <Plus size={20} />
          Nouvelle Cellule
        </button>
      </div>

      {/* Global Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Revenus mensuels globaux</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {globalRevenue.toLocaleString()} € <span className="text-sm font-normal text-slate-500">HT</span>
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-emerald-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-bl-lg">
            SÉCURITÉ
          </div>
          <p className="text-sm font-medium text-slate-500">Dépôts de garantie encaissés</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-2xl font-bold text-emerald-600">{globalDeposit.toLocaleString()} €</p>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Couverture totale en cas d'impayé</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Taux de remplissage global</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-2xl font-bold text-brand-blue">{globalFillRate}%</p>
            <p className="text-sm text-slate-500">({globalOccupied} / {globalCapacity} cellules actives)</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Parc total</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-2xl font-bold text-slate-900">
              {globalCapacity + totalConstruction} <span className="text-sm font-normal text-slate-500">cellules</span>
            </p>
          </div>
          <p className="text-xs text-amber-600 mt-1 font-medium">dont {totalConstruction} en travaux (Trappes)</p>
        </div>
      </div>
      
      {/* Site Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {sites.map(site => (
          <button
            key={site.id}
            onClick={() => setActiveSite(site.id)}
            className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeSite === site.id 
                ? 'border-brand-blue text-brand-blue' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <MapPin size={16} />
            {site.name}
          </button>
        ))}
      </div>

      {/* Site Summary */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-semibold text-slate-900">{currentSite.name}</h2>
          <p className="text-sm text-slate-500">{currentSite.capacityText}</p>
        </div>
        
        <div className="flex gap-8 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-left sm:text-right border-r border-slate-200 pr-8">
            <p className="text-sm text-slate-500">Taux de remplissage</p>
            {currentSite.isUnderConstruction ? (
              <p className="text-base font-bold text-amber-600 mt-1">En travaux</p>
            ) : (
              <div className="flex items-center gap-2 mt-1 sm:justify-end">
                <p className="text-xl font-bold text-brand-blue">
                  {Math.min(100, Math.round((currentSite.cells.filter(c => c.status === 'occupied').length / currentSite.capacity) * 100))}%
                </p>
                <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                  {currentSite.cells.filter(c => c.status === 'occupied').length} / {currentSite.capacity}
                </span>
              </div>
            )}
          </div>

          <div className="text-left sm:text-right border-r border-slate-200 pr-8">
            <p className="text-sm text-slate-500">Revenus mensuels (HT)</p>
            <p className="text-xl font-bold text-brand-blue mt-1">{currentSite.totalRevenue.toLocaleString()} €</p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-sm text-slate-500">DG Encaissés</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">{currentSiteDeposit.toLocaleString()} €</p>
          </div>
        </div>
      </div>

      {/* Visual Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...currentSite.cells].sort((a, b) => {
          const getNum = (str: string) => {
            const match = str.match(/\d+/);
            return match ? parseInt(match[0], 10) : 999;
          };
          return getNum(a.name) - getNum(b.name);
        }).map(cell => (
          <div 
            key={cell.id} 
            className={`relative p-4 rounded-xl border-2 flex flex-col h-32 transition-all hover:shadow-md cursor-pointer ${
              cell.status === 'available' 
                ? 'border-emerald-200 bg-emerald-50 hover:border-emerald-300' 
                : 'border-slate-200 bg-white hover:border-brand-blue/30'
            }`}
          >
            <div className="flex justify-between items-start mb-auto">
              <span className="font-bold text-slate-900">{cell.name}</span>
              {cell.status === 'available' && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </div>
            
            <div>
              {cell.client ? (
                <p className="font-semibold text-brand-blue text-sm truncate" title={cell.client}>
                  {cell.client}
                </p>
              ) : (
                <p className="font-medium text-emerald-600 text-sm">Disponible</p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                {cell.price > 0 ? `${cell.price} € HT/mois` : '-'}
              </p>
              {cell.status === 'occupied' && cell.price > 0 && (
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                  DG encaissé: {getDeposit(cell)} € {cell.client === 'WOODSTOCK TRADING' && '(Actionnaire)'}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
