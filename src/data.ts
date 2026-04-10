// ============================================================
// SPACELOG MANAGER - Data extracted from Excel reporting
// Source: reporting 4 batiments VERSION 15-03.xlsx
// ============================================================

// --- Types ---
export interface YearlyData {
  year: number;
  revenue: number;
  expenses: number;
  ebitda: number;
  resultatNet: number;
  fluxTresorerie: number;
  tresorerieFin: number;
  totalEmprunt: number;
  impots: number;
  leasePay: number;
  amortissements: number;
}

export interface MonthlyData {
  month: string;
  ca: number;
  charges: number;
  ebitda: number;
  flux: number;
  tresorerie: number;
}

export interface ExpenseItem {
  name: string;
  value: number;
}

export interface ClientData {
  cell: string;
  surface: number;
  client: string;
  docusign: string;
  finContrat: string;
  duree: number;
  depot: number;
  loyer: number;
  status: 'actif' | 'en_attente' | 'libre' | 'travaux';
}

export interface LoanData {
  name: string;
  montant: number;
  taux: number;
  duree: number;
  mensualite: number;
}

export interface SiteInfo {
  lieu: string;
  acquisition?: string;
  prix: number;
  fraisNotaire?: number;
  fraisAgence?: number;
  travaux?: number;
  coutTotal: number;
  apport: number;
  cellules: number;
  debutExploitation?: string;
  exploitation100?: string;
  nbSites?: number;
}

export interface SiteData {
  yearlyData: YearlyData[];
  monthlyData: Record<number, MonthlyData[]>;
  expenseBreakdown: Record<number, ExpenseItem[]>;
  info: SiteInfo;
}

export type SiteKey = 'consolidated' | 'montigny' | 'boissy' | 'moussy' | 'trappes';

const consolidatedDataYearly: YearlyData[] = [
  { year: 2025, revenue: 918184, expenses: 167065, ebitda: 751119, resultatNet: 36129.61, fluxTresorerie: 158813.94, tresorerieFin: 949140.03, totalEmprunt: 417079.06, impots: 75936, leasePay: 99290, amortissements: 356218 },
  { year: 2026, revenue: 1204295, expenses: 233829, ebitda: 970466, resultatNet: -15734.45, fluxTresorerie: 177209.41, tresorerieFin: 2727270.34, totalEmprunt: 562451.84, impots: 78349, leasePay: 155760, amortissements: 473556 },
  { year: 2027, revenue: 1508370, expenses: 208620, ebitda: 1299750, resultatNet: 280648.58, fluxTresorerie: 416351.75, tresorerieFin: 6574567.52, totalEmprunt: 603121.32, impots: 81949, leasePay: 181740, amortissements: 473556 },
  { year: 2028, revenue: 1537620, expenses: 208620, ebitda: 1329000, resultatNet: 350155.72, fluxTresorerie: 493121.75, tresorerieFin: 12533828.92, totalEmprunt: 603121.32, impots: 81949, leasePay: 134220, amortissements: 473556 },
  { year: 2029, revenue: 1537620, expenses: 208620, ebitda: 1329000, resultatNet: 369248.43, fluxTresorerie: 505601.75, tresorerieFin: 18816160.33, totalEmprunt: 603121.32, impots: 81949, leasePay: 121740, amortissements: 473556 },
  { year: 2030, revenue: 1537620, expenses: 208620, ebitda: 1329000, resultatNet: 408781.78, fluxTresorerie: 543041.75, tresorerieFin: 25525586.73, totalEmprunt: 603121.32, impots: 81949, leasePay: 82450, amortissements: 473556 },
  { year: 2031, revenue: 1537620, expenses: 208620, ebitda: 1329000, resultatNet: 462730.69, fluxTresorerie: 591841.75, tresorerieFin: 32715373.13, totalEmprunt: 603121.32, impots: 81949, leasePay: 24400, amortissements: 473556 },
  { year: 2032, revenue: 1537620, expenses: 208620, ebitda: 1329000, resultatNet: 491790.77, fluxTresorerie: 616241.75, tresorerieFin: 40687183.58, totalEmprunt: 600241.70, impots: 81949, leasePay: 0, amortissements: 473556 },
  { year: 2033, revenue: 1537620, expenses: 208620, ebitda: 1329000, resultatNet: 502754.77, fluxTresorerie: 616241.75, tresorerieFin: 48806459.35, totalEmprunt: 594482.46, impots: 81949, leasePay: 0, amortissements: 473556 },
];

const consolidatedDataMonthly: Record<number, MonthlyData[]> = {
  2025: [
    { month: 'Jan', ca: 66142, charges: 12500, ebitda: 53642, flux: 5778.01, tresorerie: 5778.01 },
    { month: 'Fév', ca: 67910, charges: 12500, ebitda: 55410, flux: 7546.01, tresorerie: 13324.02 },
    { month: 'Mar', ca: 69810, charges: 12500, ebitda: 57310, flux: 9446.01, tresorerie: 22770.03 },
    { month: 'Avr', ca: 76242, charges: 12500, ebitda: 63742, flux: 15878.01, tresorerie: 38648.04 },
    { month: 'Mai', ca: 77910, charges: 12500, ebitda: 65410, flux: 17546.01, tresorerie: 56194.05 },
    { month: 'Juin', ca: 78310, charges: 12500, ebitda: 65810, flux: 17946.01, tresorerie: 74140.06 },
    { month: 'Juil', ca: 76610, charges: 16000, ebitda: 60610, flux: 11097.77, tresorerie: 85237.83 },
    { month: 'Août', ca: 76610, charges: 12500, ebitda: 64110, flux: 14597.77, tresorerie: 99835.60 },
    { month: 'Sep', ca: 77460, charges: 12500, ebitda: 64960, flux: 15297.77, tresorerie: 115133.38 },
    { month: 'Oct', ca: 79160, charges: 12500, ebitda: 66660, flux: 16997.77, tresorerie: 132131.15 },
    { month: 'Nov', ca: 83060, charges: 17470, ebitda: 65590, flux: 15002.77, tresorerie: 147133.92 },
    { month: 'Déc', ca: 88960, charges: 21095, ebitda: 67865, flux: 11680.02, tresorerie: 158813.94 },
  ],
  2026: [
    { month: 'Jan', ca: 84560, charges: 32340, ebitda: 52220, flux: -2804.74, tresorerie: 152609.35 },
    { month: 'Fév', ca: 86185, charges: 26349, ebitda: 59836, flux: 8702.26, tresorerie: 156254.75 },
    { month: 'Mar', ca: 91385, charges: 21315, ebitda: 70070, flux: 2736.26, tresorerie: 156356.25 },
    { month: 'Avr', ca: 92885, charges: 11870, ebitda: 81015, flux: 25122.26, tresorerie: 180743.75 },
    { month: 'Mai', ca: 97235, charges: 17985, ebitda: 79250, flux: 15457.26, tresorerie: 197266.25 },
    { month: 'Juin', ca: 99785, charges: 17710, ebitda: 82075, flux: 18282.26, tresorerie: 216613.76 },
    { month: 'Juil', ca: 102335, charges: 17710, ebitda: 84625, flux: 13910.65, tresorerie: 231589.65 },
    { month: 'Août', ca: 104885, charges: 17710, ebitda: 87175, flux: 16460.65, tresorerie: 249115.54 },
    { month: 'Sep', ca: 107435, charges: 17710, ebitda: 89725, flux: 19010.65, tresorerie: 269191.43 },
    { month: 'Oct', ca: 109985, charges: 17710, ebitda: 92275, flux: 9560.65, tresorerie: 279817.32 },
    { month: 'Nov', ca: 112535, charges: 17710, ebitda: 94825, flux: 24110.65, tresorerie: 304993.21 },
    { month: 'Déc', ca: 115085, charges: 17710, ebitda: 97375, flux: 26660.65, tresorerie: 332719.10 },
  ],
};

const consolidatedDataExpenses: Record<number, ExpenseItem[]> = {
  2025: [
    { name: 'Electricité', value: 42500 },
    { name: 'Nettoyage', value: 38720 },
    { name: 'Internet', value: 18340 },
    { name: 'Assurances', value: 13900 },
    { name: 'Publicité', value: 12000 },
    { name: 'Outil Facturation', value: 9360 },
    { name: 'Chariot élévateur', value: 5280 },
    { name: 'Divers', value: 5000 },
    { name: 'INGEBIM', value: 3700 },
    { name: 'Architecte', value: 3500 },
    { name: 'Autres charges', value: 3100 },
    { name: 'Eau', value: 2240 },
    { name: 'Entretien Clim', value: 2100 },
    { name: 'Hono. Comptable', value: 1800 },
    { name: 'Autres charges 2', value: 1800 },
    { name: 'JPS', value: 1425 },
    { name: 'Fontaine', value: 1300 },
    { name: 'CSPS', value: 1000 },
  ],
  2026: [
    { name: 'Electricité', value: 58760 },
    { name: 'Internet', value: 26020 },
    { name: 'Assurances', value: 22300 },
    { name: 'Salaires', value: 20000 },
    { name: 'Architecte', value: 16600 },
    { name: 'Publicité', value: 12000 },
    { name: 'Nettoyage', value: 10020 },
    { name: 'Outil Facturation', value: 9360 },
    { name: 'Divers', value: 7970 },
    { name: 'Autres charges', value: 7359 },
    { name: 'Consommables', value: 6000 },
    { name: 'Charges Sociales', value: 5600 },
    { name: 'Chariot élévateur', value: 5340 },
    { name: 'Autres charges 2', value: 4075 },
    { name: 'INGEBIM', value: 3700 },
    { name: 'Eau', value: 3245 },
    { name: 'Véhicules', value: 3200 },
    { name: 'JPS', value: 2775 },
    { name: 'Entretien Clim', value: 2765 },
    { name: 'Fontaine', value: 2340 },
    { name: 'Hono. Comptable', value: 1800 },
    { name: 'CSPS', value: 1000 },
    { name: 'Essence', value: 800 },
    { name: 'Assurance Véhicules', value: 640 },
    { name: 'Tel Portable', value: 160 },
  ],
  2027: [
    { name: 'Electricité', value: 55800 },
    { name: 'Salaires', value: 30000 },
    { name: 'Internet', value: 29640 },
    { name: 'Assurances', value: 22200 },
    { name: 'Publicité', value: 12000 },
    { name: 'Outil Facturation', value: 9360 },
    { name: 'Consommables', value: 9000 },
    { name: 'Charges Sociales', value: 8400 },
    { name: 'Divers', value: 8400 },
    { name: 'Chariot élévateur', value: 5280 },
    { name: 'Véhicules', value: 4800 },
    { name: 'Eau', value: 3720 },
    { name: 'Entretien Clim', value: 3420 },
    { name: 'Fontaine', value: 2400 },
    { name: 'Hono. Comptable', value: 1800 },
    { name: 'Essence', value: 1200 },
    { name: 'Assurance Véhicules', value: 960 },
    { name: 'Tel Portable', value: 240 },
  ],
};

