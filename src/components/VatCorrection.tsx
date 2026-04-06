import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Calculator, ArrowRight, Info } from 'lucide-react';

export function VatCorrection() {
  const [cashJan, setCashJan] = useState<number>(150000);
  const [vatPaidJan, setVatPaidJan] = useState<number>(25000);
  
  const [cashFeb, setCashFeb] = useState<number>(120000);
  const [vatPaidFeb, setVatPaidFeb] = useState<number>(18000);

  // The user's provided VAT credits
  const vatCredits = {
    jan: 46431,
    feb: 33259,
    mar: 55766
  };

  const correctedCashJan = cashJan + vatPaidJan;
  // February cash is cumulative, so if January cash was higher by X, February cash is also higher by X,
  // PLUS the February VAT payment that shouldn't have been deducted.
  const correctedCashFeb = cashFeb + vatPaidJan + vatPaidFeb;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <Card className="border-blue-200 shadow-sm">
      <CardHeader className="bg-blue-50/50 rounded-t-xl border-b border-blue-100 pb-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-blue-900">Reconstitution de la Trésorerie (T1 2026)</CardTitle>
        </div>
        <CardDescription className="text-blue-700/80">
          Correction des décaissements de TVA suite aux reports de crédits (Jan: 46k€, Fév: 33k€, Mar: 55k€).
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        
        <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 text-sm text-blue-800">
          <Info className="h-5 w-5 shrink-0 mt-0.5" />
          <p>
            <strong>Contexte :</strong> Votre BP actuel déduit des paiements de TVA. Or, vous êtes en situation de crédit de TVA 
            (46 431 € en Janvier, 33 259 € en Février). Il n'y a donc <strong>aucun décaissement</strong> de TVA sur ces mois. 
            Saisissez les montants de votre BP ci-dessous pour recalculer la trésorerie réelle.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Janvier */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700 border-b pb-2">Fin Janvier 2026</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Trésorerie affichée au BP (€)</label>
                <Input 
                  type="number" 
                  value={cashJan} 
                  onChange={(e) => setCashJan(Number(e.target.value))}
                  className="font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Paiement TVA déduit à tort au BP (€)</label>
                <Input 
                  type="number" 
                  value={vatPaidJan} 
                  onChange={(e) => setVatPaidJan(Number(e.target.value))}
                  className="font-mono"
                />
              </div>
              
              <div className="pt-2">
                <div className="bg-slate-50 border rounded-md p-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Trésorerie Corrigée</span>
                  <span className="text-lg font-bold text-emerald-600">{formatCurrency(correctedCashJan)}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 text-right">
                  (Tréso BP + Paiement annulé)
                </p>
              </div>
            </div>
          </div>

          {/* Février */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700 border-b pb-2">Fin Février 2026</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Trésorerie affichée au BP (€)</label>
                <Input 
                  type="number" 
                  value={cashFeb} 
                  onChange={(e) => setCashFeb(Number(e.target.value))}
                  className="font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Paiement TVA déduit à tort au BP (€)</label>
                <Input 
                  type="number" 
                  value={vatPaidFeb} 
                  onChange={(e) => setVatPaidFeb(Number(e.target.value))}
                  className="font-mono"
                />
              </div>
              
              <div className="pt-2">
                <div className="bg-slate-50 border rounded-md p-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Trésorerie Corrigée</span>
                  <span className="text-lg font-bold text-emerald-600">{formatCurrency(correctedCashFeb)}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 text-right">
                  (Tréso BP + Paiement annulé Janv + Paiement annulé Fév)
                </p>
              </div>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
