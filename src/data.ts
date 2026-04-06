export const yearlyData = [
  { year: 2025, revenue: 918184, expenses: 152540, profit: 765644 },
  { year: 2026, revenue: 1238595, expenses: 202542, profit: 1036053 },
  { year: 2027, revenue: 1532820, expenses: 208620, profit: 1324200 },
  { year: 2028, revenue: 1550820, expenses: 208620, profit: 1342200 },
  { year: 2029, revenue: 1550820, expenses: 208620, profit: 1342200 },
  { year: 2030, revenue: 1550820, expenses: 208620, profit: 1342200 },
  { year: 2031, revenue: 1550820, expenses: 208620, profit: 1342200 },
  { year: 2032, revenue: 1550820, expenses: 208620, profit: 1342200 },
  { year: 2033, revenue: 1550820, expenses: 208620, profit: 1342200 },
  { year: 2034, revenue: 1550820, expenses: 208620, profit: 1342200 },
];

export const expenseBreakdown = {
  2025: [
    { name: 'Electricité', value: 42500 },
    { name: 'Nettoyage', value: 38720 },
    { name: 'Internet', value: 18340 },
    { name: 'Assurances', value: 13900 },
    { name: 'Publicité', value: 12000 },
    { name: 'Outil Facturation', value: 9360 },
    { name: 'Autres', value: 17720 }
  ],
  2026: [
    { name: 'Electricité', value: 54295 },
    { name: 'Internet', value: 26940 },
    { name: 'Assurances', value: 24854 },
    { name: 'Salaires', value: 22500 },
    { name: 'Publicité', value: 12000 },
    { name: 'Nettoyage', value: 11013 },
    { name: 'Autres', value: 50940 }
  ],
  2027: [
    { name: 'Electricité', value: 55800 },
    { name: 'Salaires', value: 30000 },
    { name: 'Internet', value: 29640 },
    { name: 'Assurances', value: 22200 },
    { name: 'Publicité', value: 12000 },
    { name: 'Consommables', value: 9000 },
    { name: 'Autres', value: 49980 }
  ]
};

// Fill remaining years with 2027 data as they are identical in the spreadsheet
[2028, 2029, 2030, 2031, 2032, 2033, 2034].forEach(year => {
  (expenseBreakdown as any)[year] = expenseBreakdown[2027];
});

// --- MONTIGNY REAL DATA ---
const montignyYearlyData = [
  { year: 2025, revenue: 660784, expenses: 95340, profit: 133222 },
  { year: 2026, revenue: 652595, expenses: 83980, profit: 145121 },
  { year: 2027, revenue: 655020, expenses: 76380, profit: 155688 },
  { year: 2028, revenue: 655020, expenses: 76380, profit: 194435 },
  { year: 2029, revenue: 655020, expenses: 76380, profit: 197604 },
  { year: 2030, revenue: 655020, expenses: 76380, profit: 200835 },
  { year: 2031, revenue: 655020, expenses: 76380, profit: 204130 },
  { year: 2032, revenue: 655020, expenses: 76380, profit: 207489 },
  { year: 2033, revenue: 655020, expenses: 76380, profit: 210915 },
  { year: 2034, revenue: 655020, expenses: 76380, profit: 214407 },
];

const montignyExpenseBreakdown = {
  2025: [
    { name: 'Electricité', value: 27600 },
    { name: 'Nettoyage', value: 18960 },
    { name: 'Publicité', value: 12000 },
    { name: 'Internet', value: 10680 },
    { name: 'Outil Facturation', value: 9360 },
    { name: 'Assurances', value: 7200 },
    { name: 'Autres', value: 9540 }
  ],
  2026: [
    { name: 'Electricité', value: 27600 },
    { name: 'Publicité', value: 12000 },
    { name: 'Internet', value: 10680 },
    { name: 'Outil Facturation', value: 9360 },
    { name: 'Assurances', value: 7200 },
    { name: 'Nettoyage', value: 4740 },
    { name: 'Autres', value: 12400 }
  ],
  2027: [
    { name: 'Electricité', value: 27600 },
    { name: 'Publicité', value: 12000 },
    { name: 'Internet', value: 10680 },
    { name: 'Outil Facturation', value: 9360 },
    { name: 'Assurances', value: 7200 },
    { name: 'Autres', value: 9540 }
  ]
};