const montignyDataYearly: YearlyData[] = [
  { year: 2025, revenue: 660784, expenses: 95340, ebitda: 565444, resultatNet: 133221.61, fluxTresorerie: 198418.01, tresorerieFin: 198418.01, totalEmprunt: 257765.99, impots: 61740, leasePay: 47520, amortissements: 223332 },
  { year: 2026, revenue: 652595, expenses: 83325, ebitda: 569270, resultatNet: 149212.42, fluxTresorerie: 215754.01, tresorerieFin: 414172.03, totalEmprunt: 257765.99, impots: 53030, leasePay: 42720, amortissements: 223332 },
  { year: 2027, revenue: 655020, expenses: 76380, ebitda: 578640, resultatNet: 155687.53, fluxTresorerie: 217899.01, tresorerieFin: 632071.04, totalEmprunt: 257765.99, impots: 53030, leasePay: 47520, amortissements: 223332 },
  { year: 2028, revenue: 655020, expenses: 76380, ebitda: 578640, resultatNet: 194435.11, fluxTresorerie: 265419.01, tresorerieFin: 897490.05, totalEmprunt: 257765.99, impots: 53030, leasePay: 0, amortissements: 223332 },
  { year: 2029, revenue: 655020, expenses: 76380, ebitda: 578640, resultatNet: 197603.81, fluxTresorerie: 265419.01, tresorerieFin: 1162909.07, totalEmprunt: 257765.99, impots: 53030, leasePay: 0, amortissements: 223332 },
  { year: 2030, revenue: 655020, expenses: 76380, ebitda: 578640, resultatNet: 200834.88, fluxTresorerie: 265419.01, tresorerieFin: 1428328.08, totalEmprunt: 257765.99, impots: 53030, leasePay: 0, amortissements: 223332 },
  { year: 2031, revenue: 655020, expenses: 76380, ebitda: 578640, resultatNet: 204129.52, fluxTresorerie: 265419.01, tresorerieFin: 1693747.09, totalEmprunt: 257765.99, impots: 53030, leasePay: 0, amortissements: 223332 },
  { year: 2032, revenue: 655020, expenses: 76380, ebitda: 578640, resultatNet: 207488.96, fluxTresorerie: 265419.01, tresorerieFin: 1959166.11, totalEmprunt: 257765.99, impots: 53030, leasePay: 0, amortissements: 223332 },
  { year: 2033, revenue: 655020, expenses: 76380, ebitda: 578640, resultatNet: 210914.54, fluxTresorerie: 265419.01, tresorerieFin: 2224585.12, totalEmprunt: 257765.99, impots: 53030, leasePay: 0, amortissements: 223332 },
];

const montignyDataMonthly: Record<number, MonthlyData[]> = {
  2025: [
    { month: 'Jan', ca: 56692, charges: 7945, ebitda: 48747, flux: 18161.50, tresorerie: 18161.50 },
    { month: 'Fév', ca: 54960, charges: 7945, ebitda: 47015, flux: 16429.50, tresorerie: 34591 },
    { month: 'Mar', ca: 53460, charges: 7945, ebitda: 45515, flux: 14929.50, tresorerie: 49520.50 },
    { month: 'Avr', ca: 59192, charges: 7945, ebitda: 51247, flux: 20661.50, tresorerie: 70182 },
    { month: 'Mai', ca: 57460, charges: 7945, ebitda: 49515, flux: 18929.50, tresorerie: 89111.51 },
    { month: 'Juin', ca: 54160, charges: 7945, ebitda: 46215, flux: 15629.50, tresorerie: 104741.01 },
    { month: 'Juil', ca: 54160, charges: 7945, ebitda: 46215, flux: 15629.50, tresorerie: 120370.51 },
    { month: 'Août', ca: 54160, charges: 7945, ebitda: 46215, flux: 15629.50, tresorerie: 136000.01 },
    { month: 'Sep', ca: 54460, charges: 7945, ebitda: 46515, flux: 15929.50, tresorerie: 151929.51 },
    { month: 'Oct', ca: 52560, charges: 7945, ebitda: 44615, flux: 14029.50, tresorerie: 165959.01 },
    { month: 'Nov', ca: 54760, charges: 7945, ebitda: 46815, flux: 16229.50, tresorerie: 182188.51 },
    { month: 'Déc', ca: 54760, charges: 7945, ebitda: 46815, flux: 16229.50, tresorerie: 198418.01 },
  ],
  2026: [
    { month: 'Jan', ca: 52560, charges: 11635, ebitda: 40925, flux: 12117.50, tresorerie: 210535.51 },
    { month: 'Fév', ca: 54185, charges: 7810, ebitda: 46375, flux: 17567.50, tresorerie: 228103.02 },
    { month: 'Mar', ca: 54585, charges: 7810, ebitda: 46775, flux: 10141.50, tresorerie: 238244.52 },
    { month: 'Avr', ca: 54585, charges: 6230, ebitda: 48355, flux: 19547.50, tresorerie: 257792.02 },
    { month: 'Mai', ca: 54585, charges: 6230, ebitda: 48355, flux: 19547.50, tresorerie: 277339.52 },
    { month: 'Juin', ca: 54585, charges: 6230, ebitda: 48355, flux: 19547.50, tresorerie: 296887.02 },
    { month: 'Juil', ca: 54585, charges: 6230, ebitda: 48355, flux: 19547.50, tresorerie: 316434.52 },
    { month: 'Août', ca: 54585, charges: 6230, ebitda: 48355, flux: 19547.50, tresorerie: 335982.02 },
    { month: 'Sep', ca: 54585, charges: 6230, ebitda: 48355, flux: 19547.50, tresorerie: 355529.52 },
    { month: 'Oct', ca: 54585, charges: 6230, ebitda: 48355, flux: 19547.50, tresorerie: 375077.02 },
    { month: 'Nov', ca: 54585, charges: 6230, ebitda: 48355, flux: 19547.50, tresorerie: 394624.53 },
    { month: 'Déc', ca: 54585, charges: 6230, ebitda: 48355, flux: 19547.50, tresorerie: 414172.03 },
  ],
};

const montignyDataExpenses: Record<number, ExpenseItem[]> = {
  2025: [
    { name: 'Electricité', value: 27600 },
    { name: 'Nettoyage', value: 18960 },
    { name: 'Publicité', value: 12000 },
    { name: 'Internet', value: 10680 },
    { name: 'Outil Facturation', value: 9360 },
    { name: 'Assurances', value: 7200 },
    { name: 'Chariot élévateur', value: 2640 },
    { name: 'Divers', value: 2400 },
    { name: 'Hono. Comptable', value: 1800 },
    { name: 'Eau', value: 1080 },
    { name: 'Entretien Clim', value: 1020 },
    { name: 'Fontaine', value: 600 },
  ],
  2026: [
    { name: 'Electricité', value: 26945 },
    { name: 'Publicité', value: 12000 },
    { name: 'Internet', value: 10680 },
    { name: 'Outil Facturation', value: 9360 },
    { name: 'Assurances', value: 7200 },
    { name: 'Nettoyage', value: 4740 },
    { name: 'Chariot élévateur', value: 2640 },
    { name: 'Divers', value: 2400 },
    { name: 'Autres charges 2', value: 2030 },
    { name: 'Hono. Comptable', value: 1800 },
    { name: 'Eau', value: 1080 },
    { name: 'Entretien Clim', value: 1020 },
    { name: 'Autres charges', value: 830 },
    { name: 'Fontaine', value: 600 },
  ],
  2027: [
    { name: 'Electricité', value: 27600 },
    { name: 'Publicité', value: 12000 },
    { name: 'Internet', value: 10680 },
    { name: 'Outil Facturation', value: 9360 },
    { name: 'Assurances', value: 7200 },
    { name: 'Chariot élévateur', value: 2640 },
    { name: 'Divers', value: 2400 },
    { name: 'Hono. Comptable', value: 1800 },
    { name: 'Eau', value: 1080 },
    { name: 'Entretien Clim', value: 1020 },
    { name: 'Fontaine', value: 600 },
  ],
};

const boissyDataYearly: YearlyData[] = [
  { year: 2025, revenue: 255400, expenses: 54660, ebitda: 200740, resultatNet: -38157.97, fluxTresorerie: -6601.90, tresorerieFin: -6601.90, totalEmprunt: 143225.90, impots: 14196, leasePay: 49920, amortissements: 106656 },
  { year: 2026, revenue: 390000, expenses: 45730, ebitda: 344270, resultatNet: 84975.59, fluxTresorerie: 137805.10, tresorerieFin: 131203.21, totalEmprunt: 143225.90, impots: 13319, leasePay: 49920, amortissements: 106656 },
  { year: 2027, revenue: 396000, expenses: 35700, ebitda: 360300, resultatNet: 99588.19, fluxTresorerie: 153835.10, tresorerieFin: 285038.31, totalEmprunt: 143225.90, impots: 13319, leasePay: 49920, amortissements: 106656 },
  { year: 2028, revenue: 396000, expenses: 35700, ebitda: 360300, resultatNet: 102287.20, fluxTresorerie: 153835.10, tresorerieFin: 438873.42, totalEmprunt: 143225.90, impots: 13319, leasePay: 49920, amortissements: 106656 },
  { year: 2029, revenue: 396000, expenses: 35700, ebitda: 360300, resultatNet: 114459.68, fluxTresorerie: 166315.10, tresorerieFin: 605188.52, totalEmprunt: 143225.90, impots: 13319, leasePay: 37440, amortissements: 106656 },
  { year: 2030, revenue: 396000, expenses: 35700, ebitda: 360300, resultatNet: 145470.38, fluxTresorerie: 203755.10, tresorerieFin: 808943.63, totalEmprunt: 143225.90, impots: 13319, leasePay: 0, amortissements: 106656 },
  { year: 2031, revenue: 396000, expenses: 35700, ebitda: 360300, resultatNet: 148524.32, fluxTresorerie: 203755.10, tresorerieFin: 1012698.73, totalEmprunt: 143225.90, impots: 13319, leasePay: 0, amortissements: 106656 },
  { year: 2032, revenue: 396000, expenses: 35700, ebitda: 360300, resultatNet: 151706.62, fluxTresorerie: 203755.10, tresorerieFin: 1216453.84, totalEmprunt: 143225.90, impots: 13319, leasePay: 0, amortissements: 106656 },
  { year: 2033, revenue: 396000, expenses: 35700, ebitda: 360300, resultatNet: 155022.68, fluxTresorerie: 203755.10, tresorerieFin: 1420208.94, totalEmprunt: 143225.90, impots: 13319, leasePay: 0, amortissements: 106656 },
];

