import React, { useState, useRef } from 'react';
import { FileText, Plus, Search, Check, ChevronRight, Download, MapPin, Upload } from 'lucide-react';

// Mock data for available cells
const availableCells = [
  { id: 'C02', name: 'Cellule A2', area: 50, price: 750 },
  { id: 'C05', name: 'Cellule C1', area: 25, price: 400 },
  { id: 'C08', name: 'Cellule D2', area: 200, price: 2600 },
];

const initialClients = [
  { id: 1, name: "TRANSIMPEX INTERNATIONAL SERVICES", site: "Site Boissy-l'Aillerie", cell: "13", rent: "1 400 € HT", status: "Actif", signature: "Signé" },
  { id: 3, name: "AFAQ", site: "Site Montigny", cell: "10", rent: "2 500 € HT", status: "Actif", signature: "Signé" },
  { id: 4, name: "ADF PLOMBERIE", site: "Site Montigny", cell: "8", rent: "2 600 € HT", status: "Actif", signature: "Signé" },
  { id: 5, name: "ABBYNAYA EXOTIQUE", site: "Site Montigny", cell: "13", rent: "2 300 € HT", status: "Actif", signature: "Signé" },
  { id: 6, name: "JO & LIZ", site: "Site Montigny", cell: "14", rent: "2 400 € HT", status: "Actif", signature: "Signé" },
  { id: 7, name: "KBE TECHNOLOGY", site: "Site Montigny", cell: "1 & 9", rent: "4 600 € HT", status: "Actif", signature: "Signé" },
  { id: 9, name: "BEN HADEF ZIED", site: "Site Boissy-l'Aillerie", cell: "1", rent: "1 800 € HT", status: "Actif", signature: "Signé" },
  { id: 10, name: "MADE IN WORLD", site: "Site Boissy-l'Aillerie", cell: "6", rent: "1 700 € HT", status: "Actif", signature: "Signé" },
  { id: 11, name: "INTERTRADE LOGISTICS", site: "Site Moussy", cell: "3", rent: "1 800 € HT", status: "Actif", signature: "Signé" },
  { id: 12, name: "EXCELLENCE RENOV MULTISERVICES", site: "Site Boissy-l'Aillerie", cell: "17", rent: "2 200 € HT", status: "Actif", signature: "Signé" },
  { id: 13, name: "TEMF TRANSPORT LOGISTICS", site: "Site Boissy-l'Aillerie", cell: "12", rent: "1 400 € HT", status: "Actif", signature: "Signé" },
  { id: 14, name: "ET VOILA", site: "Site Boissy-l'Aillerie", cell: "11", rent: "1 400 € HT", status: "Actif", signature: "Signé" },
  { id: 15, name: "MELSCHER SARL", site: "Site Boissy-l'Aillerie", cell: "18", rent: "1 700 € HT", status: "Actif", signature: "Signé" },
  { id: 16, name: "KOUS PRODUCTION", site: "Site Boissy-l'Aillerie", cell: "2", rent: "1 700 € HT", status: "Actif", signature: "Signé" },
  { id: 17, name: "KOZEN LOG", site: "Site Boissy-l'Aillerie", cell: "15", rent: "1 650 € HT", status: "Actif", signature: "Signé" },
  { id: 19, name: "JB GARAGE AUTO-SERVICES", site: "Site Boissy-l'Aillerie", cell: "10", rent: "1 900 € HT", status: "Actif", signature: "Signé" },
  { id: 20, name: "DIRECT ASSISTANCE", site: "Site Boissy-l'Aillerie", cell: "4 & 5", rent: "3 400 € HT", status: "Actif", signature: "Signé" },
  { id: 21, name: "AUTOLAVEUSE CENTER", site: "Site Boissy-l'Aillerie", cell: "16", rent: "1 700 € HT", status: "Actif", signature: "Signé" },
  { id: 22, name: "VERNOVA FRANCE", site: "Site Boissy-l'Aillerie", cell: "3", rent: "1 700 € HT", status: "Actif", signature: "Signé" },
  { id: 23, name: "PARFUM GLOBAL TRADE", site: "Site Boissy-l'Aillerie", cell: "19", rent: "1 700 € HT", status: "Actif", signature: "Signé" },
  { id: 24, name: "SOW COUVERTURE", site: "Site Moussy", cell: "4", rent: "2 000 € HT", status: "Actif", signature: "Signé" },
  { id: 28, name: "KOUASSI ASSIENIN - EMITEL MARKET", site: "Site Montigny", cell: "3", rent: "2 100 € HT", status: "Actif", signature: "Signé" },
  { id: 29, name: "PLAIDY", site: "Site Boissy-l'Aillerie", cell: "7", rent: "1 700 € HT", status: "Actif", signature: "Signé" },
  { id: 30, name: "SYL DEVELOPPEMENT", site: "Site Boissy-l'Aillerie", cell: "9", rent: "1 650 € HT", status: "Actif", signature: "Signé" },
  { id: 31, name: "SEMO SERVICES MODERNES", site: "Site Montigny", cell: "10", rent: "2 100 € HT", status: "Actif", signature: "Signé" },
  { id: 32, name: "OZ DISTRIBUTION", site: "Site Montigny", cell: "5", rent: "2 340 € HT", status: "Actif", signature: "Signé" },
  { id: 33, name: "SOLAROCK", site: "Site Montigny", cell: "2", rent: "2 500 € HT", status: "Actif", signature: "Signé" },
  { id: 34, name: "CLIENT TEST", site: "Nouveau Client", cell: "1", rent: "0 € HT", status: "En attente", signature: "Non signé" }
];