[2028, 2029, 2030, 2031, 2032, 2033, 2034].forEach(year => {
  (montignyExpenseBreakdown as any)[year] = montignyExpenseBreakdown[2027];
});
// --------------------------

// --- BOISSY REAL DATA ---
const boissyYearlyData = [
  { year: 2025, revenue: 255400, expenses: 54660, profit: -38158 },
  { year: 2026, revenue: 390000, expenses: 40440, profit: 88943 },
  { year: 2027, revenue: 396000, expenses: 35700, profit: 99588 },
  { year: 2028, revenue: 396000, expenses: 35700, profit: 102287 },
  { year: 2029, revenue: 396000, expenses: 35700, profit: 114460 },
  { year: 2030, revenue: 396000, expenses: 35700, profit: 145470 },
  { year: 2031, revenue: 396000, expenses: 35700, profit: 148524 },
  { year: 2032, revenue: 396000, expenses: 35700, profit: 151707 },
  { year: 2033, revenue: 396000, expenses: 35700, profit: 155023 },
  { year: 2034, revenue: 396000, expenses: 35700, profit: 158478 },
];

const boissyExpenseBreakdown = {
  2025: [
    { name: 'Electricité', value: 14400 },
    { name: 'Nettoyage', value: 18960 },
    { name: 'Internet', value: 7560 },
    { name: 'Assurances', value: 6000 },
    { name: 'Autres', value: 7740 }
  ],
  2026: [
    { name: 'Electricité', value: 14400 },
    { name: 'Internet', value: 7560 },
    { name: 'Assurances', value: 6000 },
    { name: 'Nettoyage', value: 4740 },
    { name: 'Autres', value: 7740 }
  ],
  2027: [
    { name: 'Electricité', value: 14400 },
    { name: 'Internet', value: 7560 },
    { name: 'Assurances', value: 6000 },
    { name: 'Autres', value: 7740 }
  ]
};

[2028, 2029, 2030, 2031, 2032, 2033, 2034].forEach(year => {
  (boissyExpenseBreakdown as any)[year] = boissyExpenseBreakdown[2027];
});
// --------------------------

// --- MOUSSY REAL DATA ---
const moussyYearlyData = [
  { year: 2025, revenue: 2000, expenses: 10540, profit: -38165 },
  { year: 2026, revenue: 69900, expenses: 8080, profit: -8059 },
  { year: 2027, revenue: 85200, expenses: 8040, profit: 7542 },
  { year: 2028, revenue: 85200, expenses: 8040, profit: 8545 },
  { year: 2029, revenue: 85200, expenses: 8040, profit: 9589 },
  { year: 2030, revenue: 85200, expenses: 8040, profit: 12065 },
  { year: 2031, revenue: 85200, expenses: 8040, profit: 20136 },
  { year: 2032, revenue: 85200, expenses: 8040, profit: 21308 },
  { year: 2033, revenue: 85200, expenses: 8040, profit: 22360 },
  { year: 2034, revenue: 85200, expenses: 8040, profit: 23398 },
];

const moussyExpenseBreakdown = {
  2025: [
    { name: 'Architecte', value: 3500 },
    { name: 'Autres', value: 3100 },
    { name: 'Nettoyage', value: 800 },
    { name: 'Electricité', value: 500 },
    { name: 'Assurances', value: 300 },
    { name: 'Divers', value: 200 }
  ],
  2026: [
    { name: 'Autres', value: 1800 },
    { name: 'Electricité', value: 3000 },
    { name: 'Assurances', value: 1800 },
    { name: 'Divers', value: 1000 },
    { name: 'Nettoyage', value: 400 }
  ],
  2027: [
    { name: 'Electricité', value: 3000 },
    { name: 'Assurances', value: 1800 },
    { name: 'Divers', value: 1200 },
    { name: 'Internet', value: 600 },
    { name: 'Eau', value: 480 }
  ]
};