const boissyDataMonthly: Record<number, MonthlyData[]> = {
  2025: [
    { month: 'Jan', ca: 9450, charges: 4555, ebitda: 4895, flux: -12383.49, tresorerie: -12383.49 },
    { month: 'Fév', ca: 12950, charges: 4555, ebitda: 8395, flux: -8883.49, tresorerie: -21266.98 },
    { month: 'Mar', ca: 16350, charges: 4555, ebitda: 11795, flux: -5483.49, tresorerie: -26750.47 },
    { month: 'Avr', ca: 17050, charges: 4555, ebitda: 12495, flux: -4783.49, tresorerie: -31533.97 },
    { month: 'Mai', ca: 20450, charges: 4555, ebitda: 15895, flux: -1383.49, tresorerie: -32917.46 },
    { month: 'Juin', ca: 24150, charges: 4555, ebitda: 19595, flux: 2316.51, tresorerie: -30600.95 },
    { month: 'Juil', ca: 22450, charges: 4555, ebitda: 17895, flux: 616.51, tresorerie: -29984.44 },
    { month: 'Août', ca: 22450, charges: 4555, ebitda: 17895, flux: 616.51, tresorerie: -29367.93 },
    { month: 'Sep', ca: 23000, charges: 4555, ebitda: 18445, flux: 1166.51, tresorerie: -28201.42 },
    { month: 'Oct', ca: 26600, charges: 4555, ebitda: 22045, flux: 4766.51, tresorerie: -23434.91 },
    { month: 'Nov', ca: 28300, charges: 4555, ebitda: 23745, flux: 6466.51, tresorerie: -16968.40 },
    { month: 'Déc', ca: 32200, charges: 4555, ebitda: 27645, flux: 10366.51, tresorerie: -6601.90 },
  ],
  2026: [
    { month: 'Jan', ca: 30000, charges: 5140, ebitda: 24860, flux: 7947.51, tresorerie: 1345.61 },
    { month: 'Fév', ca: 30000, charges: 4325, ebitda: 25675, flux: 8762.51, tresorerie: 10108.12 },
    { month: 'Mar', ca: 33000, charges: 5845, ebitda: 27155, flux: 6727.51, tresorerie: 16835.63 },
    { month: 'Avr', ca: 33000, charges: 3380, ebitda: 29620, flux: 12707.51, tresorerie: 29543.14 },
    { month: 'Mai', ca: 33000, charges: 3380, ebitda: 29620, flux: 12707.51, tresorerie: 42250.65 },
    { month: 'Juin', ca: 33000, charges: 3380, ebitda: 29620, flux: 12707.51, tresorerie: 54958.16 },
    { month: 'Juil', ca: 33000, charges: 3380, ebitda: 29620, flux: 12707.51, tresorerie: 67665.67 },
    { month: 'Août', ca: 33000, charges: 3380, ebitda: 29620, flux: 12707.51, tresorerie: 80373.17 },
    { month: 'Sep', ca: 33000, charges: 3380, ebitda: 29620, flux: 12707.51, tresorerie: 93080.68 },
    { month: 'Oct', ca: 33000, charges: 3380, ebitda: 29620, flux: 12707.51, tresorerie: 105788.19 },
    { month: 'Nov', ca: 33000, charges: 3380, ebitda: 29620, flux: 12707.51, tresorerie: 118495.70 },
    { month: 'Déc', ca: 33000, charges: 3380, ebitda: 29620, flux: 12707.51, tresorerie: 131203.21 },
  ],
};

const boissyDataExpenses: Record<number, ExpenseItem[]> = {
  2025: [
    { name: 'Nettoyage', value: 18960 },
    { name: 'Electricité', value: 14400 },
    { name: 'Internet', value: 7560 },
    { name: 'Assurances', value: 6000 },
    { name: 'Chariot élévateur', value: 2640 },
    { name: 'Divers', value: 2400 },
    { name: 'Eau', value: 1080 },
    { name: 'Entretien Clim', value: 1020 },
    { name: 'Fontaine', value: 600 },
  ],
  2026: [
    { name: 'Electricité', value: 19295 },
    { name: 'Internet', value: 7560 },
    { name: 'Assurances', value: 5820 },
    { name: 'Nettoyage', value: 4880 },
    { name: 'Divers', value: 2970 },
    { name: 'Chariot élévateur', value: 2700 },
    { name: 'Eau', value: 900 },
    { name: 'Fontaine', value: 840 },
    { name: 'Entretien Clim', value: 765 },
  ],
  2027: [
    { name: 'Electricité', value: 14400 },
    { name: 'Internet', value: 7560 },
    { name: 'Assurances', value: 6000 },
    { name: 'Chariot élévateur', value: 2640 },
    { name: 'Divers', value: 2400 },
    { name: 'Eau', value: 1080 },
    { name: 'Entretien Clim', value: 1020 },
    { name: 'Fontaine', value: 600 },
  ],
};

const moussyDataYearly: YearlyData[] = [
  { year: 2025, revenue: 2000, expenses: 10540, ebitda: -8540, resultatNet: -38165.44, fluxTresorerie: -20879.42, tresorerieFin: -20879.42, totalEmprunt: 10489.42, impots: 0, leasePay: 1850, amortissements: 17286 },
  { year: 2026, revenue: 69900, expenses: 10627, ebitda: 59273, resultatNet: -11095.74, fluxTresorerie: -3304.26, tresorerieFin: -27487.94, totalEmprunt: 50757.26, impots: 0, leasePay: 11820, amortissements: 36240 },
  { year: 2027, revenue: 85200, expenses: 8040, ebitda: 77160, resultatNet: 7542.29, fluxTresorerie: 14162.93, tresorerieFin: 837.93, totalEmprunt: 51897.07, impots: 0, leasePay: 11100, amortissements: 36240 },
  { year: 2028, revenue: 85200, expenses: 8040, ebitda: 77160, resultatNet: 8544.87, fluxTresorerie: 14162.93, tresorerieFin: 29163.80, totalEmprunt: 51897.07, impots: 0, leasePay: 11100, amortissements: 36240 },
  { year: 2029, revenue: 85200, expenses: 8040, ebitda: 77160, resultatNet: 9589.36, fluxTresorerie: 14162.93, tresorerieFin: 57489.67, totalEmprunt: 51897.07, impots: 0, leasePay: 11100, amortissements: 36240 },
  { year: 2030, revenue: 85200, expenses: 8040, ebitda: 77160, resultatNet: 12065.05, fluxTresorerie: 16012.93, tresorerieFin: 89515.54, totalEmprunt: 51897.07, impots: 0, leasePay: 9250, amortissements: 36240 },
  { year: 2031, revenue: 85200, expenses: 8040, ebitda: 77160, resultatNet: 20136.21, fluxTresorerie: 25262.93, tresorerieFin: 140041.40, totalEmprunt: 51897.07, impots: 0, leasePay: 0, amortissements: 36240 },
  { year: 2032, revenue: 85200, expenses: 8040, ebitda: 77160, resultatNet: 21307.54, fluxTresorerie: 28142.55, tresorerieFin: 196326.51, totalEmprunt: 49017.45, impots: 0, leasePay: 0, amortissements: 36240 },
  { year: 2033, revenue: 85200, expenses: 8040, ebitda: 77160, resultatNet: 22360.38, fluxTresorerie: 33901.79, tresorerieFin: 264130.09, totalEmprunt: 43258.21, impots: 0, leasePay: 0, amortissements: 36240 },
];

const moussyDataMonthly: Record<number, MonthlyData[]> = {
  2025: [
    { month: 'Jan', ca: 0, charges: 0, ebitda: 0, flux: 0, tresorerie: 0 },
    { month: 'Fév', ca: 0, charges: 0, ebitda: 0, flux: 0, tresorerie: 0 },
    { month: 'Mar', ca: 0, charges: 0, ebitda: 0, flux: 0, tresorerie: 0 },
    { month: 'Avr', ca: 0, charges: 0, ebitda: 0, flux: 0, tresorerie: 0 },
    { month: 'Mai', ca: 0, charges: 0, ebitda: 0, flux: 0, tresorerie: 0 },
    { month: 'Juin', ca: 0, charges: 0, ebitda: 0, flux: 0, tresorerie: 0 },
    { month: 'Juil', ca: 0, charges: 3500, ebitda: -3500, flux: -5148.24, tresorerie: -5148.24 },
    { month: 'Août', ca: 0, charges: 0, ebitda: 0, flux: -1648.24, tresorerie: -6796.48 },
    { month: 'Sep', ca: 0, charges: 0, ebitda: 0, flux: -1798.24, tresorerie: -8594.71 },
    { month: 'Oct', ca: 0, charges: 0, ebitda: 0, flux: -1798.24, tresorerie: -10392.95 },
    { month: 'Nov', ca: 0, charges: 4170, ebitda: -4170, flux: -6893.24, tresorerie: -17286.19 },
    { month: 'Déc', ca: 2000, charges: 2870, ebitda: -870, flux: -3593.24, tresorerie: -20879.42 },
  ],
  2026: [
    { month: 'Jan', ca: 2000, charges: 660, ebitda: 1340, flux: -3399.85, tresorerie: -24279.28 },
    { month: 'Fév', ca: 2000, charges: 2317, ebitda: -317, flux: -5056.85, tresorerie: -29336.13 },
    { month: 'Mar', ca: 3800, charges: 1125, ebitda: 2675, flux: -2634.76, tresorerie: -31970.88 },
    { month: 'Avr', ca: 5300, charges: 725, ebitda: 4575, flux: -734.76, tresorerie: -32705.64 },
    { month: 'Mai', ca: 7100, charges: 725, ebitda: 6375, flux: 1065.24, tresorerie: -31640.39 },
    { month: 'Juin', ca: 7100, charges: 725, ebitda: 6375, flux: 1065.24, tresorerie: -30575.15 },
    { month: 'Juil', ca: 7100, charges: 725, ebitda: 6375, flux: 1065.24, tresorerie: -29509.90 },
    { month: 'Août', ca: 7100, charges: 725, ebitda: 6375, flux: 1065.24, tresorerie: -28444.66 },
    { month: 'Sep', ca: 7100, charges: 725, ebitda: 6375, flux: 1065.24, tresorerie: -27379.42 },
    { month: 'Oct', ca: 7100, charges: 725, ebitda: 6375, flux: 1065.24, tresorerie: -26314.17 },
    { month: 'Nov', ca: 7100, charges: 725, ebitda: 6375, flux: 1065.24, tresorerie: -25248.93 },
    { month: 'Déc', ca: 7100, charges: 725, ebitda: 6375, flux: 1065.24, tresorerie: -24183.68 },
  ],
};

const moussyDataExpenses: Record<number, ExpenseItem[]> = {
  2025: [
    { name: 'Architecte', value: 3500 },
    { name: 'Autres charges', value: 3100 },
    { name: 'Autres charges 2', value: 1800 },
    { name: 'Nettoyage', value: 800 },
    { name: 'Electricité', value: 500 },
    { name: 'Assurances', value: 300 },
    { name: 'Divers', value: 200 },
    { name: 'Internet', value: 100 },
    { name: 'Fontaine', value: 100 },
    { name: 'Eau', value: 80 },
    { name: 'Entretien Clim', value: 60 },
  ],
  2026: [
    { name: 'Assurances', value: 3300 },
    { name: 'Electricité', value: 2195 },
    { name: 'Autres charges 2', value: 1915 },
    { name: 'Divers', value: 1000 },
    { name: 'Internet', value: 580 },
    { name: 'Fontaine', value: 500 },
    { name: 'Eau', value: 460 },
    { name: 'Nettoyage', value: 400 },
    { name: 'Entretien Clim', value: 300 },
  ],
  2027: [
    { name: 'Electricité', value: 3000 },
    { name: 'Assurances', value: 1800 },
    { name: 'Divers', value: 1200 },
    { name: 'Internet', value: 600 },
    { name: 'Fontaine', value: 600 },
    { name: 'Eau', value: 480 },
    { name: 'Entretien Clim', value: 360 },
  ],
};

