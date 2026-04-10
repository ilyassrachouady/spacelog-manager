/**
 * Reconciliation Engine — cross-references Excel data, Qonto, Stripe & Pennylane
 * to surface anomalies, discrepancies, and actionable alerts.
 */

import type { ApiData } from './ApiContext';
import {
  clientData, loanData, siteData,
  realRevenues2026, realExpenses2026, debtService2026,
  occupancyRates, vatCredits2026,
} from './data';

// ── Alert types ──

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertCategory =
  | 'treasury'       // bank balance vs forecast
  | 'revenue'        // invoiced vs collected
  | 'expense'        // budget vs actual
  | 'occupancy'      // expected vs real
  | 'debt'           // loan payment verification
  | 'contract'       // expiring / expired contracts
  | 'invoice'        // overdue / unpaid
  | 'vat';           // VAT discrepancy

export interface ReconciliationAlert {
  id: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  description: string;
  amount?: number;          // monetary value involved
  expectedValue?: number;   // what was expected
  actualValue?: number;     // what was found
  delta?: number;           // difference
  site?: string;            // affected site
  action?: string;          // suggested action
}

// ── Helpers ──

const MONTH_NAMES = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const currentMonthIdx = new Date().getMonth(); // 0-based
const currentMonth = MONTH_NAMES[currentMonthIdx];