[2028, 2029, 2030, 2031, 2032, 2033, 2034].forEach(year => {
  (moussyExpenseBreakdown as any)[year] = moussyExpenseBreakdown[2027];
});
// --------------------------

// --- TRAPPES REAL DATA ---
const trappesYearlyData = [
  { year: 2025, revenue: 0, expenses: 6525, profit: -20769 },
  { year: 2026, revenue: 91800, expenses: 104450, profit: -249830 },
  { year: 2027, revenue: 372150, expenses: 88500, profit: 17831 },
  { year: 2028, revenue: 401400, expenses: 88500, profit: 44889 },
  { year: 2029, revenue: 401400, expenses: 88500, profit: 47596 },
  { year: 2030, revenue: 401400, expenses: 88500, profit: 50411 },
  { year: 2031, revenue: 401400, expenses: 88500, profit: 94516 },
  { year: 2032, revenue: 401400, expenses: 88500, profit: 111288 },
  { year: 2033, revenue: 401400, expenses: 88500, profit: 114457 },
  { year: 2034, revenue: 401400, expenses: 88500, profit: 117754 },
];

const trappesExpenseBreakdown = {
  2025: [
    { name: 'INGEBIM', value: 3700 },
    { name: 'JPS', value: 1425 },
    { name: 'CSPS', value: 1000 },
    { name: 'Assurances', value: 400 }
  ],
  2026: [
    { name: 'Salaires', value: 28800 },
    { name: 'Architecte', value: 24000 },
    { name: 'Electricité', value: 8100 },
    { name: 'Internet', value: 8100 },
    { name: 'INGEBIM', value: 7400 },
    { name: 'Assurances', value: 6800 },
    { name: 'Consommables', value: 6750 },
    { name: 'Véhicules', value: 5220 },
    { name: 'Divers', value: 9280 }
  ],
  2027: [
    { name: 'Salaires', value: 38400 },
    { name: 'Electricité', value: 10800 },
    { name: 'Internet', value: 10800 },
    { name: 'Consommables', value: 9000 },
    { name: 'Assurances', value: 7200 },
    { name: 'Véhicules', value: 6960 },
    { name: 'Divers', value: 5340 }
  ]
};

[2028, 2029, 2030, 2031, 2032, 2033, 2034].forEach(year => {
  (trappesExpenseBreakdown as any)[year] = trappesExpenseBreakdown[2027];
});
// --------------------------

// --- CONSOLIDATED DATA ---
const consolidatedYearlyData = [
  { year: 2025, revenue: 918184, expenses: 167065, profit: 36130 },
  { year: 2026, revenue: 1204295, expenses: 236950, profit: -23824 },
  { year: 2027, revenue: 1508370, expenses: 208620, profit: 280649 },
  { year: 2028, revenue: 1537620, expenses: 208620, profit: 350156 },
  { year: 2029, revenue: 1537620, expenses: 208620, profit: 369248 },
  { year: 2030, revenue: 1537620, expenses: 208620, profit: 408782 },
  { year: 2031, revenue: 1537620, expenses: 208620, profit: 467306 },
  { year: 2032, revenue: 1537620, expenses: 208620, profit: 491791 },
  { year: 2033, revenue: 1537620, expenses: 208620, profit: 502755 },
  { year: 2034, revenue: 1537620, expenses: 208620, profit: 502755 },
];