const trappesDataYearly: YearlyData[] = [
  { year: 2025, revenue: 0, expenses: 6525, ebitda: -6525, resultatNet: -20768.58, fluxTresorerie: -12122.75, tresorerieFin: -12122.75, totalEmprunt: 5597.75, impots: 0, leasePay: 0, amortissements: 8944 },
  { year: 2026, revenue: 91800, expenses: 94147, ebitda: -2347, resultatNet: -238826.72, fluxTresorerie: -176349.70, tresorerieFin: -188472.46, totalEmprunt: 110702.70, impots: 12000, leasePay: 51300, amortissements: 107328 },
  { year: 2027, revenue: 372150, expenses: 88500, ebitda: 283650, resultatNet: 17830.58, fluxTresorerie: 44617.63, tresorerieFin: -143854.83, totalEmprunt: 150232.37, impots: 15600, leasePay: 73200, amortissements: 107328 },
  { year: 2028, revenue: 401400, expenses: 88500, ebitda: 312900, resultatNet: 44888.54, fluxTresorerie: 73867.63, tresorerieFin: -69987.20, totalEmprunt: 150232.37, impots: 15600, leasePay: 73200, amortissements: 107328 },
  { year: 2029, revenue: 401400, expenses: 88500, ebitda: 312900, resultatNet: 47595.58, fluxTresorerie: 73867.63, tresorerieFin: 3880.43, totalEmprunt: 150232.37, impots: 15600, leasePay: 73200, amortissements: 107328 },
  { year: 2030, revenue: 401400, expenses: 88500, ebitda: 312900, resultatNet: 50411.47, fluxTresorerie: 73867.63, tresorerieFin: 77748.06, totalEmprunt: 150232.37, impots: 15600, leasePay: 73200, amortissements: 107328 },
  { year: 2031, revenue: 401400, expenses: 88500, ebitda: 312900, resultatNet: 89940.64, fluxTresorerie: 122667.63, tresorerieFin: 200415.69, totalEmprunt: 150232.37, impots: 15600, leasePay: 24400, amortissements: 107328 },
  { year: 2032, revenue: 401400, expenses: 88500, ebitda: 312900, resultatNet: 111287.64, fluxTresorerie: 147067.63, tresorerieFin: 347483.32, totalEmprunt: 150232.37, impots: 15600, leasePay: 0, amortissements: 107328 },
  { year: 2033, revenue: 401400, expenses: 88500, ebitda: 312900, resultatNet: 114457.18, fluxTresorerie: 147067.63, tresorerieFin: 494550.95, totalEmprunt: 150232.37, impots: 15600, leasePay: 0, amortissements: 107328 },
];

const trappesDataMonthly: Record<number, MonthlyData[]> = {
  2025: [
    { month: 'Jan', ca: 0, charges: 0, ebitda: 0, flux: 0, tresorerie: 0 },
    { month: 'Fév', ca: 0, charges: 0, ebitda: 0, flux: 0, tresorerie: 0 },
    { month: 'Mar', ca: 0, charges: 0, ebitda: 0, flux: 0, tresorerie: 0 },
    { month: 'Avr', ca: 0, charges: 0, ebitda: 0, flux: 0, tresorerie: 0 },
    { month: 'Mai', ca: 0, charges: 0, ebitda: 0, flux: 0, tresorerie: 0 },
    { month: 'Juin', ca: 0, charges: 0, ebitda: 0, flux: 0, tresorerie: 0 },
    { month: 'Juil', ca: 0, charges: 0, ebitda: 0, flux: 0, tresorerie: 0 },
    { month: 'Août', ca: 0, charges: 0, ebitda: 0, flux: 0, tresorerie: 0 },
    { month: 'Sep', ca: 0, charges: 0, ebitda: 0, flux: 0, tresorerie: 0 },
    { month: 'Oct', ca: 0, charges: 0, ebitda: 0, flux: 0, tresorerie: 0 },
    { month: 'Nov', ca: 0, charges: 800, ebitda: -800, flux: -800, tresorerie: -800 },
    { month: 'Déc', ca: 0, charges: 5725, ebitda: -5725, flux: -11322.75, tresorerie: -12122.75 },
  ],
  2026: [
    { month: 'Jan', ca: 0, charges: 14905, ebitda: -14905, flux: -22869.75, tresorerie: -34992.51 },
    { month: 'Fév', ca: 0, charges: 11897, ebitda: -11897, flux: -17627.75, tresorerie: -52620.26 },
    { month: 'Mar', ca: 0, charges: 6535, ebitda: -6535, flux: -14132.75, tresorerie: -66753.01 },
    { month: 'Avr', ca: 0, charges: 1535, ebitda: -1535, flux: -7132.75, tresorerie: -73885.77 },
    { month: 'Mai', ca: 2550, charges: 7650, ebitda: -5100, flux: -16797.75, tresorerie: -90683.52 },
    { month: 'Juin', ca: 5100, charges: 7375, ebitda: -2275, flux: -13972.75, tresorerie: -104656.27 },
    { month: 'Juil', ca: 7650, charges: 7375, ebitda: 275, flux: -18344.36, tresorerie: -123000.64 },
    { month: 'Août', ca: 10200, charges: 7375, ebitda: 2825, flux: -15794.36, tresorerie: -138795 },
    { month: 'Sep', ca: 12750, charges: 7375, ebitda: 5375, flux: -13244.36, tresorerie: -152039.37 },
    { month: 'Oct', ca: 15300, charges: 7375, ebitda: 7925, flux: -22694.36, tresorerie: -174733.73 },
    { month: 'Nov', ca: 17850, charges: 7375, ebitda: 10475, flux: -8144.36, tresorerie: -182878.09 },
    { month: 'Déc', ca: 20400, charges: 7375, ebitda: 13025, flux: -5594.36, tresorerie: -188472.46 },
  ],
};

const trappesDataExpenses: Record<number, ExpenseItem[]> = {
  2025: [
    { name: 'INGEBIM', value: 3700 },
    { name: 'JPS', value: 1425 },
    { name: 'CSPS', value: 1000 },
    { name: 'Assurances', value: 400 },
  ],
  2026: [
    { name: 'Salaires', value: 20000 },
    { name: 'Architecte', value: 16600 },
    { name: 'Electricité', value: 10325 },
    { name: 'Internet', value: 7200 },
    { name: 'Autres charges', value: 6552 },
    { name: 'Consommables', value: 6000 },
    { name: 'Assurances', value: 5980 },
    { name: 'Charges Sociales', value: 5600 },
    { name: 'INGEBIM', value: 3700 },
    { name: 'Véhicules', value: 3200 },
    { name: 'JPS', value: 2775 },
    { name: 'Divers', value: 1600 },
    { name: 'CSPS', value: 1000 },
    { name: 'Eau', value: 805 },
    { name: 'Essence', value: 800 },
    { name: 'Entretien Clim', value: 680 },
    { name: 'Assurance Véhicules', value: 640 },
    { name: 'Fontaine', value: 400 },
    { name: 'Tel Portable', value: 160 },
    { name: 'Autres charges 2', value: 130 },
  ],
  2027: [
    { name: 'Salaires', value: 30000 },
    { name: 'Electricité', value: 10800 },
    { name: 'Internet', value: 10800 },
    { name: 'Consommables', value: 9000 },
    { name: 'Charges Sociales', value: 8400 },
    { name: 'Assurances', value: 7200 },
    { name: 'Véhicules', value: 4800 },
    { name: 'Divers', value: 2400 },
    { name: 'Essence', value: 1200 },
    { name: 'Eau', value: 1080 },
    { name: 'Entretien Clim', value: 1020 },
    { name: 'Assurance Véhicules', value: 960 },
    { name: 'Fontaine', value: 600 },
    { name: 'Tel Portable', value: 240 },
  ],
};

// --- Site Information ---
const consolidatedInfo: SiteInfo = {
  lieu: 'Tous les sites',
  cellules: 52,
  prix: 6815000,
  coutTotal: 6815000,
  apport: 1363000,
  nbSites: 4,
};

const montignyInfo: SiteInfo = {
  lieu: 'Montigny-le-Bretonneux',
  acquisition: '2022-09-01',
  prix: 3500000,
  fraisNotaire: 34000,
  fraisAgence: 125000,
  travaux: 700000,
  coutTotal: 4359000,
  apport: 871800,
  cellules: 15,
  debutExploitation: '2023-01-01',
  exploitation100: '2023-09-01',
};

const boissyInfo: SiteInfo = {
  lieu: "Boissy-l'Aillerie",
  acquisition: '2024-02-01',
  prix: 1450000,
  fraisNotaire: 14500,
  fraisAgence: 0,
  travaux: 760000,
  coutTotal: 2224500,
  apport: 444900,
  cellules: 19,
  debutExploitation: '2024-10-01',
  exploitation100: '2025-06-01',
};

const moussyInfo: SiteInfo = {
  lieu: 'Moussy-le-Neuf',
  acquisition: '2025-07-01',
  prix: 465000,
  fraisNotaire: 9300,
  fraisAgence: 24000,
  travaux: 105000,
  coutTotal: 603300,
  apport: 120660,
  cellules: 4,
  debutExploitation: '2025-11-01',
  exploitation100: '2026-07-01',
};

const trappesInfo: SiteInfo = {
  lieu: 'Trappes',
  acquisition: '2025-12-01',
  prix: 1400000,
  fraisNotaire: 31770,
  fraisAgence: 65000,
  travaux: 500000,
  coutTotal: 2001770,
  apport: 400354,
  cellules: 14,
  debutExploitation: '2026-05-01',
  exploitation100: '2027-01-01',
};

// --- Client Data ---
const montignyClients: ClientData[] = [
  { cell: 'Cellule 1', surface: 184, client: 'KBE TECHNO', docusign: 'ok', finContrat: '6 mois exp', duree: 6, depot: 5000, loyer: 2300, status: 'actif' },
  { cell: 'Cellule 2', surface: 185, client: 'SOLAROCK', docusign: 'ok', finContrat: '2025-05-01', duree: 24, depot: 5800, loyer: 2900, status: 'actif' },
  { cell: 'Cellule 3', surface: 158, client: 'EMITEL MARKET', docusign: 'ok', finContrat: '2025-10-31', duree: 12, depot: 4200, loyer: 2100, status: 'actif' },
  { cell: 'Cellule 4', surface: 157, client: 'PIC REFRIGERATION', docusign: 'ok', finContrat: '2025-05-10', duree: 12, depot: 4400, loyer: 2200, status: 'actif' },
  { cell: 'Cellule 5', surface: 157, client: 'OZ DISTRIBUTION', docusign: 'ok', finContrat: '2024-11-20', duree: 6, depot: 4680, loyer: 2140, status: 'actif' },
  { cell: 'Cellule 6', surface: 158, client: 'SOGBADJI COMLAN', docusign: '', finContrat: '2024-09-28', duree: 12, depot: 4200, loyer: 2100, status: 'en_attente' },
  { cell: 'Cellule 7', surface: 236, client: 'AFAQ', docusign: 'ok', finContrat: '', duree: 0, depot: 0, loyer: 4300, status: 'actif' },
  { cell: 'Cellule 8', surface: 162, client: 'ADF PLOMBERIE', docusign: 'ok', finContrat: '2024-06-30', duree: 12, depot: 5200, loyer: 4332, status: 'actif' },
  { cell: 'Cellule 09', surface: 126, client: 'KBE TECHNO', docusign: 'ok', finContrat: '2024-12-31', duree: 6, depot: 4400, loyer: 2200, status: 'actif' },
  { cell: 'Cellule 10', surface: 156, client: 'SEMO SERTVICE', docusign: '', finContrat: '2026-04-22', duree: 12, depot: 4200, loyer: 0, status: 'en_attente' },
  { cell: 'Cellule 11', surface: 133, client: 'POWER COM', docusign: 'ok', finContrat: '2024-12-31', duree: 12, depot: 4140, loyer: 2070, status: 'actif' },
  { cell: 'Cellule 12', surface: 161, client: 'CARRELAGE ART-DECO', docusign: 'ok', finContrat: '2025-04-30', duree: 13, depot: 4420, loyer: 2210, status: 'actif' },
  { cell: 'Cellule 13', surface: 132, client: 'ABBYNAYA EXOTIQUE', docusign: 'ok', finContrat: '6 mois exp', duree: 6, depot: 4600, loyer: 2100, status: 'actif' },
  { cell: 'Cellule 14', surface: 139, client: 'JOLIZ', docusign: 'ok', finContrat: '2025-03-31', duree: 12, depot: 4800, loyer: 2040, status: 'actif' },
  { cell: 'Cellule 15', surface: 132, client: 'N ET RENOVATION', docusign: '', finContrat: '2024-08-31', duree: 6, depot: 4400, loyer: 2200, status: 'en_attente' },
  { cell: 'Bureau 5', surface: 12, client: 'ADF PLOMBERIE', docusign: 'ok', finContrat: '2024-06-30', duree: 12, depot: 500, loyer: 250, status: 'actif' },
];