const fmt = (v: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

// ── Main reconciliation function ──

export function runReconciliation(api: ApiData): ReconciliationAlert[] {
  const alerts: ReconciliationAlert[] = [];
  let idCounter = 0;
  const nextId = () => `recon-${++idCounter}`;

  // ══════════════════════════════════════════
  //  1. TREASURY RECONCILIATION
  //     Compare Qonto live balance vs Excel forecast
  // ══════════════════════════════════════════
  if (api.qontoBalance != null) {
    // Sum the cash flow forecast up to current month
    const consolidated2026 = siteData.consolidated.monthlyData[2026] || [];
    let forecastBalance = 23309; // starting balance from data
    for (let i = 0; i <= Math.min(currentMonthIdx, consolidated2026.length - 1); i++) {
      forecastBalance += consolidated2026[i]?.flux || 0;
    }

    const delta = api.qontoBalance - forecastBalance;
    const absDelta = Math.abs(delta);
    const pctDelta = forecastBalance !== 0 ? Math.abs(delta / forecastBalance) * 100 : 0;

    if (pctDelta > 5 && absDelta > 1000) {
      alerts.push({
        id: nextId(),
        severity: pctDelta > 20 ? 'critical' : 'warning',
        category: 'treasury',
        title: delta < 0 ? 'Trésorerie sous le prévisionnel' : 'Trésorerie au-dessus du prévisionnel',
        description: `Solde Qonto ${fmt(api.qontoBalance)} vs prévisionnel ${fmt(forecastBalance)} (${delta > 0 ? '+' : ''}${fmt(delta)}, ${pctDelta.toFixed(0)}%)`,
        expectedValue: forecastBalance,
        actualValue: api.qontoBalance,
        delta,
        action: delta < 0
          ? 'Vérifier les encaissements attendus et les dépenses non prévues'
          : 'Confirmer la source de l\'excédent (dépôts anticipés, remboursements)',
      });
    }
  }

  // ══════════════════════════════════════════
  //  2. REVENUE RECONCILIATION
  //     Compare Pennylane invoiced amounts vs Excel CA
  // ══════════════════════════════════════════
  if (api.pennylaneInvoices.length > 0) {
    // Total invoiced this year via Pennylane
    const currentYear = new Date().getFullYear();
    const yearInvoices = api.pennylaneInvoices.filter(inv => {
      const invYear = new Date(inv.date).getFullYear();
      return invYear === currentYear;
    });
    const totalInvoiced = yearInvoices.reduce((s, inv) => s + inv.amount, 0);

    // Expected YTD revenue from Excel
    const revenueRows = realRevenues2026.consolidated || [];
    const expectedYtdRevenue = revenueRows
      .slice(0, currentMonthIdx + 1)
      .reduce((s, r) => s + (r.reel ?? r.bp), 0);

    if (expectedYtdRevenue > 0) {
      const revDelta = totalInvoiced - expectedYtdRevenue;
      const revPct = Math.abs(revDelta / expectedYtdRevenue) * 100;

      if (revPct > 10 && Math.abs(revDelta) > 2000) {
        alerts.push({
          id: nextId(),
          severity: revPct > 25 ? 'critical' : 'warning',
          category: 'revenue',
          title: revDelta < 0
            ? 'Facturation en retard par rapport au prévisionnel'
            : 'Facturation supérieure au prévisionnel',
          description: `Facturé YTD ${fmt(totalInvoiced)} (Pennylane) vs CA attendu ${fmt(expectedYtdRevenue)} (Excel). Écart de ${revDelta > 0 ? '+' : ''}${fmt(revDelta)}`,
          expectedValue: expectedYtdRevenue,
          actualValue: totalInvoiced,
          delta: revDelta,
          action: revDelta < 0
            ? 'Vérifier si des factures sont manquantes dans Pennylane ou des loyers non facturés'
            : 'Confirmer les revenus supplémentaires (factures exceptionnelles, régularisations)',
        });
      }
    }

    // 2b. Collected vs invoiced — Stripe encaissements vs Pennylane paid
    const paidInvoicesTotal = yearInvoices
      .filter(inv => inv.paid)
      .reduce((s, inv) => s + inv.amount, 0);
    const stripeCollected = (api.stripeBalance?.available || 0) + (api.stripeBalance?.pending || 0);

    if (stripeCollected > 0 && paidInvoicesTotal > 0) {
      const collectionDelta = stripeCollected - paidInvoicesTotal;
      const collectionPct = Math.abs(collectionDelta / paidInvoicesTotal) * 100;

      if (collectionPct > 15 && Math.abs(collectionDelta) > 1000) {
        alerts.push({
          id: nextId(),
          severity: 'warning',
          category: 'revenue',
          title: 'Décalage Stripe vs factures payées Pennylane',
          description: `Stripe: ${fmt(stripeCollected)} vs factures payées: ${fmt(paidInvoicesTotal)}. Possible décalage d'encaissement ou moyen de paiement non-Stripe.`,
          expectedValue: paidInvoicesTotal,
          actualValue: stripeCollected,
          delta: collectionDelta,
          action: 'Rapprocher les paiements Stripe avec les factures Pennylane pour identifier les écarts',
        });
      }
    }
  }

  // ══════════════════════════════════════════
  //  3. OVERDUE INVOICES
  //     Unpaid Pennylane invoices past deadline
  // ══════════════════════════════════════════
  const today = new Date();
  const overdueInvoices = api.pennylaneInvoices.filter(inv => {
    if (inv.paid) return false;
    if (inv.status === 'late' || inv.status === 'overdue') return true;
    if (inv.deadline) {
      const deadline = new Date(inv.deadline);
      return deadline < today && inv.remaining_amount > 0;
    }
    return false;
  });

  if (overdueInvoices.length > 0) {
    const totalOverdue = overdueInvoices.reduce((s, inv) => s + inv.remaining_amount, 0);
    const oldest = overdueInvoices.reduce((old, inv) => {
      const d = new Date(inv.deadline);
      return d < new Date(old.deadline) ? inv : old;
    });
    const daysSinceOldest = Math.floor((today.getTime() - new Date(oldest.deadline).getTime()) / 86400000);

    alerts.push({
      id: nextId(),
      severity: totalOverdue > 5000 || daysSinceOldest > 30 ? 'critical' : 'warning',
      category: 'invoice',
      title: `${overdueInvoices.length} facture${overdueInvoices.length > 1 ? 's' : ''} impayée${overdueInvoices.length > 1 ? 's' : ''} en retard`,
      description: `Total impayé: ${fmt(totalOverdue)}. Plus ancien retard: ${daysSinceOldest}j (${oldest.customer || oldest.invoice_number})`,
      amount: totalOverdue,
      action: 'Relancer immédiatement les clients en retard de paiement',
    });
  }

  // ══════════════════════════════════════════
  //  4. EXPENSE OVERRUN
  //     Compare YTD actual expenses vs budget
  // ══════════════════════════════════════════
  for (const [siteKey, siteLabel] of [
    ['consolidated', 'Consolidé'],
    ['montigny', 'Montigny'],
    ['boissy', 'Boissy'],
    ['boissyExt', 'Moussy'],
    ['batiment4', 'Trappes'],
  ] as const) {
    const expenses = realExpenses2026[siteKey] || [];
    const ytdBudget = expenses
      .slice(0, currentMonthIdx + 1)
      .reduce((s, e) => s + e.bp, 0);
    const ytdActual = expenses
      .slice(0, currentMonthIdx + 1)
      .reduce((s, e) => s + (e.reel ?? e.bp), 0);

    if (ytdBudget > 0) {
      const expDelta = ytdActual - ytdBudget;
      const expPct = (expDelta / ytdBudget) * 100;

      if (expPct > 10 && expDelta > 2000) {
        alerts.push({
          id: nextId(),
          severity: expPct > 25 ? 'critical' : 'warning',
          category: 'expense',
          title: `Dépassement de budget — ${siteLabel}`,
          description: `Charges YTD ${fmt(ytdActual)} vs budget ${fmt(ytdBudget)} (+${expPct.toFixed(0)}%, +${fmt(expDelta)})`,
          expectedValue: ytdBudget,
          actualValue: ytdActual,
          delta: expDelta,
          site: siteLabel,
          action: 'Analyser les postes de dépenses et identifier les surcoûts',
        });
      }
    }
  }

  // ══════════════════════════════════════════
  //  5. CONTRACT EXPIRATION
  //     Contracts expiring within 60 days
  // ══════════════════════════════════════════
  const expiringContracts: { client: string; site: string; end: Date; loyer: number }[] = [];
  const expiredContracts: { client: string; site: string; end: Date; loyer: number }[] = [];

  for (const [siteKey, siteLabel] of [
    ['montigny', 'Montigny'],
    ['boissy', 'Boissy'],
    ['moussy', 'Moussy'],
    ['trappes', 'Trappes'],
  ] as const) {
    const clients = clientData[siteKey] || [];
    for (const c of clients) {
      if (!c.finContrat || c.status !== 'actif') continue;
      // Parse date — skip non-date values like "6 mois exp"
      const endDate = new Date(c.finContrat);
      if (isNaN(endDate.getTime())) continue;

      const daysUntilExpiry = Math.floor((endDate.getTime() - today.getTime()) / 86400000);

      if (daysUntilExpiry < 0) {
        expiredContracts.push({ client: c.client, site: siteLabel, end: endDate, loyer: c.loyer });
      } else if (daysUntilExpiry <= 60) {
        expiringContracts.push({ client: c.client, site: siteLabel, end: endDate, loyer: c.loyer });
      }
    }
  }

  if (expiredContracts.length > 0) {
    const totalRevAtRisk = expiredContracts.reduce((s, c) => s + c.loyer, 0);
    const names = expiredContracts.slice(0, 3).map(c => c.client).join(', ');
    alerts.push({
      id: nextId(),
      severity: 'critical',
      category: 'contract',
      title: `${expiredContracts.length} contrat${expiredContracts.length > 1 ? 's' : ''} expiré${expiredContracts.length > 1 ? 's' : ''} non renouvelé${expiredContracts.length > 1 ? 's' : ''}`,
      description: `${names}${expiredContracts.length > 3 ? ` +${expiredContracts.length - 3} autres` : ''} — ${fmt(totalRevAtRisk)}/mois de CA menacé`,
      amount: totalRevAtRisk,
      action: 'Contacter les locataires pour renouvellement ou lancer la re-commercialisation',
    });
  }

  if (expiringContracts.length > 0) {
    const totalRevAtRisk = expiringContracts.reduce((s, c) => s + c.loyer, 0);
    const names = expiringContracts.slice(0, 3).map(c => `${c.client} (${c.site})`).join(', ');
    alerts.push({
      id: nextId(),
      severity: 'warning',
      category: 'contract',
      title: `${expiringContracts.length} contrat${expiringContracts.length > 1 ? 's' : ''} expire${expiringContracts.length > 1 ? 'nt' : ''} sous 60 jours`,
      description: `${names}${expiringContracts.length > 3 ? ` +${expiringContracts.length - 3} autres` : ''} — ${fmt(totalRevAtRisk)}/mois à sécuriser`,
      amount: totalRevAtRisk,
      action: 'Anticiper les renouvellements pour éviter la vacance locative',
    });
  }

  // ══════════════════════════════════════════
  //  6. OCCUPANCY GAP
  //     Compare actual occupancy vs expected rate
  // ══════════════════════════════════════════
  for (const [siteKey, siteLabel] of [
    ['montigny', 'Montigny'],
    ['boissy', 'Boissy'],
    ['moussy', 'Moussy'],
  ] as const) {
    const clients = clientData[siteKey] || [];
    const total = siteData[siteKey].info.cellules;
    const actualOccupied = clients.filter(c => c.status === 'actif').length;
    const actualRate = Math.round((actualOccupied / total) * 100);
    const expectedRate = occupancyRates[siteKey === 'moussy' ? 'boissyExt' : siteKey];

    if (expectedRate > 0 && actualRate < expectedRate - 10) {
      alerts.push({
        id: nextId(),
        severity: (expectedRate - actualRate) > 20 ? 'critical' : 'warning',
        category: 'occupancy',
        title: `Occupation en retard — ${siteLabel}`,
        description: `Taux réel ${actualRate}% vs prévisionnel ${expectedRate}% (${actualOccupied}/${total} cellules)`,
        expectedValue: expectedRate,
        actualValue: actualRate,
        delta: actualRate - expectedRate,
        site: siteLabel,
        action: 'Renforcer la prospection commerciale sur ce site',
      });
    }
  }

  // ══════════════════════════════════════════
  //  7. DEBT SERVICE COVERAGE
  //     Can current cash flow cover monthly loan payments?
  // ══════════════════════════════════════════
  const totalMonthlyDebt = Object.values(debtService2026).reduce((s, v) => s + v, 0);
  const consolidatedRevenues = realRevenues2026.consolidated || [];
  const consolidatedExpenses = realExpenses2026.consolidated || [];
  const latestMonthRevenue = consolidatedRevenues[currentMonthIdx]?.reel ?? consolidatedRevenues[currentMonthIdx]?.bp ?? 0;
  const latestMonthExpenses = consolidatedExpenses[currentMonthIdx]?.reel ?? consolidatedExpenses[currentMonthIdx]?.bp ?? 0;
  const monthlyNetCashFlow = latestMonthRevenue - latestMonthExpenses;
  const dscr = totalMonthlyDebt > 0 ? monthlyNetCashFlow / totalMonthlyDebt : 999;

  if (dscr < 1.2 && totalMonthlyDebt > 0) {
    alerts.push({
      id: nextId(),
      severity: dscr < 1.0 ? 'critical' : 'warning',
      category: 'debt',
      title: dscr < 1.0 ? 'Couverture dette insuffisante' : 'Couverture dette fragile',
      description: `DSCR ${dscr.toFixed(2)}x — Cash flow net ${fmt(monthlyNetCashFlow)} vs service dette ${fmt(totalMonthlyDebt)}/mois`,
      expectedValue: totalMonthlyDebt * 1.2,
      actualValue: monthlyNetCashFlow,
      delta: monthlyNetCashFlow - totalMonthlyDebt,
      action: dscr < 1.0
        ? 'URGENT: Le cash flow ne couvre pas les échéances de prêt. Revoir les dépenses immédiatement.'
        : 'Surveiller de près — marge de sécurité faible sur le remboursement des emprunts',
    });
  }

  // ══════════════════════════════════════════
  //  8. QONTO TRANSACTION ANOMALIES
  //     Detect unusual large debits vs historical pattern
  // ══════════════════════════════════════════
  if (api.qontoTransactions.length > 5) {
    const debits = api.qontoTransactions.filter(tx => tx.side === 'debit' && tx.amount > 0);
    if (debits.length > 3) {
      const amounts = debits.map(tx => tx.amount);
      const avg = amounts.reduce((s, a) => s + a, 0) / amounts.length;
      const stdDev = Math.sqrt(amounts.reduce((s, a) => s + Math.pow(a - avg, 2), 0) / amounts.length);
      const threshold = avg + 2.5 * stdDev;

      const outliers = debits.filter(tx => tx.amount > threshold && tx.amount > 2000);
      if (outliers.length > 0) {
        const biggest = outliers.reduce((max, tx) => tx.amount > max.amount ? tx : max);
        alerts.push({
          id: nextId(),
          severity: 'warning',
          category: 'expense',
          title: 'Débit inhabituellement élevé détecté',
          description: `${biggest.label || biggest.counterparty || 'Transaction'}: ${fmt(biggest.amount)} (moyenne des débits: ${fmt(avg)})`,
          amount: biggest.amount,
          expectedValue: avg,
          actualValue: biggest.amount,
          action: 'Vérifier que ce débit est autorisé et correctement comptabilisé',
        });
      }
    }
  }

  // ══════════════════════════════════════════
  //  9. PENDING DEPOSITS (Stripe)
  //     Large amounts stuck in pending
  // ══════════════════════════════════════════
  if (api.stripeBalance && api.stripeBalance.pending > 5000) {
    alerts.push({
      id: nextId(),
      severity: api.stripeBalance.pending > 20000 ? 'warning' : 'info',
      category: 'treasury',
      title: 'Fonds Stripe en attente de virement',
      description: `${fmt(api.stripeBalance.pending)} en cours de transfert vers votre compte bancaire`,
      amount: api.stripeBalance.pending,
      action: 'Vérifier le calendrier de virement Stripe (généralement 2-7 jours ouvrés)',
    });
  }

  // ══════════════════════════════════════════
  // 10. MISSING DOCUSIGN
  //     Active clients without signed contract
  // ══════════════════════════════════════════
  const unsignedActive: { client: string; site: string; loyer: number }[] = [];
  for (const [siteKey, siteLabel] of [
    ['montigny', 'Montigny'],
    ['boissy', 'Boissy'],
    ['moussy', 'Moussy'],
  ] as const) {
    const clients = clientData[siteKey] || [];
    for (const c of clients) {
      if (c.status === 'actif' && c.docusign !== 'ok' && c.loyer > 0) {
        unsignedActive.push({ client: c.client, site: siteLabel, loyer: c.loyer });
      }
    }
  }

  if (unsignedActive.length > 0) {
    const names = unsignedActive.slice(0, 3).map(c => c.client).join(', ');
    alerts.push({
      id: nextId(),
      severity: 'warning',
      category: 'contract',
      title: `${unsignedActive.length} locataire${unsignedActive.length > 1 ? 's' : ''} actif${unsignedActive.length > 1 ? 's' : ''} sans contrat signé`,
      description: `${names}${unsignedActive.length > 3 ? ` +${unsignedActive.length - 3} autres` : ''} — Risque juridique`,
      amount: unsignedActive.reduce((s, c) => s + c.loyer, 0),
      action: 'Envoyer les contrats DocuSign en priorité pour sécuriser les revenus',
    });
  }

  // Sort: critical first, then warning, then info
  const severityOrder: Record<AlertSeverity, number> = { critical: 0, warning: 1, info: 2 };
  alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return alerts;
}
