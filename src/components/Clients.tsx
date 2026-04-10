import React, { useState, useRef, useMemo } from 'react';
import { FileText, Plus, Search, Check, ChevronRight, Download, MapPin, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { clientData, type SiteKey } from '../data';

const siteNames: Record<Exclude<SiteKey, 'consolidated'>, string> = {
  montigny: 'Site Montigny',
  boissy: 'Site Boissy',
  moussy: 'Site Moussy',
  trappes: 'Site Trappes',
};

function buildInitialClients() {
  let id = 1;
  const result: { id: number; name: string; site: string; cell: string; rent: string; status: string; signature: string; surface: number; depot: number; finContrat: string; duree: number }[] = [];
  for (const [siteKey, clients] of Object.entries(clientData)) {
    const siteName = siteNames[siteKey as Exclude<SiteKey, 'consolidated'>];
    for (const c of clients) {
      result.push({
        id: id++,
        name: c.client || '—',
        site: siteName,
        cell: c.cell,
        rent: c.loyer > 0 ? `${c.loyer.toLocaleString('fr-FR')} € HT` : '—',
        status: c.status === 'actif' ? 'Actif' : c.status === 'en_attente' ? 'En attente' : c.status === 'travaux' ? 'Travaux' : 'Libre',
        signature: c.docusign === 'ok' ? 'Signé' : 'Non signé',
        surface: c.surface,
        depot: c.depot,
        finContrat: c.finContrat,
        duree: c.duree,
      });
    }
  }
  return result;
}

const initialClients = buildInitialClients();

const availableCells = initialClients
  .filter(c => c.status === 'Libre' || c.status === 'Travaux')
  .map(c => ({ id: String(c.id), name: c.cell, area: c.surface, price: 0 }));

export default function Clients() {
  const [clients, setClients] = useState(initialClients);
  const uniqueSites = Array.from(new Set(clients.map(c => c.site))).sort();
  const [activeSite, setActiveSite] = useState(uniqueSites[0]);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    capital: '',
    address: '',
    rcs: '',
    representative: '',
    cellId: '',
    startDate: '',
    duration: '6',
    noticePeriod: '2',
    pdfFile: null as File | null,
    pdfUrl: null as string | null,
    pdfName: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingClientId, setUploadingClientId] = useState<number | null>(null);

  const handleLinkPDFClick = (clientId: number) => {
    setUploadingClientId(clientId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingClientId !== null) {
      const fileUrl = URL.createObjectURL(file);
      setClients(prev => prev.map(c => 
        c.id === uploadingClientId 
          ? { ...c, signature: 'Signé', pdfName: file.name, pdfUrl: fileUrl, status: 'Actif' } 
          : c
      ));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploadingClientId(null);
  };

  const handleViewPDF = (client: any) => {
    if (client.pdfUrl) {
      window.open(client.pdfUrl, '_blank');
    } else {
      alert(`Ouverture du contrat : ${client.pdfName || 'contrat_signe.pdf'}`);
    }
  };

  const selectedCell = availableCells.find(c => c.id === formData.cellId);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  if (isCreating) {
    return (
      <div className="max-w-3xl mx-auto">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".pdf" 
          className="hidden" 
        />
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Nouveau Contrat</h1>
          <Button variant="ghost" onClick={() => setIsCreating(false)}>
            Annuler
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-blue -z-10 transition-all" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          
          {[
            { num: 1, label: 'Client' },
            { num: 2, label: 'Cellule' },
            { num: 3, label: 'Contrat' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2 bg-slate-50 px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                step >= s.num ? 'bg-brand-blue text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {step > s.num ? <Check size={16} /> : s.num}
              </div>
              <span className={`text-sm font-medium ${step >= s.num ? 'text-slate-900' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-900">Informations du Bénéficiaire</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Dénomination sociale</label>
                  <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                    placeholder="Ex: MADE IN WORLD"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Numéro RCS</label>
                  <input 
                    type="text" 
                    value={formData.rcs}
                    onChange={e => setFormData({...formData, rcs: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                    placeholder="Ex: RCS 908 916 455"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Siège social</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                    placeholder="Ex: 34 rue HEMET 93000 Aubervilliers"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Représentant légal</label>
                  <input 
                    type="text" 
                    value={formData.representative}
                    onChange={e => setFormData({...formData, representative: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                    placeholder="Ex: KAMAGATE ADAMA"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Montant du capital social</label>
                  <input 
                    type="text" 
                    value={formData.capital}
                    onChange={e => setFormData({...formData, capital: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                    placeholder="Ex: 10 000 €"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleNext}
                  disabled={!formData.companyName || !formData.representative}
                  className="flex items-center gap-2"
                >
                  Suivant <ChevronRight size={20} />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-900">Attribution de la Cellule</h2>
              
              <div className="grid grid-cols-1 gap-4">
                {availableCells.map(cell => (
                  <label 
                    key={cell.id}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      formData.cellId === cell.id 
                        ? 'border-brand-blue bg-blue-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input 
                        type="radio" 
                        name="cell" 
                        value={cell.id}
                        checked={formData.cellId === cell.id}
                        onChange={(e) => setFormData({...formData, cellId: e.target.value})}
                        className="w-5 h-5 text-brand-blue focus:ring-brand-blue"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{cell.name}</p>
                        <p className="text-sm text-slate-500">{cell.area} m²</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{cell.price} € HT / mois</p>
                      <p className="text-sm text-slate-500">Dépôt: {cell.price * 2} €</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Date d'entrée</label>
                  <input 
                    type="date" 
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Durée (mois)</label>
                  <input 
                    type="number" 
                    value={formData.duration}
                    onChange={e => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Préavis (mois)</label>
                  <input 
                    type="number" 
                    value={formData.noticePeriod}
                    onChange={e => setFormData({...formData, noticePeriod: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={handleBack}>
                  Retour
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!formData.cellId || !formData.startDate}
                  className="flex items-center gap-2"
                >
                  Suivant <ChevronRight size={20} />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Aperçu du Contrat</h2>
                <Button variant="ghost" className="text-brand-blue gap-2">
                  <Download size={20} />
                  Télécharger PDF
                </Button>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 font-serif text-sm space-y-4 h-96 overflow-y-auto">
                <h3 className="text-center font-bold text-lg text-brand-blue mb-6">CONTRAT DE PRESTATIONS DE SERVICES</h3>
                
                <p className="font-bold">ENTRE D'UNE PART :</p>
                <p><strong>SPACE LOG</strong>, société par actions simplifiée au capital de 1.000 euros, immatriculée au RCS de Pontoise sous le numéro 948 373 873, dont le siège social est situé au 140, rue de la République, 95370 Montigny-les-Cormeilles, représentée par Monsieur Cyril ANDRINO, Président.</p>
                <p className="text-right italic">Ci-après le « Prestataire »</p>

                <p className="font-bold mt-6">ET D'AUTRE PART :</p>
                <table className="w-full border-collapse border border-slate-300 my-4">
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium w-1/3">Dénomination sociale :</td>
                      <td className="border border-slate-300 p-2 font-bold">{formData.companyName}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium">Siège social :</td>
                      <td className="border border-slate-300 p-2">{formData.address}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium">Numéro RCS :</td>
                      <td className="border border-slate-300 p-2">{formData.rcs}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium">Représentant légal :</td>
                      <td className="border border-slate-300 p-2">{formData.representative}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-right italic">Ci-après le « Bénéficiaire »</p>

                <h4 className="font-bold text-brand-blue mt-8">B. CONDITIONS PARTICULIERES</h4>
                <p><strong>B.1. PRESTATIONS FOURNIES :</strong> {selectedCell?.name}</p>
                
                <table className="w-full border-collapse border border-slate-300 my-4">
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium w-1/3">Date d'entrée</td>
                      <td className="border border-slate-300 p-2">{formData.startDate}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium">Durée du Contrat</td>
                      <td className="border border-slate-300 p-2">{formData.duration} mois</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium">Tarif mensuel HT</td>
                      <td className="border border-slate-300 p-2 font-bold">{selectedCell?.price} €</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium">Dépôt de Garantie</td>
                      <td className="border border-slate-300 p-2 font-bold text-brand-pink">
                        {(selectedCell?.price || 0) * 2} €<br/>
                        <span className="text-xs font-normal text-slate-600">Payable par virement à la signature</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h4 className="font-medium text-slate-900 mb-2">Attacher le contrat signé (PDF)</h4>
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({
                        ...formData, 
                        pdfFile: file, 
                        pdfName: file.name, 
                        pdfUrl: URL.createObjectURL(file)
                      });
                    }
                  }}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-blue-800 cursor-pointer"
                />
                {formData.pdfName && (
                  <p className="mt-3 text-sm text-emerald-600 flex items-center gap-1 font-medium">
                    <Check size={16} /> {formData.pdfName} prêt à être lié.
                  </p>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={handleBack}>
                  Retour
                </Button>
                <Button 
                  variant="success"
                  className="flex items-center gap-2"
                  onClick={() => {
                    const newClient = {
                      id: Date.now(),
                      name: formData.companyName,
                      site: "Nouveau Client",
                      cell: selectedCell?.name.replace('Cellule ', '') || formData.cellId,
                      rent: `${selectedCell?.price || 0} € HT`,
                      status: formData.pdfFile ? "Actif" : "En attente",
                      signature: formData.pdfFile ? "Signé" : "Non signé",
                      pdfName: formData.pdfName,
                      pdfUrl: formData.pdfUrl
                    };
                    setClients(prev => [...prev, newClient]);
                    setIsCreating(false);
                    setStep(1);
                    setFormData({
                      companyName: '',
                      capital: '',
                      address: '',
                      rcs: '',
                      representative: '',
                      cellId: '',
                      startDate: '',
                      duration: '6',
                      noticePeriod: '2',
                      pdfFile: null,
                      pdfUrl: null,
                      pdfName: ''
                    });
                  }}
                >
                  <Check size={20} /> Valider et Créer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".pdf" 
        className="hidden" 
      />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Clients & Contrats</h1>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2" size="sm">
          <Plus size={16} />
          Nouveau Contrat
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un client ou une cellule..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Rechercher un client"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue bg-white"
            />
          </div>
          <p className="text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 leading-relaxed">
            Glissez-déposez vos PDF DocuSign pour les lier aux clients
          </p>
        </div>
        
        {/* Site Navigation Tabs */}
        <div className="flex gap-1 border-b border-slate-200 px-4 pt-1 overflow-x-auto" role="tablist" aria-label="Filtrer par site">
          {uniqueSites.map(site => (
            <button
              key={site}
              role="tab"
              aria-selected={activeSite === site}
              onClick={() => setActiveSite(site)}
              className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeSite === site 
                  ? 'border-brand-blue text-brand-blue' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
              }`}
            >
              <MapPin size={14} />
              {site}
              <Badge variant={activeSite === site ? 'blue' : 'secondary'} className="text-[10px]">
                {clients.filter(c => c.site === site).length}
              </Badge>
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" role="table">
            <thead className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 text-xs">Client</th>
                <th className="px-5 py-3.5 text-xs">Cellule</th>
                <th className="px-5 py-3.5 text-xs hidden sm:table-cell">Surface</th>
                <th className="px-5 py-3.5 text-xs hidden sm:table-cell">Loyer Mensuel</th>
                <th className="px-5 py-3.5 text-xs hidden md:table-cell">Dépôt</th>
                <th className="px-5 py-3.5 text-xs hidden md:table-cell">Statut</th>
                <th className="px-5 py-3.5 text-xs hidden lg:table-cell">Signature</th>
                <th className="px-5 py-3.5 text-xs hidden lg:table-cell">Fin Contrat</th>
                <th className="px-5 py-3.5 text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients
                .filter(client => client.site === activeSite)
                .filter(client => {
                  if (!searchQuery) return true;
                  const q = searchQuery.toLowerCase();
                  return client.name.toLowerCase().includes(q) || client.cell.toLowerCase().includes(q) || client.rent.toLowerCase().includes(q);
                })
                .sort((a, b) => {
                  const getNum = (str: string) => {
                    const match = str.match(/\d+/);
                    return match ? parseInt(match[0], 10) : 999;
                  };
                  return getNum(a.cell) - getNum(b.cell);
                })
                .map((client: any) => (
                  <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-900 text-sm">{client.name}</p>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-700">{client.cell}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-700 hidden sm:table-cell">{client.surface > 0 ? `${client.surface} m²` : '—'}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-700 hidden sm:table-cell">{client.rent}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-700 hidden md:table-cell">{client.depot > 0 ? `${client.depot.toLocaleString('fr-FR')} €` : '—'}</td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <Badge variant={client.status === 'Actif' ? 'success' : client.status === 'Travaux' ? 'secondary' : 'warning'}>
                        {client.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      {client.signature === 'Signé' ? (
                        <Badge variant="blue" className="gap-1.5">
                          <Check size={13} /> Signé
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="gap-1.5">
                          {client.signature}
                        </Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 text-xs hidden lg:table-cell">{client.finContrat || '—'}</td>
                    <td className="px-5 py-3.5 text-right">
                      {client.signature === 'Signé' ? (
                        <Button variant="ghost" size="sm" onClick={() => handleViewPDF(client)} className="text-brand-blue gap-1 text-xs">
                          <FileText size={14} /> Voir PDF
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => handleLinkPDFClick(client.id)} className="text-slate-400 hover:text-brand-blue gap-1 text-xs">
                          <Upload size={14} /> Lier PDF
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