const boissyClients: ClientData[] = [
  { cell: 'Cellule 1', surface: 61, client: 'BOCAN', docusign: 'ok', finContrat: '2026-02-16', duree: 12, depot: 3600, loyer: 0, status: 'en_attente' },
  { cell: 'Cellule 2', surface: 105.50, client: 'KOUS PRODUCTION', docusign: 'ok', finContrat: '2025-09-30', duree: 12, depot: 3400, loyer: 1700, status: 'actif' },
  { cell: 'Cellule 3', surface: 105.50, client: 'VERNOVA FRANCE', docusign: '', finContrat: '2026-05-19', duree: 12, depot: 3400, loyer: 0, status: 'en_attente' },
  { cell: 'Cellule 4', surface: 61, client: 'DIRECT ASSISTANCE', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'en_attente' },
  { cell: 'Cellule 5', surface: 106.50, client: 'DIRECT ASSISTANCE', docusign: '', finContrat: '2026-03-05', duree: 12, depot: 3500, loyer: 0, status: 'en_attente' },
  { cell: 'Cellule 6', surface: 102, client: 'MADE IN WORLD', docusign: 'ok', finContrat: '46034', duree: 12, depot: 3400, loyer: 1700, status: 'actif' },
  { cell: 'Cellule 7', surface: 100.50, client: 'PLAIDY', docusign: '', finContrat: '2025-12-30', duree: 12, depot: 3400, loyer: 700, status: 'en_attente' },
  { cell: 'Cellule 8', surface: 133.60, client: '', docusign: '', finContrat: '2026-02-11', duree: 12, depot: 4200, loyer: 0, status: 'en_attente' },
  { cell: 'Cellule 09', surface: 100.90, client: 'SYL DEVELLOPEMENT', docusign: 'ok', finContrat: '2026-03-24', duree: 12, depot: 3300, loyer: 0, status: 'en_attente' },
  { cell: 'Cellule 10', surface: 63, client: 'JB GARAGE', docusign: 'ok', finContrat: '2025-09-30', duree: 12, depot: 3800, loyer: 1900, status: 'actif' },
  { cell: 'Cellule 11', surface: 73.50, client: 'ET VOILA', docusign: 'ok', finContrat: '20-Apr-26', duree: 12, depot: 2800, loyer: 0, status: 'en_attente' },
  { cell: 'Cellule 12', surface: 73.50, client: 'TEMF', docusign: 'ok', finContrat: '2025-12-23', duree: 12, depot: 2800, loyer: 1800, status: 'actif' },
  { cell: 'Cellule 13', surface: 73.50, client: 'TRANSIMPEX', docusign: 'ok', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'en_attente' },
  { cell: 'Cellule 14', surface: 114.80, client: 'WOODSTOCK TRADING', docusign: 'ok', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'en_attente' },
  { cell: 'Cellule 15', surface: 105.50, client: 'KOZEN LOG', docusign: 'ok', finContrat: '2025-10-21', duree: 12, depot: 3300, loyer: 1650, status: 'actif' },
  { cell: 'Cellule 16', surface: 105.50, client: 'AUTOLAVEUSE CENTER', docusign: 'ok', finContrat: '2026-05-25', duree: 12, depot: 3400, loyer: 0, status: 'en_attente' },
  { cell: 'Cellule 17', surface: 168.30, client: 'ECELLENCE RENOV', docusign: '', finContrat: '2026-08-31', duree: 12, depot: 4600, loyer: 0, status: 'en_attente' },
  { cell: 'Cellule 18', surface: 99.50, client: 'MELSCHER', docusign: 'ok', finContrat: '2026-05-31', duree: 12, depot: 3400, loyer: 0, status: 'en_attente' },
  { cell: 'Cellule 19', surface: 112.50, client: 'PARFUM GLOBAL', docusign: '', finContrat: '', duree: 0, depot: 3400, loyer: 0, status: 'en_attente' },
];

const moussyClients: ClientData[] = [
  { cell: 'Cellule 1', surface: 61, client: 'CLIENT W', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'en_attente' },
  { cell: 'Cellule 2', surface: 105.50, client: 'KOZEN LOG', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'en_attente' },
  { cell: 'Cellule 3', surface: 105.50, client: 'INTERTRADE', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'en_attente' },
  { cell: 'Cellule 4', surface: 61, client: 'SOW COUVERTURE', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'en_attente' },
];