const consolidatedExpenseBreakdown = {
  2025: [
    { name: 'Nettoyage', value: 38720 },
    { name: 'Assurances', value: 13900 },
    { name: 'Publicité', value: 12000 },
    { name: 'Outil Facturation', value: 9360 },
    { name: 'Chariot élévateur', value: 5280 },
    { name: 'Divers', value: 5000 },
    { name: 'Electricité', value: 42500 },
    { name: 'Internet', value: 18340 },
    { name: 'Eau', value: 2240 },
    { name: 'Fontaine', value: 1300 },
    { name: 'Architecte', value: 3500 },
    { name: 'INGEBIM', value: 3700 },
    { name: 'CSPS', value: 1000 },
    { name: 'JPS', value: 1425 },
    { name: 'Autres', value: 4900 },
    { name: 'Honoraires', value: 1800 },
    { name: 'Clim', value: 2100 }
  ],
  2026: [
    { name: 'Electricité', value: 53100 },
    { name: 'Internet', value: 26940 },
    { name: 'Assurances', value: 21800 },
    { name: 'Salaires', value: 22500 },
    { name: 'Publicité', value: 12000 },
    { name: 'Nettoyage', value: 9880 },
    { name: 'Architecte', value: 24000 },
    { name: 'INGEBIM', value: 7400 },
    { name: 'CSPS', value: 2500 },
    { name: 'JPS', value: 2775 },
    { name: 'Autres', value: 2860 },
    { name: 'Chariot élévateur', value: 5280 },
    { name: 'Divers', value: 7600 },
    { name: 'Eau', value: 3450 },
    { name: 'Fontaine', value: 2150 },
    { name: 'Honoraires', value: 1800 },
    { name: 'Clim', value: 3105 },
    { name: 'Véhicules', value: 3600 },
    { name: 'Assurance Véhicules', value: 720 },
    { name: 'Essence', value: 900 },
    { name: 'Consommables', value: 6750 },
    { name: 'Tel Portable', value: 180 }
  ],
  2027: [
    { name: 'Electricité', value: 55800 },
    { name: 'Salaires', value: 30000 },
    { name: 'Internet', value: 29640 },
    { name: 'Assurances', value: 22200 },
    { name: 'Publicité', value: 12000 },
    { name: 'Consommables', value: 9000 },
    { name: 'Chariot élévateur', value: 5280 },
    { name: 'Divers', value: 8400 },
    { name: 'Eau', value: 3720 },
    { name: 'Fontaine', value: 2400 },
    { name: 'Honoraires', value: 1800 },
    { name: 'Clim', value: 3420 },
    { name: 'Véhicules', value: 4800 },
    { name: 'Assurance Véhicules', value: 960 },
    { name: 'Essence', value: 1200 },
    { name: 'Tel Portable', value: 240 },
    { name: 'Outil Facturation', value: 9360 }
  ]
};

[2028, 2029, 2030, 2031, 2032, 2033, 2034].forEach(year => {
  (consolidatedExpenseBreakdown as any)[year] = consolidatedExpenseBreakdown[2027];
});
// --------------------------

// --- NOUVEAU SITE DATA ---
const nouveauSiteYearlyData = [
  { year: 2025, revenue: 0, expenses: 0, profit: 0 },
  { year: 2026, revenue: 0, expenses: 0, profit: 0 },
  { year: 2027, revenue: 0, expenses: 0, profit: 0 },
  { year: 2028, revenue: 0, expenses: 0, profit: 0 },
  { year: 2029, revenue: 0, expenses: 0, profit: 0 },
  { year: 2030, revenue: 0, expenses: 0, profit: 0 },
  { year: 2031, revenue: 0, expenses: 0, profit: 0 },
  { year: 2032, revenue: 0, expenses: 0, profit: 0 },
  { year: 2033, revenue: 0, expenses: 0, profit: 0 },
  { year: 2034, revenue: 0, expenses: 0, profit: 0 },
];

const nouveauSiteExpenseBreakdown = {
  2025: [{ name: 'Divers', value: 0 }],
  2026: [{ name: 'Divers', value: 0 }],
  2027: [{ name: 'Divers', value: 0 }]
};

[2028, 2029, 2030, 2031, 2032, 2033, 2034].forEach(year => {
  (nouveauSiteExpenseBreakdown as any)[year] = nouveauSiteExpenseBreakdown[2027];
});
// --------------------------

