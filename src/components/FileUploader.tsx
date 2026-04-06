import React, { useState, useCallback } from 'react';
import { UploadCloud, Loader2, X } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import * as XLSX from 'xlsx';

interface FileUploaderProps {
  onDataExtracted: (data: any) => void;
  onClose: () => void;
}

export default function FileUploader({ onDataExtracted, onClose }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callGemini = async (contentParts: any[]) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
      Analyse les documents financiers fournis (ils peuvent inclure la balance comptable pour le réel, et un fichier de prévisions/budget).
      Extrais les données réelles (actuals) et les budgets (prévisions) pour les mois de Janvier et Février.
      Croise les informations des différents fichiers si nécessaire pour comparer le réel et le budget.
      Organise les données par site : consolidated, montigny, boissy, moussy, trappes, nouveauSite.
      
      Pour chaque site, extrais :
      1. Les charges d'exploitation (Eau & Électricité, Leasing & Locations, Entretien & Réparations, Assurances, Internet & Téléphonie, Impôts & Taxes).
      2. Les revenus (Chiffre d'Affaires HT).
      3. Les charges financières (Intérêts d'emprunt, Frais Bancaires).
      
      Si une donnée est manquante, mets 0.
      Retourne UNIQUEMENT un objet JSON valide avec la structure demandée.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: [
        ...contentParts,
        prompt
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            actualsDataBySite: {
              type: Type.OBJECT,
              description: "Les charges d'exploitation par site",
              properties: {
                consolidated: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, type: { type: Type.STRING }, janActual: { type: Type.NUMBER }, janBudget: { type: Type.NUMBER }, febActual: { type: Type.NUMBER }, febBudget: { type: Type.NUMBER } } } },
                montigny: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, type: { type: Type.STRING }, janActual: { type: Type.NUMBER }, janBudget: { type: Type.NUMBER }, febActual: { type: Type.NUMBER }, febBudget: { type: Type.NUMBER } } } },
                boissy: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, type: { type: Type.STRING }, janActual: { type: Type.NUMBER }, janBudget: { type: Type.NUMBER }, febActual: { type: Type.NUMBER }, febBudget: { type: Type.NUMBER } } } },
                moussy: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, type: { type: Type.STRING }, janActual: { type: Type.NUMBER }, janBudget: { type: Type.NUMBER }, febActual: { type: Type.NUMBER }, febBudget: { type: Type.NUMBER } } } },
                trappes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, type: { type: Type.STRING }, janActual: { type: Type.NUMBER }, janBudget: { type: Type.NUMBER }, febActual: { type: Type.NUMBER }, febBudget: { type: Type.NUMBER } } } },
                nouveauSite: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, type: { type: Type.STRING }, janActual: { type: Type.NUMBER }, janBudget: { type: Type.NUMBER }, febActual: { type: Type.NUMBER }, febBudget: { type: Type.NUMBER } } } },
              }
            },
            pnlDataBySite: {
              type: Type.OBJECT,
              description: "Les revenus et charges financières par site",
              properties: {
                consolidated: { type: Type.OBJECT, properties: { revenues: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, jan: { type: Type.NUMBER }, feb: { type: Type.NUMBER } } } }, financial: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, jan: { type: Type.NUMBER }, feb: { type: Type.NUMBER } } } } } },
                montigny: { type: Type.OBJECT, properties: { revenues: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, jan: { type: Type.NUMBER }, feb: { type: Type.NUMBER } } } }, financial: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, jan: { type: Type.NUMBER }, feb: { type: Type.NUMBER } } } } } },
                boissy: { type: Type.OBJECT, properties: { revenues: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, jan: { type: Type.NUMBER }, feb: { type: Type.NUMBER } } } }, financial: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, jan: { type: Type.NUMBER }, feb: { type: Type.NUMBER } } } } } },
                moussy: { type: Type.OBJECT, properties: { revenues: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, jan: { type: Type.NUMBER }, feb: { type: Type.NUMBER } } } }, financial: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, jan: { type: Type.NUMBER }, feb: { type: Type.NUMBER } } } } } },
                trappes: { type: Type.OBJECT, properties: { revenues: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, jan: { type: Type.NUMBER }, feb: { type: Type.NUMBER } } } }, financial: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, jan: { type: Type.NUMBER }, feb: { type: Type.NUMBER } } } } } },
                nouveauSite: { type: Type.OBJECT, properties: { revenues: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, jan: { type: Type.NUMBER }, feb: { type: Type.NUMBER } } } }, financial: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, jan: { type: Type.NUMBER }, feb: { type: Type.NUMBER } } } } } },
              }
            }
          }
        }
      }
    });

    if (response.text) {
      try {
        let cleanText = response.text.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.substring(7);
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.substring(3);
        }
        if (cleanText.endsWith('```')) {
          cleanText = cleanText.substring(0, cleanText.length - 3);
        }
        cleanText = cleanText.trim();
        
        const extractedData = JSON.parse(cleanText);
        onDataExtracted(extractedData);
        onClose();
      } catch (parseError: any) {
        console.error("Erreur de parsing JSON:", response.text);
        throw new Error("Erreur de format des données reçues de l'IA.");
      }
    } else {
      throw new Error("Aucune donnée extraite.");
    }
  };

  const processFiles = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);

    try {
      const contentParts: any[] = [];

      for (const file of files) {
        const isPdf = file.name.toLowerCase().endsWith('.pdf');

        if (isPdf) {
          const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          contentParts.push({
            inlineData: {
              data: base64Data,
              mimeType: 'application/pdf',
            }
          });
        } else {
          const allText = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                
                let text = '';
                workbook.SheetNames.forEach(sheetName => {
                  const worksheet = workbook.Sheets[sheetName];
                  const csv = XLSX.utils.sheet_to_csv(worksheet);
                  text += `\n--- Fichier: ${file.name} | Feuille: ${sheetName} ---\n${csv}\n`;
                });
                resolve(text);
              } catch (err) {
                reject(err);
              }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
          });
          
          let truncatedText = allText;
          if (truncatedText.length > 500000) {
            truncatedText = truncatedText.substring(0, 500000) + "\n[...TRONQUÉ CAR FICHIER TROP VOLUMINEUX...]";
          }
          contentParts.push({ text: truncatedText });
        }
      }

      await callGemini(contentParts);
    } catch (err: any) {
      console.error("Erreur globale:", err);
      setError(`Erreur lors de l'analyse: ${err.message || "Fichiers corrompus"}`);
      setIsProcessing(false);
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
      processFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">Importer des données</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-700 rounded-lg text-sm border border-rose-100">
              {error}
            </div>
          )}
          
          <div 
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
            } ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
            onClick={() => !isProcessing && document.getElementById('file-upload')?.click()}
          >
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={onFileInput}
              accept=".csv,.xlsx,.xls,.pdf"
              multiple
            />
            
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="text-sm font-medium text-slate-700">Analyse IA en cours...</p>
                <p className="text-xs text-slate-500">Extraction et comparaison des données...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Cliquez ou glissez-déposez vos fichiers</p>
                  <p className="text-xs text-slate-500 mt-1">Vous pouvez sélectionner plusieurs fichiers (Excel, CSV, PDF)</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