const trappesClients: ClientData[] = [
  { cell: 'Cellule 1', surface: 61, client: 'CLIENT A', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Cellule 2', surface: 105.50, client: 'CLIENT B', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Cellule 3', surface: 105.50, client: 'CLIENT C', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Cellule 4', surface: 61, client: 'CLIENT D', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Cellule 5', surface: 106.50, client: 'CLIENT E', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Cellule 6', surface: 101.80, client: 'CLIENT F', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Cellule 7', surface: 100.50, client: 'CLIENT G', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Cellule 8', surface: 133.60, client: 'CLIENT H', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Cellule 09', surface: 100.90, client: 'CLIENT I', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Cellule 10', surface: 63, client: 'CLIENT J', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Cellule 11', surface: 73.50, client: 'CLIENT K', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Cellule 12', surface: 73.50, client: 'CLIENT A', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Cellule 13', surface: 73.50, client: 'CLIENT A', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Cellule 14', surface: 114.80, client: 'CLIENT A', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Box 1', surface: 105.50, client: 'CLIENT A', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Box 2', surface: 0, client: 'CLIENT A', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Box 3', surface: 0, client: 'CLIENT A', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Box 4', surface: 0, client: 'CLIENT A', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Box 5', surface: 0, client: 'CLIENT A', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Box 6', surface: 0, client: 'CLIENT A', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Box 7', surface: 0, client: 'CLIENT A', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Box 8', surface: 0, client: 'CLIENT A', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Box 9', surface: 0, client: 'CLIENT A', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Box 10', surface: 0, client: 'CLIENT A', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
  { cell: 'Box 11', surface: 0, client: 'CLIENT A', docusign: '', finContrat: '', duree: 0, depot: 0, loyer: 0, status: 'travaux' },
];

// --- Loan Data ---
const montignyLoans: LoanData[] = [
  { name: 'Banque Postale', montant: 3350000, taux: 0.0195, duree: 15, mensualite: 21480.5 },
];

const boissyLoans: LoanData[] = [
  { name: 'Emprunt 1', montant: 1780000, taux: 0.04, duree: 15, mensualite: 13163.65 },
  { name: 'Emprunt 2', montant: 1000000, taux: 0.04, duree: 15, mensualite: 7396.88 },
];

const moussyLoans: LoanData[] = [
  { name: 'Emprunt 1', montant: 465000, taux: 0.04, duree: 15, mensualite: 3440.79 },
  { name: 'Emprunt 2', montant: 94200, taux: 0.04, duree: 15, mensualite: 697.16 },
  { name: 'Emprunt 3', montant: 50000, taux: 0.04, duree: 7, mensualite: 685.2 },
];

const trappesLoans: LoanData[] = [
  { name: 'Emprunt BPI', montant: 1120000, taux: 0.0395, duree: 15, mensualite: 8281.72 },
];

// --- Cash Flow Data ---
export const cashFlowData: Record<SiteKey, Record<string, { month: string; value: number }[]>> = {
  consolidated: {
    '2025': [
      { month: 'Jan', value: 0 },
      { month: 'Fév', value: 5778.01 },
      { month: 'Mar', value: 13324.02 },
      { month: 'Avr', value: 22770.03 },
      { month: 'Mai', value: 38648.04 },
      { month: 'Juin', value: 56194.05 },
      { month: 'Juil', value: 74140.06 },
      { month: 'Août', value: 85237.83 },
      { month: 'Sep', value: 99835.60 },
      { month: 'Oct', value: 115133.38 },
      { month: 'Nov', value: 132131.15 },
      { month: 'Déc', value: 147133.92 },
    ],
    '2026': [
      { month: 'Jan', value: 158813.94 },
      { month: 'Fév', value: 152609.35 },
      { month: 'Mar', value: 156254.75 },
      { month: 'Avr', value: 156356.25 },
      { month: 'Mai', value: 180743.75 },
      { month: 'Juin', value: 197266.25 },
      { month: 'Juil', value: 216613.76 },
      { month: 'Août', value: 231589.65 },
      { month: 'Sep', value: 249115.54 },
      { month: 'Oct', value: 269191.43 },
      { month: 'Nov', value: 279817.32 },
      { month: 'Déc', value: 304993.21 },
    ],
  },
  montigny: {
    '2025': [
      { month: 'Jan', value: 0 },
      { month: 'Fév', value: 0 },
      { month: 'Mar', value: 0 },
      { month: 'Avr', value: 0 },
      { month: 'Mai', value: 0 },
      { month: 'Juin', value: 0 },
      { month: 'Juil', value: 0 },
      { month: 'Août', value: 0 },
      { month: 'Sep', value: 0 },
      { month: 'Oct', value: 0 },
      { month: 'Nov', value: 0 },
      { month: 'Déc', value: 0 },
    ],
    '2026': [
      { month: 'Jan', value: 0 },
      { month: 'Fév', value: 0 },
      { month: 'Mar', value: 0 },
      { month: 'Avr', value: 0 },
      { month: 'Mai', value: 0 },
      { month: 'Juin', value: 0 },
      { month: 'Juil', value: 0 },
      { month: 'Août', value: 0 },
      { month: 'Sep', value: 0 },
      { month: 'Oct', value: 0 },
      { month: 'Nov', value: 0 },
      { month: 'Déc', value: 0 },
    ],
  },
  boissy: {
    '2025': [
      { month: 'Jan', value: 0 },
      { month: 'Fév', value: 18161.50 },
      { month: 'Mar', value: 34591 },
      { month: 'Avr', value: 49520.50 },
      { month: 'Mai', value: 70182 },
      { month: 'Juin', value: 89111.51 },
      { month: 'Juil', value: 104741.01 },
      { month: 'Août', value: 120370.51 },
      { month: 'Sep', value: 136000.01 },
      { month: 'Oct', value: 151929.51 },
      { month: 'Nov', value: 165959.01 },
      { month: 'Déc', value: 182188.51 },
    ],
    '2026': [
      { month: 'Jan', value: 198418.01 },
      { month: 'Fév', value: 210535.51 },
      { month: 'Mar', value: 228103.02 },
      { month: 'Avr', value: 238244.52 },
      { month: 'Mai', value: 257792.02 },
      { month: 'Juin', value: 277339.52 },
      { month: 'Juil', value: 296887.02 },
      { month: 'Août', value: 316434.52 },
      { month: 'Sep', value: 335982.02 },
      { month: 'Oct', value: 355529.52 },
      { month: 'Nov', value: 375077.02 },
      { month: 'Déc', value: 394624.53 },
    ],
  },
  moussy: {
    '2025': [
      { month: 'Jan', value: 0 },
      { month: 'Fév', value: -12383.49 },
      { month: 'Mar', value: -21266.98 },
      { month: 'Avr', value: -26750.47 },
      { month: 'Mai', value: -31533.97 },
      { month: 'Juin', value: -32917.46 },
      { month: 'Juil', value: -30600.95 },
      { month: 'Août', value: -29984.44 },
      { month: 'Sep', value: -29367.93 },
      { month: 'Oct', value: -28201.42 },
      { month: 'Nov', value: -23434.91 },
      { month: 'Déc', value: -16968.40 },
    ],
    '2026': [
      { month: 'Jan', value: -6601.90 },
      { month: 'Fév', value: 1345.61 },
      { month: 'Mar', value: 10108.12 },
      { month: 'Avr', value: 16835.63 },
      { month: 'Mai', value: 29543.14 },
      { month: 'Juin', value: 42250.65 },
      { month: 'Juil', value: 54958.16 },
      { month: 'Août', value: 67665.67 },
      { month: 'Sep', value: 80373.17 },
      { month: 'Oct', value: 93080.68 },
      { month: 'Nov', value: 105788.19 },
      { month: 'Déc', value: 118495.70 },
    ],
  },
  trappes: {
    '2025': [
      { month: 'Jan', value: 0 },
      { month: 'Fév', value: 0 },
      { month: 'Mar', value: 0 },
      { month: 'Avr', value: 0 },
      { month: 'Mai', value: 0 },
      { month: 'Juin', value: 0 },
      { month: 'Juil', value: 0 },
      { month: 'Août', value: -5148.24 },
      { month: 'Sep', value: -6796.48 },
      { month: 'Oct', value: -8594.71 },
      { month: 'Nov', value: -10392.95 },
      { month: 'Déc', value: -17286.19 },
    ],
    '2026': [
      { month: 'Jan', value: -20879.42 },
      { month: 'Fév', value: -24279.28 },
      { month: 'Mar', value: -29336.13 },
      { month: 'Avr', value: -31970.88 },
      { month: 'Mai', value: -32705.64 },
      { month: 'Juin', value: -31640.39 },
      { month: 'Juil', value: -30575.15 },
      { month: 'Août', value: -29509.90 },
      { month: 'Sep', value: -28444.66 },
      { month: 'Oct', value: -27379.42 },
      { month: 'Nov', value: -26314.17 },
      { month: 'Déc', value: -25248.93 },
    ],
  },
};

// --- Main Data Export ---
export const siteData: Record<SiteKey, SiteData> = {
  consolidated: {
    yearlyData: consolidatedDataYearly,
    monthlyData: consolidatedDataMonthly,
    expenseBreakdown: consolidatedDataExpenses,
    info: consolidatedInfo,
  },
  montigny: {
    yearlyData: montignyDataYearly,
    monthlyData: montignyDataMonthly,
    expenseBreakdown: montignyDataExpenses,
    info: montignyInfo,
  },
  boissy: {
    yearlyData: boissyDataYearly,
    monthlyData: boissyDataMonthly,
    expenseBreakdown: boissyDataExpenses,
    info: boissyInfo,
  },
  moussy: {
    yearlyData: moussyDataYearly,
    monthlyData: moussyDataMonthly,
    expenseBreakdown: moussyDataExpenses,
    info: moussyInfo,
  },
  trappes: {
    yearlyData: trappesDataYearly,
    monthlyData: trappesDataMonthly,
    expenseBreakdown: trappesDataExpenses,
    info: trappesInfo,
  },
};

export const clientData: Record<Exclude<SiteKey, 'consolidated'>, ClientData[]> = {
  montigny: montignyClients,
  boissy: boissyClients,
  moussy: moussyClients,
  trappes: trappesClients,
};

export const loanData: Record<Exclude<SiteKey, 'consolidated'>, LoanData[]> = {
  montigny: montignyLoans,
  boissy: boissyLoans,
  moussy: moussyLoans,
  trappes: trappesLoans,
};

export const buildingsList: { id: string; name: string }[] = [
  { id: 'consolidated', name: 'Consolidé (Global)' },
  { id: 'montigny', name: 'Site Montigny' },
  { id: 'boissy', name: 'Site Boissy' },
  { id: 'boissyExt', name: 'Site Moussy' },
  { id: 'batiment4', name: 'Site Trappes' },
  { id: 'nouveauSite', name: 'Nouveau Site' },
];

// --- Legacy exports (backward compatibility) ---
export const yearlyData = consolidatedDataYearly.map(d => ({
  year: d.year, revenue: d.revenue, expenses: d.expenses, profit: d.resultatNet
}));

export const financialData = {
  consolidated: { yearlyData: consolidatedDataYearly.map(d => ({ year: d.year, revenue: d.revenue, expenses: d.expenses, profit: d.resultatNet })), expenseBreakdown: consolidatedDataExpenses },
  montigny: { yearlyData: montignyDataYearly.map(d => ({ year: d.year, revenue: d.revenue, expenses: d.expenses, profit: d.resultatNet })), expenseBreakdown: montignyDataExpenses },
  boissy: { yearlyData: boissyDataYearly.map(d => ({ year: d.year, revenue: d.revenue, expenses: d.expenses, profit: d.resultatNet })), expenseBreakdown: boissyDataExpenses },
  boissyExt: { yearlyData: moussyDataYearly.map(d => ({ year: d.year, revenue: d.revenue, expenses: d.expenses, profit: d.resultatNet })), expenseBreakdown: moussyDataExpenses },
  batiment4: { yearlyData: trappesDataYearly.map(d => ({ year: d.year, revenue: d.revenue, expenses: d.expenses, profit: d.resultatNet })), expenseBreakdown: trappesDataExpenses },
  nouveauSite: { yearlyData: Array.from({ length: 9 }, (_, i) => ({ year: 2025 + i, revenue: 0, expenses: 0, profit: 0 })), expenseBreakdown: { 2025: [], 2026: [], 2027: [] } },
};

export const expenseBreakdown = consolidatedDataExpenses;

// Monthly tracking data for 2026 (BP values)
export const realRevenues2026: Record<string, { month: string; bp: number; reel: number | null }[]> = {
  consolidated: consolidatedDataMonthly[2026]?.map(m => ({ month: m.month, bp: m.ca, reel: m.ca })) || [],
  montigny: montignyDataMonthly[2026]?.map(m => ({ month: m.month, bp: m.ca, reel: m.ca })) || [],
  boissy: boissyDataMonthly[2026]?.map(m => ({ month: m.month, bp: m.ca, reel: m.ca })) || [],
  boissyExt: moussyDataMonthly[2026]?.map(m => ({ month: m.month, bp: m.ca, reel: m.ca })) || [],
  batiment4: trappesDataMonthly[2026]?.map(m => ({ month: m.month, bp: m.ca, reel: m.ca })) || [],
  nouveauSite: Array.from({ length: 12 }, (_, i) => ({ month: ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'][i], bp: 0, reel: 0 })),
};

export const realExpenses2026: Record<string, { month: string; bp: number; reel: number | null }[]> = {
  consolidated: consolidatedDataMonthly[2026]?.map(m => ({ month: m.month, bp: m.charges, reel: m.charges })) || [],
  montigny: montignyDataMonthly[2026]?.map(m => ({ month: m.month, bp: m.charges, reel: m.charges })) || [],
  boissy: boissyDataMonthly[2026]?.map(m => ({ month: m.month, bp: m.charges, reel: m.charges })) || [],
  boissyExt: moussyDataMonthly[2026]?.map(m => ({ month: m.month, bp: m.charges, reel: m.charges })) || [],
  batiment4: trappesDataMonthly[2026]?.map(m => ({ month: m.month, bp: m.charges, reel: m.charges })) || [],
  nouveauSite: Array.from({ length: 12 }, (_, i) => ({ month: ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'][i], bp: 0, reel: 0 })),
};

export const debtService2026: Record<string, number> = {
  consolidated: Math.round((consolidatedDataYearly.find(d => d.year === 2026)?.totalEmprunt || 0) / 12),
  montigny: Math.round((montignyDataYearly.find(d => d.year === 2026)?.totalEmprunt || 0) / 12),
  boissy: Math.round((boissyDataYearly.find(d => d.year === 2026)?.totalEmprunt || 0) / 12),
  boissyExt: Math.round((moussyDataYearly.find(d => d.year === 2026)?.totalEmprunt || 0) / 12),
  batiment4: Math.round((trappesDataYearly.find(d => d.year === 2026)?.totalEmprunt || 0) / 12),
  nouveauSite: 0,
};

export const occupancyRates: Record<string, number> = {
  consolidated: 85,
  montigny: 93,
  boissy: 74,
  boissyExt: 50,
  batiment4: 0,
  nouveauSite: 0,
};

export const realCashFlow2026: Record<string, { month: string; reel: number | null }[]> = {
  consolidated: consolidatedDataMonthly[2026]?.map(m => ({ month: m.month, reel: m.flux })) || [],
  montigny: montignyDataMonthly[2026]?.map(m => ({ month: m.month, reel: m.flux })) || [],
  boissy: boissyDataMonthly[2026]?.map(m => ({ month: m.month, reel: m.flux })) || [],
  boissyExt: moussyDataMonthly[2026]?.map(m => ({ month: m.month, reel: m.flux })) || [],
  batiment4: trappesDataMonthly[2026]?.map(m => ({ month: m.month, reel: m.flux })) || [],
  nouveauSite: Array.from({ length: 12 }, (_, i) => ({ month: ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'][i], reel: 0 })),
};

export const vatCredits2026: Record<string, number> = {
  'Jan': 32859,
  'Fév': 55766,
  'Mar': 72182,
  'Avr': 0,
  'Mai': 0,
  'Juin': 0,
  'Juil': 0,
  'Août': 0,
  'Sep': 0,
  'Oct': 0,
  'Nov': 0,
  'Déc': 0,
};

// ═══════════════════════════════════════════
// PREV ET CASH — Cash Flow Projection Data
// Source: reporting cash 4 batiments sheet
// ═══════════════════════════════════════════

const MONTHS_FR = ['Jan','Fév','Mar','Avr','Mai','Jun','Juil','Août','Sep','Oct','Nov','Déc'] as const;

export interface CashFlowMonth {
  month: string;
  monthIndex: number;  // 0-based
  year: number;
  // Per-site cumulative cash
  montigny: number;
  boissy: number;
  moussy: number;
  trappes: number;
  // Aggregates
  tresoExploitConso: number;      // Row 18
  tvaDeduireHorsExploit: number;  // Row 20
  totalTresoConso: number;        // Row 22
  variationMensuelle: number;     // Row 23
  // Décaissements
  paiementBati: number;
  fraisNotaire: number;
  fraisAgence: number;
  tvaFraisAgence: number;
  fraisDossier: number;
  travauxHT: number;
  tvaTravaux: number;
  travauxSansTVA: number;
  rembtCompteCourant: number;
  totalDecaissement: number;      // Row 35
  dontTVADeduire: number;         // Row 36
  // Encaissements
  tirageEmpruntBati: number;
  tirageEmpruntTravaux: number;
  apportCompteCourant: number;
  totalEncaissement: number;      // Row 42
  // Net
  tresorerieNet: number;          // Row 44
  // Synthèse BP
  tresoNetBP: number;             // Row 50
  impactTVA_BP: number;           // Row 51
  tresoBPapresTVA: number;        // Row 52
  // Réel & crédit TVA (manual inputs)
  soldeBancaireReel: number | null;   // Row 55
  creditTVA: number | null;           // Row 56
  // Computed
  positionConsolidee: number | null;  // Row 59 = bank + VAT credit
  ecartReelVsBP: number | null;       // Row 61
  ecartConsoVsBP: number | null;      // Row 62
}

// 2025: months 1-12, cols 3-14 (col index = monthIndex + 3)
// 2026: months 1-12, cols 16-27 (col index = monthIndex + 16)
export const cashFlowData2025: CashFlowMonth[] = [
  { month:'Jan', monthIndex:0, year:2025, montigny:18162, boissy:-12508, moussy:0, trappes:0, tresoExploitConso:5653, tvaDeduireHorsExploit:0, totalTresoConso:5653, variationMensuelle:0, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:0, tvaTravaux:0, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:0, dontTVADeduire:0, tirageEmpruntBati:0, tirageEmpruntTravaux:0, apportCompteCourant:0, totalEncaissement:0, tresorerieNet:5653, tresoNetBP:5653, impactTVA_BP:-9079, tresoBPapresTVA:-3426, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
  { month:'Fév', monthIndex:1, year:2025, montigny:34591, boissy:-21517, moussy:0, trappes:0, tresoExploitConso:13074, tvaDeduireHorsExploit:0, totalTresoConso:13074, variationMensuelle:7421, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:0, tvaTravaux:0, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:0, dontTVADeduire:0, tirageEmpruntBati:0, tirageEmpruntTravaux:0, apportCompteCourant:0, totalEncaissement:0, tresorerieNet:13074, tresoNetBP:13074, impactTVA_BP:-9433, tresoBPapresTVA:3641, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
  { month:'Mar', monthIndex:2, year:2025, montigny:49521, boissy:-27125, moussy:0, trappes:0, tresoExploitConso:22395, tvaDeduireHorsExploit:0, totalTresoConso:22395, variationMensuelle:9321, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:0, tvaTravaux:0, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:0, dontTVADeduire:0, tirageEmpruntBati:0, tirageEmpruntTravaux:0, apportCompteCourant:0, totalEncaissement:0, tresorerieNet:22395, tresoNetBP:22395, impactTVA_BP:-9813, tresoBPapresTVA:12582, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
  { month:'Avr', monthIndex:3, year:2025, montigny:70182, boissy:-32034, moussy:0, trappes:0, tresoExploitConso:38148, tvaDeduireHorsExploit:0, totalTresoConso:38148, variationMensuelle:15753, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:0, tvaTravaux:0, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:0, dontTVADeduire:0, tirageEmpruntBati:0, tirageEmpruntTravaux:0, apportCompteCourant:0, totalEncaissement:0, tresorerieNet:38148, tresoNetBP:38148, impactTVA_BP:-11099, tresoBPapresTVA:27049, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
  { month:'Mai', monthIndex:4, year:2025, montigny:89112, boissy:-33542, moussy:0, trappes:0, tresoExploitConso:55569, tvaDeduireHorsExploit:0, totalTresoConso:55569, variationMensuelle:17421, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:0, tvaTravaux:0, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:0, dontTVADeduire:0, tirageEmpruntBati:0, tirageEmpruntTravaux:0, apportCompteCourant:0, totalEncaissement:0, tresorerieNet:55569, tresoNetBP:55569, impactTVA_BP:-11433, tresoBPapresTVA:44136, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
  { month:'Jun', monthIndex:5, year:2025, montigny:104741, boissy:-31351, moussy:0, trappes:0, tresoExploitConso:73390, tvaDeduireHorsExploit:0, totalTresoConso:73390, variationMensuelle:17821, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:0, tvaTravaux:0, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:0, dontTVADeduire:0, tirageEmpruntBati:0, tirageEmpruntTravaux:0, apportCompteCourant:0, totalEncaissement:0, tresorerieNet:73390, tresoNetBP:73390, impactTVA_BP:-11513, tresoBPapresTVA:61877, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
  { month:'Juil', monthIndex:6, year:2025, montigny:120371, boissy:-30859, moussy:-5148, trappes:0, tresoExploitConso:84363, tvaDeduireHorsExploit:0, totalTresoConso:84363, variationMensuelle:10973, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:0, tvaTravaux:0, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:0, dontTVADeduire:0, tirageEmpruntBati:0, tirageEmpruntTravaux:0, apportCompteCourant:0, totalEncaissement:0, tresorerieNet:84363, tresoNetBP:84363, impactTVA_BP:-10473, tresoBPapresTVA:73890, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
  { month:'Août', monthIndex:7, year:2025, montigny:136000, boissy:-30368, moussy:-6796, trappes:0, tresoExploitConso:98836, tvaDeduireHorsExploit:0, totalTresoConso:98836, variationMensuelle:14473, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:0, tvaTravaux:0, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:0, dontTVADeduire:0, tirageEmpruntBati:0, tirageEmpruntTravaux:0, apportCompteCourant:0, totalEncaissement:0, tresorerieNet:98836, tresoNetBP:98836, impactTVA_BP:-11173, tresoBPapresTVA:87663, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
  { month:'Sep', monthIndex:8, year:2025, montigny:151930, boissy:-29326, moussy:-8595, trappes:0, tresoExploitConso:114008, tvaDeduireHorsExploit:0, totalTresoConso:114008, variationMensuelle:15173, paiementBati:50000, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:0, tvaTravaux:0, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:50000, dontTVADeduire:0, tirageEmpruntBati:0, tirageEmpruntTravaux:0, apportCompteCourant:0, totalEncaissement:0, tresorerieNet:64008, tresoNetBP:64008, impactTVA_BP:-11343, tresoBPapresTVA:52665, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
  { month:'Oct', monthIndex:9, year:2025, montigny:165959, boissy:-24685, moussy:-10393, trappes:0, tresoExploitConso:130881, tvaDeduireHorsExploit:0, totalTresoConso:130881, variationMensuelle:16873, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:21000, tvaTravaux:4200, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:25200, dontTVADeduire:-4200, tirageEmpruntBati:0, tirageEmpruntTravaux:50000, apportCompteCourant:0, totalEncaissement:50000, tresorerieNet:105681, tresoNetBP:105681, impactTVA_BP:-11683, tresoBPapresTVA:93998, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
  { month:'Nov', monthIndex:10, year:2025, montigny:182189, boissy:-18343, moussy:-17352, trappes:-800, tresoExploitConso:145693, tvaDeduireHorsExploit:4200, totalTresoConso:149893, variationMensuelle:19012, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:21000, tvaTravaux:4200, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:25200, dontTVADeduire:-4200, tirageEmpruntBati:0, tirageEmpruntTravaux:0, apportCompteCourant:0, totalEncaissement:0, tresorerieNet:99493, tresoNetBP:99493, impactTVA_BP:-11271, tresoBPapresTVA:88222, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
  { month:'Déc', monthIndex:11, year:2025, montigny:198418, boissy:-8102, moussy:-21011, trappes:-12123, tresoExploitConso:157182, tvaDeduireHorsExploit:4200, totalTresoConso:161382, variationMensuelle:11489, paiementBati:1350000, fraisNotaire:31770, fraisAgence:65000, tvaFraisAgence:13000, fraisDossier:5000, travauxHT:156000, tvaTravaux:31200, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:1651970, dontTVADeduire:-44200, tirageEmpruntBati:1120000, tirageEmpruntTravaux:187200, apportCompteCourant:250000, totalEncaissement:1557200, tresorerieNet:16212, tresoNetBP:16212, impactTVA_BP:-11726, tresoBPapresTVA:4486, soldeBancaireReel:23309, creditTVA:46431, positionConsolidee:69740, ecartReelVsBP:18823, ecartConsoVsBP:65254 },
];

export const cashFlowData2026: CashFlowMonth[] = [
  { month:'Jan', monthIndex:0, year:2026, montigny:210621, boissy:-279, moussy:-24417, trappes:-34993, tresoExploitConso:150931, tvaDeduireHorsExploit:44200, totalTresoConso:195131, variationMensuelle:33749, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:0, tvaTravaux:0, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:0, dontTVADeduire:0, tirageEmpruntBati:0, tirageEmpruntTravaux:0, apportCompteCourant:0, totalEncaissement:0, tresorerieNet:49961, tresoNetBP:49961, impactTVA_BP:-8681, tresoBPapresTVA:41280, soldeBancaireReel:34585, creditTVA:32859, positionConsolidee:67444, ecartReelVsBP:-6695, ecartConsoVsBP:26164 },
  { month:'Fév', monthIndex:1, year:2026, montigny:228273, boissy:8358, moussy:-29480, trappes:-52620, tresoExploitConso:154531, tvaDeduireHorsExploit:0, totalTresoConso:154531, variationMensuelle:-40601, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:120265, tvaTravaux:24053, travauxSansTVA:9000, rembtCompteCourant:12000, totalDecaissement:165318, dontTVADeduire:-24053, tirageEmpruntBati:0, tirageEmpruntTravaux:144320, apportCompteCourant:0, totalEncaissement:144320, tresorerieNet:-11637, tresoNetBP:-11637, impactTVA_BP:-10129, tresoBPapresTVA:-21767, soldeBancaireReel:48155, creditTVA:55766, positionConsolidee:103921, ecartReelVsBP:69922, ecartConsoVsBP:125688 },
  { month:'Mar', monthIndex:2, year:2026, montigny:238100, boissy:14961, moussy:-33891, trappes:-65203, tresoExploitConso:153966, tvaDeduireHorsExploit:24053, totalTresoConso:178019, variationMensuelle:23489, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:131000, tvaTravaux:26200, travauxSansTVA:0, rembtCompteCourant:12000, totalDecaissement:169200, dontTVADeduire:-26200, tirageEmpruntBati:0, tirageEmpruntTravaux:157200, apportCompteCourant:0, totalEncaissement:157200, tresorerieNet:-149, tresoNetBP:-149, impactTVA_BP:-11740, tresoBPapresTVA:-11889, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
  { month:'Avr', monthIndex:3, year:2026, montigny:255752, boissy:19098, moussy:-36402, trappes:-72786, tresoExploitConso:165663, tvaDeduireHorsExploit:26200, totalTresoConso:191863, variationMensuelle:13844, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:0, tvaTravaux:0, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:0, dontTVADeduire:0, tirageEmpruntBati:0, tirageEmpruntTravaux:0, apportCompteCourant:0, totalEncaissement:0, tresorerieNet:13695, tresoNetBP:13695, impactTVA_BP:-11924, tresoBPapresTVA:1771, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
  { month:'Mai', monthIndex:4, year:2026, montigny:267820, boissy:30101, moussy:-35642, trappes:-89439, tresoExploitConso:172839, tvaDeduireHorsExploit:0, totalTresoConso:172839, variationMensuelle:-19023, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:0, tvaTravaux:0, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:0, dontTVADeduire:0, tirageEmpruntBati:0, tirageEmpruntTravaux:0, apportCompteCourant:0, totalEncaissement:0, tresorerieNet:-5329, tresoNetBP:-5329, impactTVA_BP:-11020, tresoBPapresTVA:-16349, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
  { month:'Jun', monthIndex:5, year:2026, montigny:278187, boissy:39403, moussy:-34883, trappes:-103351, tresoExploitConso:179356, tvaDeduireHorsExploit:0, totalTresoConso:179356, variationMensuelle:6517, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:0, tvaTravaux:0, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:0, dontTVADeduire:0, tirageEmpruntBati:0, tirageEmpruntTravaux:0, apportCompteCourant:0, totalEncaissement:0, tresorerieNet:1188, tresoNetBP:1188, impactTVA_BP:-10888, tresoBPapresTVA:-9700, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
  { month:'Juil', monthIndex:6, year:2026, montigny:292755, boissy:50406, moussy:-34124, trappes:-121636, tresoExploitConso:187401, tvaDeduireHorsExploit:0, totalTresoConso:187401, variationMensuelle:8045, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:0, tvaTravaux:0, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:0, dontTVADeduire:0, tirageEmpruntBati:0, tirageEmpruntTravaux:0, apportCompteCourant:0, totalEncaissement:0, tresorerieNet:9233, tresoNetBP:9233, impactTVA_BP:-12578, tresoBPapresTVA:-3345, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
  { month:'Août', monthIndex:7, year:2026, montigny:307322, boissy:61408, moussy:-33365, trappes:-137370, tresoExploitConso:197996, tvaDeduireHorsExploit:0, totalTresoConso:197996, variationMensuelle:10595, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:0, tvaTravaux:0, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:0, dontTVADeduire:0, tirageEmpruntBati:0, tirageEmpruntTravaux:0, apportCompteCourant:0, totalEncaissement:0, tresorerieNet:19828, tresoNetBP:19828, impactTVA_BP:-13088, tresoBPapresTVA:6740, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
  { month:'Sep', monthIndex:8, year:2026, montigny:321890, boissy:72411, moussy:-32605, trappes:-150554, tresoExploitConso:211140, tvaDeduireHorsExploit:0, totalTresoConso:211140, variationMensuelle:13145, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:0, tvaTravaux:0, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:0, dontTVADeduire:0, tirageEmpruntBati:0, tirageEmpruntTravaux:0, apportCompteCourant:0, totalEncaissement:0, tresorerieNet:32972, tresoNetBP:32972, impactTVA_BP:-13598, tresoBPapresTVA:19375, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
  { month:'Oct', monthIndex:9, year:2026, montigny:336457, boissy:83413, moussy:-31846, trappes:-173189, tresoExploitConso:214835, tvaDeduireHorsExploit:0, totalTresoConso:214835, variationMensuelle:3695, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:0, tvaTravaux:0, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:0, dontTVADeduire:0, tirageEmpruntBati:0, tirageEmpruntTravaux:0, apportCompteCourant:0, totalEncaissement:0, tresorerieNet:36667, tresoNetBP:36667, impactTVA_BP:-14108, tresoBPapresTVA:22560, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
  { month:'Nov', monthIndex:10, year:2026, montigny:351025, boissy:95996, moussy:-31087, trappes:-181273, tresoExploitConso:234660, tvaDeduireHorsExploit:0, totalTresoConso:234660, variationMensuelle:19825, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:0, tvaTravaux:0, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:0, dontTVADeduire:0, tirageEmpruntBati:0, tirageEmpruntTravaux:0, apportCompteCourant:0, totalEncaissement:0, tresorerieNet:56492, tresoNetBP:56492, impactTVA_BP:-14934, tresoBPapresTVA:41558, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
  { month:'Déc', monthIndex:11, year:2026, montigny:365592, boissy:108578, moussy:-30328, trappes:-186807, tresoExploitConso:257035, tvaDeduireHorsExploit:0, totalTresoConso:257035, variationMensuelle:22375, paiementBati:0, fraisNotaire:0, fraisAgence:0, tvaFraisAgence:0, fraisDossier:0, travauxHT:0, tvaTravaux:0, travauxSansTVA:0, rembtCompteCourant:0, totalDecaissement:0, dontTVADeduire:0, tirageEmpruntBati:0, tirageEmpruntTravaux:0, apportCompteCourant:0, totalEncaissement:0, tresorerieNet:78867, tresoNetBP:78867, impactTVA_BP:-15444, tresoBPapresTVA:63423, soldeBancaireReel:null, creditTVA:null, positionConsolidee:null, ecartReelVsBP:null, ecartConsoVsBP:null },
];

// ═══════════════════════════════════════════
// LEASING CONTRACTS DATA
// Source: SUIVI CONTRAT LEASING WS 2025.xlsx
// ═══════════════════════════════════════════

export interface LeasingContract {
  numero: string;
  duree: number; // months
  echeance: string; // end date
  loyerMensuel: number;
  loyerTrimestriel: number;
  compta: string;
  description: string;
  lieu: string;
  detail: string;
  fournisseur: string;
}

export const leasingContracts: LeasingContract[] = [
  { numero: '083-58389', duree: 60, echeance: '2028-01-15', loyerMensuel: 600, loyerTrimestriel: 1800, compta: '613508', description: 'MEZZANINE', lieu: 'MONTIGNY', detail: 'Materiel', fournisseur: 'LS PARTENAIRES' },
  { numero: '083-59865', duree: 60, echeance: '2028-04-15', loyerMensuel: 1400, loyerTrimestriel: 4200, compta: '613508', description: 'MEZZANINE', lieu: 'MONTIGNY', detail: 'Matériel', fournisseur: 'LS PARTENAIRES' },
  { numero: '083-64360', duree: 60, echeance: '2029-04-15', loyerMensuel: 622, loyerTrimestriel: 1866, compta: '613511', description: 'MEZZANINE', lieu: 'BOISSY', detail: 'Mezzanine métallique', fournisseur: 'LS PARTENAIRES' },
  { numero: '083-65425', duree: 60, echeance: '2029-07-15', loyerMensuel: 1452, loyerTrimestriel: 4355, compta: '613511', description: 'MEZZANINE', lieu: 'BOISSY', detail: 'Mezzanine', fournisseur: 'LS PARTENAIRES' },
  { numero: '083-65560', duree: 60, echeance: '2029-07-15', loyerMensuel: 88, loyerTrimestriel: 263, compta: '613511', description: 'MEZZANINE', lieu: 'BOISSY', detail: 'Escalier Metallique', fournisseur: 'LS PARTENAIRES' },
  { numero: '058-66126', duree: 60, echeance: '2029-07-15', loyerMensuel: 1900, loyerTrimestriel: 5700, compta: '613512', description: 'ALARME', lieu: 'BOISSY', detail: 'Alarme anti intrusion', fournisseur: 'I-LYNX' },
  { numero: '083-66327', duree: 36, echeance: '2027-10-15', loyerMensuel: 226, loyerTrimestriel: 677, compta: '613513', description: 'ENSEIGNE', lieu: 'BOISSY', detail: 'Enseigne', fournisseur: "PRO P'OZ" },
  { numero: '083-70859', duree: 60, echeance: '2030-10-15', loyerMensuel: 148, loyerTrimestriel: 445, compta: '613515', description: 'MEZZANINE', lieu: 'MOUSSY', detail: 'Selon devis DE70920-02', fournisseur: 'LS PARTENAIRES' },
  { numero: '083-71647', duree: 60, echeance: '2030-10-15', loyerMensuel: 337, loyerTrimestriel: 1012, compta: '613515', description: 'MEZZANINE', lieu: 'MOUSSY', detail: 'Rayonnage', fournisseur: 'LS PARTENAIRES' },
  { numero: '083-72218', duree: 60, echeance: '2031-01-15', loyerMensuel: 391, loyerTrimestriel: 1173, compta: '613517', description: 'ALARME', lieu: 'MOUSSY', detail: 'Installation Videosurveillance', fournisseur: 'I-LYNX' },
  { numero: '083-73013', duree: 60, echeance: '2031-01-01', loyerMensuel: 116, loyerTrimestriel: 349, compta: '', description: 'Porte Sectionnelle', lieu: 'MOUSSY', detail: 'Porte Sectionnelle', fournisseur: 'MANUREGION' },
  { numero: '083-74295', duree: 60, echeance: '2031-04-01', loyerMensuel: 101, loyerTrimestriel: 304, compta: '', description: 'TRAVAUX', lieu: 'TRAPPES', detail: 'Rideau metallique', fournisseur: 'AS TEKNIK' },
  { numero: '083-73520', duree: 60, echeance: '2031-04-01', loyerMensuel: 587, loyerTrimestriel: 1761, compta: '', description: 'MEZZANINE', lieu: 'TRAPPES', detail: 'Mezzanine de stockage', fournisseur: 'DIPLEX' },
  { numero: '083-73549', duree: 60, echeance: '2031-04-01', loyerMensuel: 322, loyerTrimestriel: 967, compta: '', description: 'MONTE CHARGES', lieu: 'TRAPPES', detail: 'Monte charge', fournisseur: 'MAIA ASCENSEURS' },
  { numero: '058-73431', duree: 60, echeance: '2031-07-01', loyerMensuel: 1800, loyerTrimestriel: 5400, compta: '', description: 'ALARME', lieu: 'TRAPPES', detail: 'SYSTÈME DE SECURITE', fournisseur: 'SYNERGY - LEASE' },
  { numero: '083-71158', duree: 60, echeance: '2031-01-15', loyerMensuel: 208, loyerTrimestriel: 624, compta: '613516', description: 'COPIEUR', lieu: 'DEPOT', detail: 'IRA 5840', fournisseur: 'ACCOPY' },
];

// Total monthly leasing cost
export const totalMonthlyLeasing = leasingContracts.reduce((sum, c) => sum + c.loyerMensuel, 0);

// Leasing by site
export const leasingBySite: Record<string, { total: number; contracts: LeasingContract[] }> = {};
leasingContracts.forEach(c => {
  const key = c.lieu.toLowerCase();
  if (!leasingBySite[key]) leasingBySite[key] = { total: 0, contracts: [] };
  leasingBySite[key].total += c.loyerMensuel;
  leasingBySite[key].contracts.push(c);
});

// ═══════════════════════════════════════════
// EXPECTED INFLOWS (VAT Refunds, etc.)
// ═══════════════════════════════════════════

export interface ExpectedInflow {
  id: string;
  label: string;
  amount: number;
  expectedMonth: string; // e.g. 'Jun'
  expectedYear: number;
  status: 'pending' | 'received';
  type: 'vat_refund' | 'other';
  note: string;
}

export const expectedInflows: ExpectedInflow[] = [
  {
    id: 'vat-refund-2026-06',
    label: 'Remboursement TVA — Demande du 23 avril',
    amount: 65000,
    expectedMonth: 'Jun',
    expectedYear: 2026,
    status: 'pending',
    type: 'vat_refund',
    note: 'Environ 5 semaines après le 23 avril → première semaine de juin',
  },
];

