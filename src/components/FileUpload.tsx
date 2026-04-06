import React, { useCallback, useState } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { SpacelogLogo } from './SpacelogLogo';

interface FileUploadProps {
  onDataLoaded: (data: any) => void;
}

export function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      
      // Logique de filtrage : on exclut les onglets contenant "spacelog 5" à "spacelog 12"
      const excludedPattern = /spacelog\s*(5|6|7|8|9|10|11|12)/i;
      
      const validSheets = workbook.SheetNames.filter(name => !excludedPattern.test(name));
      
      if (validSheets.length === 0) {
        throw new Error("Aucun onglet valide trouvé après exclusion des Spacelog 5 à 12.");
      }

      // Dans une application réelle, on parserait les données ici
      // const parsedData = validSheets.map(sheet => XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
      
      // Simulation d'un temps de traitement pour l'UX
      setTimeout(() => {
        setLoading(false);
        onDataLoaded({ sheets: validSheets, fileName: file.name });
      }, 1500);

    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Erreur lors de la lecture du fichier Excel.");
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        processFile(file);
      } else {
        setError("Veuillez déposer un fichier Excel (.xlsx ou .xls)");
      }
    }
  }, []);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <SpacelogLogo className="h-20 w-auto" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Reporting Investisseurs 2026</h2>
        <p className="text-slate-500">
          Déposez votre Business Plan (Excel). Les données des Spacelog 5 à 12 seront automatiquement exclues.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div 
            className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-200 ease-in-out flex flex-col items-center justify-center text-center
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
              ${loading ? 'opacity-50 pointer-events-none' : ''}
            `}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={onFileInput}
              disabled={loading}
            />
            
            {loading ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-slate-600 font-medium">Analyse et filtrage du BP en cours...</p>
              </div>
            ) : (
              <>
                <div className="h-20 w-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                  <UploadCloud className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Glissez-déposez votre fichier Excel</h3>
                <p className="text-slate-500 mb-6 max-w-sm">
                  Format .xlsx ou .xls supporté. Le fichier sera analysé localement.
                </p>
                <Button type="button" variant="outline" className="pointer-events-none">
                  Parcourir les fichiers
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-slate-400 mb-4">
          <span className="h-px w-12 bg-slate-200"></span>
          <span>ou</span>
          <span className="h-px w-12 bg-slate-200"></span>
        </div>
        <div>
          <Button variant="ghost" onClick={() => onDataLoaded({ demo: true })} className="text-slate-500 hover:text-slate-800">
            Voir un exemple de Dashboard (Mode Démo)
          </Button>
        </div>
      </div>
    </div>
  );
}
