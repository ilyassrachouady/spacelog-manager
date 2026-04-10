import React, { useState } from 'react';
import { Folder, FileText, FileSpreadsheet, Upload, Search, Filter, MapPin, Building2, Globe, File, MoreVertical, Download } from 'lucide-react';

const sites = [
  { id: 'global', name: 'Structure Globale', icon: Globe },
  { id: 'montigny', name: 'Site Montigny', icon: Building2 },
  { id: 'boissy', name: 'Site Boissy', icon: Building2 },
  { id: 'moussy', name: 'Site Moussy', icon: Building2 },
  { id: 'trappes', name: 'Site Trappes', icon: Building2 },
  { id: 'nouveauSite', name: 'Nouveau Site', icon: Building2 },
];

const categories = [
  { id: 'actes', name: 'Actes notariés', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'emprunts', name: "Tableaux d'emprunt", icon: FileSpreadsheet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'leasing', name: 'Contrats de leasing', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'annexes', name: 'Annexes', icon: File, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'clients', name: 'Contrats clients', icon: FileText, color: 'text-slate-600', bg: 'bg-slate-50' },
];

const mockDocuments = [
  { id: 1, name: "Acte de Vente - Montigny.pdf", type: "pdf", category: "actes", site: "montigny", date: "12/05/2023", size: "4.2 MB" },
  { id: 2, name: "Tableau Amortissement - Prêt BPI.xlsx", type: "excel", category: "emprunts", site: "global", date: "01/06/2023", size: "1.1 MB" },
  { id: 3, name: "Contrat Leasing Chariot Fenwick.pdf", type: "pdf", category: "leasing", site: "boissy", date: "15/09/2024", size: "2.5 MB" },
  { id: 4, name: "Annexe Environnementale.pdf", type: "pdf", category: "annexes", site: "montigny", date: "12/05/2023", size: "800 KB" },
  { id: 5, name: "Acte Notarié - Boissy.pdf", type: "pdf", category: "actes", site: "boissy", date: "22/11/2022", size: "5.1 MB" },
  { id: 6, name: "Tableau Emprunt - LCL Montigny.xlsx", type: "excel", category: "emprunts", site: "montigny", date: "15/05/2023", size: "1.3 MB" },
  { id: 7, name: "Contrat Leasing Nacelle.pdf", type: "pdf", category: "leasing", site: "montigny", date: "10/01/2025", size: "1.8 MB" },
  { id: 8, name: "Contrat KBE TECHNOLOGY.pdf", type: "pdf", category: "clients", site: "montigny", date: "01/02/2024", size: "3.2 MB" },
  { id: 9, name: "Contrat WOODSTOCK TRADING.pdf", type: "pdf", category: "clients", site: "boissy", date: "15/03/2024", size: "2.9 MB" },
  { id: 10, name: "Acte d'Acquisition - Trappes.pdf", type: "pdf", category: "actes", site: "trappes", date: "05/11/2025", size: "6.4 MB" },
  { id: 11, name: "Tableau Amortissement - Crédit Agricole.xlsx", type: "excel", category: "emprunts", site: "boissy", date: "10/12/2022", size: "1.5 MB" },
  { id: 12, name: "Contrat Leasing Photocopieur.pdf", type: "pdf", category: "leasing", site: "global", date: "20/08/2024", size: "1.2 MB" },
  { id: 13, name: "Annexe Technique - Moussy.pdf", type: "pdf", category: "annexes", site: "moussy", date: "08/07/2023", size: "950 KB" },
  { id: 14, name: "Contrat Prêt - Société Générale (800k€).pdf", type: "pdf", category: "emprunts", site: "boissy", date: "08/11/2024", size: "2.4 MB" },
  { id: 15, name: "Contrat Prêt - Banque Populaire (800k€).pdf", type: "pdf", category: "emprunts", site: "boissy", date: "08/11/2024", size: "2.4 MB" },
  { id: 16, name: "Contrat Prêt - La Banque Postale (3.35M€).pdf", type: "pdf", category: "emprunts", site: "montigny", date: "30/09/2022", size: "5.1 MB" },
  { id: 17, name: "Tableau Amortissement - Banque Populaire (800k€).pdf", type: "pdf", category: "emprunts", site: "boissy", date: "15/11/2024", size: "1.8 MB" },
  { id: 18, name: "Tableau Amortissement - Crédit Mutuel (1.12M€).pdf", type: "pdf", category: "emprunts", site: "global", date: "08/10/2025", size: "1.2 MB" },
  { id: 19, name: "Tableau Amortissement - Société Générale (800k€).pdf", type: "pdf", category: "emprunts", site: "boissy", date: "10/10/2024", size: "1.5 MB" },
  { id: 20, name: "Tableau Amortissement - Banque Populaire (50k€).pdf", type: "pdf", category: "emprunts", site: "global", date: "15/11/2024", size: "0.5 MB" },
  { id: 21, name: "Tableau Amortissement - Banque Populaire (209k€).pdf", type: "pdf", category: "emprunts", site: "global", date: "15/11/2024", size: "0.8 MB" },
  { id: 22, name: "Acte Notarié - Nouveau Site.pdf", type: "pdf", category: "actes", site: "nouveauSite", date: "01/03/2026", size: "2.1 MB" },
];

export default function Drive() {
  const [activeSite, setActiveSite] = useState('global');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = mockDocuments.filter(doc => {
    const matchesSite = activeSite === 'global' || doc.site === activeSite || doc.site === 'global';
    const matchesCategory = activeCategory ? doc.category === activeCategory : true;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSite && matchesCategory && matchesSearch;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="text-red-500" size={20} />;
      case 'excel': return <FileSpreadsheet className="text-emerald-500" size={20} />;
      default: return <File className="text-slate-500" size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Coffre-fort Numérique</h1>
          <p className="text-slate-500">Gérez vos contrats, actes notariés et documents administratifs</p>
        </div>
        <button className="bg-brand-blue text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-85 transition-all">
          <Upload size={20} />
          Importer un document
        </button>
      </div>

      {/* Site Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {sites.map(site => {
          const Icon = site.icon;
          return (
            <button
              key={site.id}
              onClick={() => setActiveSite(site.id)}
              className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeSite === site.id 
                  ? 'border-brand-blue text-brand-blue' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Icon size={16} />
              {site.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Categories */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h2 className="font-semibold text-slate-900 mb-4">Dossiers</h2>
            <div className="space-y-1">
              <button
                onClick={() => setActiveCategory(null)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === null ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Folder size={18} className={activeCategory === null ? 'text-brand-blue' : 'text-slate-400'} />
                Tous les documents
              </button>
              {categories.map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeCategory === cat.id ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-1.5 rounded-md ${cat.bg}`}>
                      <Icon size={14} className={cat.color} />
                    </div>
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un document..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium">
              <Filter size={20} />
              Filtres
            </button>
          </div>

          {/* Documents List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
                    <th className="p-4 font-medium">Nom du document</th>
                    <th className="p-4 font-medium">Catégorie</th>
                    <th className="p-4 font-medium">Site</th>
                    <th className="p-4 font-medium">Date d'ajout</th>
                    <th className="p-4 font-medium">Taille</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocs.length > 0 ? (
                    filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {getFileIcon(doc.type)}
                            <span className="font-medium text-slate-900">{doc.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            {categories.find(c => c.id === doc.category)?.name}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-600">
                            {sites.find(s => s.id === doc.site)?.name}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-500">{doc.date}</td>
                        <td className="p-4 text-sm text-slate-500">{doc.size}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-md transition-colors">
                              <Download size={18} />
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        Aucun document trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