export default function Clients() {
  const [clients, setClients] = useState(initialClients);
  const uniqueSites = Array.from(new Set(clients.map(c => c.site))).sort();
  const [activeSite, setActiveSite] = useState(uniqueSites[0]);
  const [isCreating, setIsCreating] = useState(false);
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
          <button 
            onClick={() => setIsCreating(false)}
            className="text-slate-500 hover:text-slate-700 font-medium"
          >
            Annuler
          </button>
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
                <button 
                  onClick={handleNext}
                  disabled={!formData.companyName || !formData.representative}
                  className="bg-brand-blue text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant <ChevronRight size={20} />
                </button>
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
                <button 
                  onClick={handleBack}
                  className="px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100"
                >
                  Retour
                </button>
                <button 
                  onClick={handleNext}
                  disabled={!formData.cellId || !formData.startDate}
                  className="bg-brand-blue text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Aperçu du Contrat</h2>
                <button className="text-brand-blue font-medium flex items-center gap-2 hover:text-blue-800">
                  <Download size={20} />
                  Télécharger PDF
                </button>
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
                <button 
                  onClick={handleBack}
                  className="px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100"
                >
                  Retour
                </button>
                <button 
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
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-emerald-700"
                >
                  <Check size={20} /> Valider et Créer
                </button>
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
        <h1 className="text-2xl font-bold text-slate-900">Clients & Contrats</h1>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-brand-blue text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-800 transition-colors"
        >
          <Plus size={20} />
          Nouveau Contrat
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher un client ou une cellule..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
            />
          </div>
          <div className="text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            💡 Glissez-déposez vos PDF DocuSign dans le chat pour les lier aux clients
          </div>
        </div>
        
        {/* Site Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-200 px-4 pt-2">
          {uniqueSites.map(site => (
            <button
              key={site}
              onClick={() => setActiveSite(site)}
              className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
                activeSite === site 
                  ? 'border-brand-blue text-brand-blue' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <MapPin size={16} />
              {site}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Cellule</th>
                <th className="px-6 py-4">Loyer Mensuel</th>
                <th className="px-6 py-4">Statut Contrat</th>
                <th className="px-6 py-4">Signature (DocuSign)</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients
                .filter(client => client.site === activeSite)
                .sort((a, b) => {
                  const getNum = (str: string) => {
                    const match = str.match(/\d+/);
                    return match ? parseInt(match[0], 10) : 999;
                  };
                  return getNum(a.cell) - getNum(b.cell);
                })
                .map((client: any) => (
                  <tr key={client.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{client.name}</p>
                    </td>
                    <td className="px-6 py-4 font-medium">{client.cell}</td>
                    <td className="px-6 py-4 font-medium">{client.rent}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {client.signature === 'Signé' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <Check size={14} /> Signé
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          {client.signature}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {client.signature === 'Signé' ? (
                        <button 
                          onClick={() => handleViewPDF(client)}
                          className="text-brand-blue hover:text-blue-800 font-medium inline-flex items-center gap-1"
                        >
                          <FileText size={16} /> Voir PDF
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleLinkPDFClick(client.id)}
                          className="text-slate-400 hover:text-brand-blue font-medium inline-flex items-center gap-1 transition-colors"
                        >
                          <Upload size={16} /> Lier PDF
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