export const financialData = {
  consolidated: {
    yearlyData: consolidatedYearlyData,
    expenseBreakdown: consolidatedExpenseBreakdown
  },
  montigny: {
    yearlyData: montignyYearlyData,
    expenseBreakdown: montignyExpenseBreakdown
  },
  boissy: {
    yearlyData: boissyYearlyData,
    expenseBreakdown: boissyExpenseBreakdown
  },
  boissyExt: {
    yearlyData: moussyYearlyData,
    expenseBreakdown: moussyExpenseBreakdown
  },
  batiment4: {
    yearlyData: trappesYearlyData,
    expenseBreakdown: trappesExpenseBreakdown
  },
  nouveauSite: {
    yearlyData: nouveauSiteYearlyData,
    expenseBreakdown: nouveauSiteExpenseBreakdown
  },
};

export const realExpenses2026 = {
  consolidated: [
    { month: 'Jan', bp: 50000, reel: 52322 },
    { month: 'Fév', bp: 50000, reel: 46080 },
    { month: 'Mar', bp: 50000, reel: null },
    { month: 'Avr', bp: 50000, reel: null },
    { month: 'Mai', bp: 50000, reel: null },
    { month: 'Juin', bp: 50000, reel: null },
  ],
  montigny: [
    { month: 'Jan', bp: 25000, reel: 23604 },
    { month: 'Fév', bp: 25000, reel: 21872 },
    { month: 'Mar', bp: 25000, reel: null },
    { month: 'Avr', bp: 25000, reel: null },
    { month: 'Mai', bp: 25000, reel: null },
    { month: 'Juin', bp: 25000, reel: null },
  ],
  boissy: [
    { month: 'Jan', bp: 15000, reel: 15618 },
    { month: 'Fév', bp: 15000, reel: 14354 },
    { month: 'Mar', bp: 15000, reel: null },
    { month: 'Avr', bp: 15000, reel: null },
    { month: 'Mai', bp: 15000, reel: null },
    { month: 'Juin', bp: 15000, reel: null },
  ],
  boissyExt: [
    { month: 'Jan', bp: 3000, reel: 3457 },
    { month: 'Fév', bp: 3000, reel: 3100 },
    { month: 'Mar', bp: 3000, reel: null },
    { month: 'Avr', bp: 3000, reel: null },
    { month: 'Mai', bp: 3000, reel: null },
    { month: 'Juin', bp: 3000, reel: null },
  ],
  batiment4: [
    { month: 'Jan', bp: 7000, reel: 9643 },
    { month: 'Fév', bp: 7000, reel: 6754 },
    { month: 'Mar', bp: 7000, reel: null },
    { month: 'Avr', bp: 7000, reel: null },
    { month: 'Mai', bp: 7000, reel: null },
    { month: 'Juin', bp: 7000, reel: null },
  ],
  nouveauSite: [
    { month: 'Jan', bp: 0, reel: 0 },
    { month: 'Fév', bp: 0, reel: 0 },
    { month: 'Mar', bp: 0, reel: null },
    { month: 'Avr', bp: 0, reel: null },
    { month: 'Mai', bp: 0, reel: null },
    { month: 'Juin', bp: 0, reel: null },
  ]
};

export const buildingsList = [
  { id: 'consolidated', name: 'Consolidé (Global)' },
  { id: 'montigny', name: 'Site Montigny' },
  { id: 'boissy', name: 'Site Boissy' },
  { id: 'boissyExt', name: 'Site Moussy' },
  { id: 'batiment4', name: 'Site Trappes' },
  { id: 'nouveauSite', name: 'Nouveau Site' },
];

