import React, { useState, useCallback } from 'react';
import { UploadCloud, Loader2, X } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import * as XLSX from 'xlsx';

interface InvestorUploaderProps {
  onDataExtracted: (data: any) => void;
  onClose: () => void;
}

export default function InvestorUploader({ onDataExtracted, onClose }: InvestorUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callGemini = async (contentParts: any[]) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
      Analyse ces documents financiers (bilans, comptes de résultat, liasses fiscales ou balances comptables pour 2024 et 2025).
      
      Fais un comparatif DÉTAILLÉ LIGNE PAR LIGNE, en particulier pour les POSTES DE CHARGES (Achats, Charges externes détaillées comme loyers, honoraires, déplacements, Salaires, Impôts, Charges Financières, etc.). L'objectif est de comprendre précisément quelle ligne de charge a explosé ou diminué entre 2024 et 2025.
      Inclus également les lignes de revenus (Chiffre d'Affaires, etc.) pour avoir une vue complète.
      Pour chaque ligne, donne le montant total pour 2024 et le montant total pour 2025.
      
      Génère également une "analyse investisseur" (executive summary) d'environ 3 à 5 phrases qui met en évidence :
      - L'évolution de la rentabilité et du chiffre d'affaires.
      - Les lignes de dépenses spécifiques qui ont le plus varié (qui expliquent l'évolution des charges).
      - Une conclusion sur la santé financière pour un investisseur.
      
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
            analysis: {
              type: Type.STRING,
              description: "Analyse textuelle pour l'investisseur (executive summary)"
            },
            comparison: {
              type: Type.ARRAY,
              description: "Comparatif ligne par ligne",
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: "Nom du poste (ex: Chiffre d'Affaires, Charges Externes)" },
                  year2024: { type: Type.NUMBER, description: "Montant 2024" },
                  year2025: { type: Type.NUMBER, description: "Montant 2025" }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      try {
        let cleanText = response.text.trim();
        if (cleanText.startsWith('```json')) cleanText = cleanText.substring(7);
        else if (cleanText.startsWith('```')) cleanText = cleanText.substring(3);
        if (cleanText.endsWith('```')) cleanText = cleanText.substring(0, cleanText.length - 3);
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
          <h3 className="text-lg font-semibold text-slate-900">Analyse Investisseur (2024 vs 2025)</h3>
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
            onClick={() => !isProcessing && document.getElementById('investor-file-upload')?.click()}
          >
            <input 
              type="file" 
              id="investor-file-upload" 
              className="hidden" 
              onChange={onFileInput}
              accept=".csv,.xlsx,.xls,.pdf"
              multiple
            />
            
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="text-sm font-medium text-slate-700">Génération de l'analyse en cours...</p>
                <p className="text-xs text-slate-500">Comparaison 2024 vs 2025 et rédaction de la synthèse...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Glissez vos bilans, comptes de résultat (PDF) ou balances</p>
                  <p className="text-xs text-slate-500 mt-1">Sélectionnez vos documents 2024 et 2025 en même temps</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
