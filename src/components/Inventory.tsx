import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Plus, Search, MapPin, Warehouse, Construction, X,
  ArrowUpRight, ChevronDown, Building2, Euro, ShieldCheck,
  LayoutGrid, List, Check,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { clientData, siteData, type SiteKey } from '../data';

// ═══════════ TYPES ═══════════

interface CellData {
  id: string;
  name: string;
  price: number;
  surface: number;
  status: 'occupied' | 'available' | 'construction';
  client: string | null;
  depot: number;
  siteId: string;
}

interface SiteGroup {
  id: string;
  name: string;
  fullName: string;
  totalRevenue: number;
  capacity: number;
  isUnderConstruction: boolean;
  cells: CellData[];
  color: string;
}

// ═══════════ BUILD DATA ═══════════

const SITE_COLORS: Record<string, string> = {
  montigny: '#3b82f6',
  boissy: '#10b981',
  moussy: '#f59e0b',
  trappes: '#8b5cf6',
};

function buildSites(): SiteGroup[] {
  const siteKeys: Exclude<SiteKey, 'consolidated'>[] = ['montigny', 'boissy', 'moussy', 'trappes'];
  return siteKeys.map(key => {
    const info = siteData[key].info;
    const clients = clientData[key];
    const cells: CellData[] = clients.map((c, i) => ({
      id: `${key}-${i}`,
      name: c.cell,
      price: c.loyer,
      surface: c.surface,
      status: c.status === 'actif' ? 'occupied' : c.status === 'travaux' ? 'construction' : c.loyer > 0 ? 'occupied' : 'available',
      client: c.client || null,
      depot: c.depot,
      siteId: key,
    }));
    return {
      id: key,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      fullName: info.lieu,
      totalRevenue: cells.reduce((s, c) => s + c.price, 0),
      capacity: info.cellules,
      isUnderConstruction: key === 'trappes',
      cells,
      color: SITE_COLORS[key],
    };
  });
}

const allSites = buildSites();

// ═══════════ FORMATTERS ═══════════