export const realRevenues2026 = {
  consolidated: [
    { month: 'Jan', bp: 85000, reel: 84560 },
    { month: 'Fév', bp: 85000, reel: 86185 },
    { month: 'Mar', bp: 85000, reel: null },
    { month: 'Avr', bp: 85000, reel: null },
    { month: 'Mai', bp: 85000, reel: null },
    { month: 'Juin', bp: 85000, reel: null },
  ],
  montigny: [
    { month: 'Jan', bp: 53000, reel: 52560 },
    { month: 'Fév', bp: 53000, reel: 54185 },
    { month: 'Mar', bp: 53000, reel: null },
    { month: 'Avr', bp: 53000, reel: null },
    { month: 'Mai', bp: 53000, reel: null },
    { month: 'Juin', bp: 53000, reel: null },
  ],
  boissy: [
    { month: 'Jan', bp: 30000, reel: 30000 },
    { month: 'Fév', bp: 30000, reel: 30000 },
    { month: 'Mar', bp: 30000, reel: null },
    { month: 'Avr', bp: 30000, reel: null },
    { month: 'Mai', bp: 30000, reel: null },
    { month: 'Juin', bp: 30000, reel: null },
  ],
  boissyExt: [
    { month: 'Jan', bp: 2000, reel: 2000 },
    { month: 'Fév', bp: 2000, reel: 2000 },
    { month: 'Mar', bp: 2000, reel: null },
    { month: 'Avr', bp: 2000, reel: null },
    { month: 'Mai', bp: 2000, reel: null },
    { month: 'Juin', bp: 2000, reel: null },
  ],
  batiment4: [
    { month: 'Jan', bp: 0, reel: 0 },
    { month: 'Fév', bp: 0, reel: 0 },
    { month: 'Mar', bp: 0, reel: null },
    { month: 'Avr', bp: 0, reel: null },
    { month: 'Mai', bp: 0, reel: null },
    { month: 'Juin', bp: 0, reel: null },
  ],
  nouveauSite: [
    { month: 'Jan', bp: 0, reel: 0 },
    { month: 'Fév', bp: 0, reel: 0 },
    { month: 'Mar', bp: 0, reel: null },
    { month: 'Avr', bp: 0, reel: null },
    { month: 'Mai', bp: 0, reel: null },
    { month: 'Juin', bp: 0, reel: null },
  ]
};

export const debtService2026 = {
  consolidated: 42769,
  montigny: 21480,
  boissy: 11936,
  boissyExt: 3755,
  batiment4: 5598,
  nouveauSite: 0
};

export const occupancyRates = {
  consolidated: 92,
  montigny: 100,
  boissy: 85,
  boissyExt: 90,
  batiment4: 80,
  nouveauSite: 0
};

export const realCashFlow2026 = {
  consolidated: [
    { month: 'Jan', reel: 9637 },
    { month: 'Fév', reel: 14292 },
    { month: 'Mar', reel: null },
    { month: 'Avr', reel: null },
    { month: 'Mai', reel: null },
    { month: 'Juin', reel: null },
  ],
  montigny: [
    { month: 'Jan', reel: 12728 },
    { month: 'Fév', reel: 15503 },
    { month: 'Mar', reel: null },
    { month: 'Avr', reel: null },
    { month: 'Mai', reel: null },
    { month: 'Juin', reel: null },
  ],
  boissy: [
    { month: 'Jan', reel: 7663 },
    { month: 'Fév', reel: 8904 },
    { month: 'Mar', reel: null },
    { month: 'Avr', reel: null },
    { month: 'Mai', reel: null },
    { month: 'Juin', reel: null },
  ],
  boissyExt: [
    { month: 'Jan', reel: -3414 },
    { month: 'Fév', reel: -3057 },
    { month: 'Mar', reel: null },
    { month: 'Avr', reel: null },
    { month: 'Mai', reel: null },
    { month: 'Juin', reel: null },
  ],
  batiment4: [
    { month: 'Jan', reel: -7340 },
    { month: 'Fév', reel: -7058 },
    { month: 'Mar', reel: null },
    { month: 'Avr', reel: null },
    { month: 'Mai', reel: null },
    { month: 'Juin', reel: null },
  ],
  nouveauSite: [
    { month: 'Jan', reel: 0 },
    { month: 'Fév', reel: 0 },
    { month: 'Mar', reel: null },
    { month: 'Avr', reel: null },
    { month: 'Mai', reel: null },
    { month: 'Juin', reel: null },
  ]
};

export const vatCredits2026: Record<string, number> = {
  'Jan': 46431,
  'Fév': 33259,
  'Mar': 55766,
  'Avr': 0,
  'Mai': 0,
  'Juin': 0,
};