const fmt = (v: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

// ═══════════ NEW CELL MODAL ═══════════

interface NewCellForm {
  site: string;
  name: string;
  surface: string;
  client: string;
  loyer: string;
  depot: string;
  status: 'occupied' | 'available';
}

const INITIAL_FORM: NewCellForm = { site: '', name: '', surface: '', client: '', loyer: '', depot: '', status: 'available' };

function NewCellModal({
  open,
  onClose,
  onSubmit,
  defaultSite,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: NewCellForm) => void;
  defaultSite: string;
}) {
  const [form, setForm] = useState<NewCellForm>({ ...INITIAL_FORM, site: defaultSite });
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm({ ...INITIAL_FORM, site: defaultSite });
      setTimeout(() => nameRef.current?.focus(), 100);
    }
  }, [open, defaultSite]);

  if (!open) return null;

  const set = (k: keyof NewCellForm, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const canSubmit = form.name.trim() !== '' && form.site !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      {/* Panel */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/60 w-full max-w-lg mx-4 overflow-hidden animate-page-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-[16px] font-bold text-slate-900">Nouvelle Cellule</h2>
            <p className="text-[12px] text-slate-400 mt-0.5">Ajouter une cellule à l'inventaire</p>
          </div>
          <button type="button" onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Site selector */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Site *</label>
            <div className="grid grid-cols-4 gap-2">
              {allSites.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => set('site', s.id)}
                  className={`py-2 px-3 rounded-xl text-[12px] font-semibold border transition-all ${
                    form.site === s.id
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Name + Surface */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nom cellule *</label>
              <input
                ref={nameRef}
                type="text"
                placeholder="Ex: Cell 15"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className="w-full px-3 py-2.5 text-[13px] font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Surface (m²)</label>
              <input
                type="number"
                placeholder="150"
                value={form.surface}
                onChange={e => set('surface', e.target.value)}
                className="w-full px-3 py-2.5 text-[13px] font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Status toggle */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Statut</label>
            <div className="flex gap-2">
              {[
                { val: 'available' as const, label: 'Disponible', color: 'emerald' },
                { val: 'occupied' as const, label: 'Occupée', color: 'blue' },
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => set('status', opt.val)}
                  className={`flex-1 py-2 rounded-xl text-[12px] font-semibold border transition-all ${
                    form.status === opt.val
                      ? opt.val === 'available'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'border-slate-200 text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Client (conditional) */}
          {form.status === 'occupied' && (
            <div className="animate-page-in">
              <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Client</label>
              <input
                type="text"
                placeholder="Nom du client"
                value={form.client}
                onChange={e => set('client', e.target.value)}
                className="w-full px-3 py-2.5 text-[13px] font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300"
              />
            </div>
          )}

          {/* Loyer + Dépôt */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Loyer HT/mois (€)</label>
              <input
                type="number"
                placeholder="1 200"
                value={form.loyer}
                onChange={e => set('loyer', e.target.value)}
                className="w-full px-3 py-2.5 text-[13px] font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Dépôt garantie (€)</label>
              <input
                type="number"
                placeholder="2 400"
                value={form.depot}
                onChange={e => set('depot', e.target.value)}
                className="w-full px-3 py-2.5 text-[13px] font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-semibold text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-5 py-2 text-[13px] font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Ajouter la cellule
          </button>
        </div>
      </form>
    </div>
  );
}

// ═══════════ MAIN COMPONENT ═══════════

export default function Inventory() {
  const [activeSite, setActiveSite] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'occupied' | 'available' | 'construction'>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [addedCells, setAddedCells] = useState<CellData[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // ── Merge base + added cells ──
  const sites = useMemo(() => {
    return allSites.map(s => ({
      ...s,
      cells: [...s.cells, ...addedCells.filter(c => c.siteId === s.id)],
    }));
  }, [addedCells]);

  // ── Global metrics ──
  const activeSitesList = sites.filter(s => !s.isUnderConstruction);
  const globalRevenue = sites.reduce((sum, s) => sum + s.cells.reduce((cs, c) => cs + c.price, 0), 0);
  const globalCapacity = activeSitesList.reduce((sum, s) => sum + s.cells.length, 0);
  const globalOccupied = activeSitesList.reduce((sum, s) => sum + s.cells.filter(c => c.status === 'occupied').length, 0);
  const globalAvailable = activeSitesList.reduce((sum, s) => sum + s.cells.filter(c => c.status === 'available').length, 0);
  const globalFillRate = globalCapacity > 0 ? Math.round((globalOccupied / globalCapacity) * 100) : 0;
  const globalDeposit = sites.reduce((sum, s) => sum + s.cells.reduce((cs, c) => cs + (c.depot || 0), 0), 0);

  // ── Filtered cells ──
  const filteredCells = useMemo(() => {
    let cells: (CellData & { siteName: string; siteColor: string })[] = [];
    const targetSites = activeSite === 'all' ? sites : sites.filter(s => s.id === activeSite);
    targetSites.forEach(s => {
      s.cells.forEach(c => cells.push({ ...c, siteName: s.name, siteColor: s.color }));
    });
    if (filterStatus !== 'all') cells = cells.filter(c => c.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      cells = cells.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.client && c.client.toLowerCase().includes(q)) ||
        c.siteName.toLowerCase().includes(q)
      );
    }
    cells.sort((a, b) => {
      const getNum = (str: string) => { const m = str.match(/\d+/); return m ? parseInt(m[0], 10) : 999; };
      return getNum(a.name) - getNum(b.name);
    });
    return cells;
  }, [activeSite, filterStatus, search, sites]);

  // ── Current site stats ──
  const currentSite = activeSite === 'all' ? null : sites.find(s => s.id === activeSite);

  // ── Handle add cell ──
  const handleAddCell = (form: NewCellForm) => {
    const newCell: CellData = {
      id: `added-${Date.now()}`,
      name: form.name.trim(),
      surface: Number(form.surface) || 0,
      price: Number(form.loyer) || 0,
      depot: Number(form.depot) || 0,
      status: form.status,
      client: form.status === 'occupied' ? (form.client.trim() || null) : null,
      siteId: form.site,
    };
    setAddedCells(prev => [...prev, newCell]);
    setModalOpen(false);
    setToast(`${newCell.name} ajoutée à ${allSites.find(s => s.id === form.site)?.name}`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-6 stagger-in">

        {/* ═══ Toast ═══ */}
        {toast && (
          <div className="fixed top-4 right-4 z-[60] flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-[13px] font-medium animate-page-in">
            <Check className="h-4 w-4 text-emerald-400" />
            {toast}
          </div>
        )}

        {/* ═══ Header ═══ */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[26px] font-bold text-slate-900 tracking-[-0.025em]">Inventaire des Cellules</h1>
            <p className="text-[13px] text-slate-400 mt-1">{sites.reduce((s, si) => s + si.cells.length, 0)} cellules sur {sites.length} sites</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Nouvelle Cellule
          </button>
        </div>

        {/* ═══ KPI Cards ═══ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="metric-card">
            <div className="h-[2px] bg-gradient-to-r from-blue-500 to-blue-400" />
            <div className="p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-[10px] bg-blue-50 flex items-center justify-center">
                  <Euro className="h-4 w-4 text-blue-500" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.06em]">Revenus mensuels</span>
              </div>
              <p className="text-[24px] font-extrabold text-slate-900 tracking-[-0.02em] tabular-nums leading-none">{fmt(globalRevenue)}</p>
              <p className="text-[11px] text-slate-300 mt-1.5 font-medium">HT · tous sites confondus</p>
            </div>
          </div>
          <div className="metric-card">
            <div className="h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400" />
            <div className="p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-[10px] bg-emerald-50 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.06em]">Dépôts de garantie</span>
              </div>
              <p className="text-[24px] font-extrabold text-emerald-600 tracking-[-0.02em] tabular-nums leading-none">{fmt(globalDeposit)}</p>
              <p className="text-[11px] text-slate-300 mt-1.5 font-medium">Couverture en cas d'impayé</p>
            </div>
          </div>
          <div className="metric-card">
            <div className="h-[2px] bg-gradient-to-r from-violet-500 to-purple-400" />
            <div className="p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-[10px] bg-violet-50 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-violet-500" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.06em]">Taux de remplissage</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-[24px] font-extrabold text-slate-900 tracking-[-0.02em] tabular-nums leading-none">{globalFillRate}%</p>
                <span className="text-[11px] text-slate-300 font-medium tabular-nums">{globalOccupied}/{globalCapacity}</span>
              </div>
              {/* Mini fill bar */}
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400 transition-all duration-700" style={{ width: `${globalFillRate}%` }} />
              </div>
            </div>
          </div>
          <div className="metric-card">
            <div className="h-[2px] bg-gradient-to-r from-amber-500 to-orange-400" />
            <div className="p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-[10px] bg-amber-50 flex items-center justify-center">
                  <Warehouse className="h-4 w-4 text-amber-500" />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.06em]">Parc total</span>
              </div>
              <p className="text-[24px] font-extrabold text-slate-900 tracking-[-0.02em] tabular-nums leading-none">
                {sites.reduce((s, si) => s + si.cells.length, 0)}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[11px] text-slate-300 font-medium">{globalAvailable} libres</span>
                <span className="text-[11px] text-amber-500 font-semibold">{sites.filter(s => s.isUnderConstruction).reduce((s, si) => s + si.cells.length, 0)} en travaux</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Filters & Controls ═══ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Site pills */}
          <div className="flex items-center gap-1 bg-white border border-slate-200/70 rounded-full p-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-x-auto">
            <button
              onClick={() => setActiveSite('all')}
              className={`px-3 py-1.5 text-[12px] font-semibold rounded-full transition-all duration-200 whitespace-nowrap ${
                activeSite === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              Tous
            </button>
            {sites.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSite(s.id)}
                className={`px-3 py-1.5 text-[12px] font-semibold rounded-full transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                  activeSite === s.id ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeSite === s.id ? '#fff' : s.color }} />
                {s.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
            <input
              type="text"
              placeholder="Rechercher cellule, client…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-[13px] font-medium text-slate-900 bg-white border border-slate-200/70 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1">
            {[
              { val: 'all' as const, label: 'Tout' },
              { val: 'occupied' as const, label: 'Occupées' },
              { val: 'available' as const, label: 'Libres' },
              { val: 'construction' as const, label: 'Travaux' },
            ].map(f => (
              <button
                key={f.val}
                onClick={() => setFilterStatus(f.val)}
                className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                  filterStatus === f.val
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-0.5 bg-white border border-slate-200/70 rounded-lg p-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ml-auto">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
              aria-label="Vue grille"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
              aria-label="Vue liste"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ═══ Site sub-header ═══ */}
        {currentSite && (
          <div className="flex items-center justify-between bg-white border border-slate-200/60 rounded-xl px-5 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-md shadow-sm" style={{ backgroundColor: currentSite.color }} />
              <div>
                <h2 className="text-[14px] font-bold text-slate-900">{currentSite.fullName}</h2>
                <p className="text-[11px] text-slate-400">{currentSite.cells.length} cellules</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-right">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Remplissage</p>
                {currentSite.isUnderConstruction ? (
                  <Badge variant="warning" className="mt-1 text-[10px]">Travaux</Badge>
                ) : (
                  <p className="text-[15px] font-extrabold tabular-nums mt-0.5" style={{ color: currentSite.color }}>
                    {Math.round((currentSite.cells.filter(c => c.status === 'occupied').length / currentSite.cells.length) * 100)}%
                  </p>
                )}
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Revenus</p>
                <p className="text-[15px] font-extrabold text-slate-900 tabular-nums mt-0.5">{fmt(currentSite.cells.reduce((s, c) => s + c.price, 0))}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">DG</p>
                <p className="text-[15px] font-extrabold text-emerald-600 tabular-nums mt-0.5">{fmt(currentSite.cells.reduce((s, c) => s + (c.depot || 0), 0))}</p>
              </div>
            </div>
          </div>
        )}

        {/* ═══ Results count ═══ */}
        <p className="text-[12px] font-medium text-slate-400">
          {filteredCells.length} cellule{filteredCells.length !== 1 ? 's' : ''}
          {search.trim() && ` pour "${search}"`}
        </p>

        {/* ═══ GRID VIEW ═══ */}
        {view === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredCells.map(cell => (
              <Tooltip key={cell.id}>
                <TooltipTrigger asChild>
                  <div
                    className={`relative group flex flex-col h-[130px] bg-white rounded-xl border transition-all cursor-default overflow-hidden ${
                      cell.status === 'available'
                        ? 'border-emerald-200/60 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5'
                        : cell.status === 'construction'
                          ? 'border-amber-200/60 hover:border-amber-300 hover:shadow-md hover:shadow-amber-500/5'
                          : 'border-slate-200/60 hover:border-slate-300 hover:shadow-md hover:shadow-slate-500/5'
                    }`}
                  >
                    {/* Top accent line */}
                    <div className={`h-[2px] ${
                      cell.status === 'available' ? 'bg-emerald-400' : cell.status === 'construction' ? 'bg-amber-400' : ''
                    }`} style={cell.status === 'occupied' ? { backgroundColor: cell.siteColor } : {}} />

                    <div className="flex flex-col h-full p-3.5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-auto">
                        <div className="flex items-center gap-1.5">
                          {activeSite === 'all' && (
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cell.siteColor }} />
                          )}
                          <span className="text-[13px] font-bold text-slate-900">{cell.name}</span>
                        </div>
                        {cell.status === 'available' ? (
                          <Badge variant="success" className="text-[9px] px-1.5 py-0 leading-[16px]">Libre</Badge>
                        ) : cell.status === 'construction' ? (
                          <Badge variant="warning" className="text-[9px] px-1.5 py-0 leading-[16px]">Travaux</Badge>
                        ) : null}
                      </div>

                      {/* Content */}
                      <div className="mt-auto">
                        {cell.client ? (
                          <p className="text-[12px] font-semibold text-slate-700 truncate" title={cell.client}>{cell.client}</p>
                        ) : cell.status === 'available' ? (
                          <p className="text-[12px] font-semibold text-emerald-500">Disponible</p>
                        ) : (
                          <p className="text-[12px] font-semibold text-amber-500">En travaux</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          {cell.surface > 0 && <span className="text-[10px] text-slate-400">{cell.surface} m²</span>}
                          {cell.price > 0 && (
                            <>
                              {cell.surface > 0 && <span className="text-[10px] text-slate-200">·</span>}
                              <span className="text-[10px] text-slate-500 font-semibold tabular-nums">{fmt(cell.price)}</span>
                            </>
                          )}
                        </div>
                        {cell.depot > 0 && (
                          <span className="text-[9px] text-emerald-500/70 font-medium mt-0.5 block">DG {fmt(cell.depot)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-[12px]">
                  <p className="font-bold">{cell.name}</p>
                  {activeSite === 'all' && <p className="text-slate-500 text-[11px]">{cell.siteName}</p>}
                  {cell.surface > 0 && <p className="text-slate-400">{cell.surface} m²</p>}
                  {cell.client && <p className="text-slate-500">{cell.client}</p>}
                  {cell.price > 0 && <p className="font-semibold">{fmt(cell.price)} HT/mois</p>}
                  {cell.depot > 0 && <p className="text-emerald-600 font-semibold">DG: {fmt(cell.depot)}</p>}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}

        {/* ═══ LIST VIEW ═══ */}
        {view === 'list' && (
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/60">
                  <th className="py-2.5 px-4 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Cellule</th>
                  {activeSite === 'all' && <th className="py-2.5 px-4 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Site</th>}
                  <th className="py-2.5 px-4 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Client</th>
                  <th className="py-2.5 px-4 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Surface</th>
                  <th className="py-2.5 px-4 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Loyer</th>
                  <th className="py-2.5 px-4 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">DG</th>
                  <th className="py-2.5 px-4 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {filteredCells.map(cell => (
                  <tr key={cell.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cell.siteColor }} />
                        <span className="text-[13px] font-semibold text-slate-900">{cell.name}</span>
                      </div>
                    </td>
                    {activeSite === 'all' && (
                      <td className="py-3 px-4 text-[13px] text-slate-500">{cell.siteName}</td>
                    )}
                    <td className="py-3 px-4">
                      {cell.client ? (
                        <span className="text-[13px] font-medium text-slate-700">{cell.client}</span>
                      ) : (
                        <span className="text-[13px] text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-[13px] text-slate-500 tabular-nums">
                      {cell.surface > 0 ? `${cell.surface} m²` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right text-[13px] font-semibold text-slate-900 tabular-nums">
                      {cell.price > 0 ? fmt(cell.price) : '—'}
                    </td>
                    <td className="py-3 px-4 text-right text-[13px] text-emerald-600 tabular-nums font-medium">
                      {cell.depot > 0 ? fmt(cell.depot) : '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {cell.status === 'occupied' && <Badge variant="blue" className="text-[10px]">Occupée</Badge>}
                      {cell.status === 'available' && <Badge variant="success" className="text-[10px]">Libre</Badge>}
                      {cell.status === 'construction' && <Badge variant="warning" className="text-[10px]">Travaux</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCells.length === 0 && (
              <div className="text-center py-12 text-[14px] text-slate-400">
                Aucune cellule ne correspond à votre recherche.
              </div>
            )}
          </div>
        )}

        {/* ═══ Empty grid state ═══ */}
        {view === 'grid' && filteredCells.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
            <Search className="h-8 w-8 text-slate-200 mx-auto mb-3" />
            <p className="text-[14px] text-slate-400">Aucune cellule ne correspond à votre recherche.</p>
          </div>
        )}

        {/* ═══ New Cell Modal ═══ */}
        <NewCellModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddCell}
          defaultSite={activeSite === 'all' ? allSites[0].id : activeSite}
        />
      </div>
    </TooltipProvider>
  );
}
