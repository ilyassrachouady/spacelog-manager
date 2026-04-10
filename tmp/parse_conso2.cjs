const XLSX = require('xlsx');
const path = require('path');
const dl = '/Users/m3/Downloads';

const wb = XLSX.readFile(path.join(dl, 'reporting 4 batiments - avril 2026.xlsx'));

// Get rows 49-80 of conso sheet
const consoSheet = wb.Sheets['reporting conso 4 batiments'];
const consoData = XLSX.utils.sheet_to_json(consoSheet, { header: 1, defval: '' });
console.log('=== CONSO rows 45-80 ===');
consoData.slice(45, 80).forEach((row, i) => {
  const vals = row.map(v => typeof v === 'number' ? Math.round(v) : v);
  const nonEmpty = vals.filter(v => v !== '');
  if (nonEmpty.length > 0) console.log('Row', i + 45, ':', JSON.stringify(vals.slice(0, 20)));
});

// Also check the Comparatif CA sheet
console.log('\n=== Comparatif CA (first 30 rows) ===');
const compSheet = wb.Sheets['Comparatif CA'];
const compData = XLSX.utils.sheet_to_json(compSheet, { header: 1, defval: '' });
compData.slice(0, 30).forEach((row, i) => {
  const vals = row.map(v => typeof v === 'number' ? Math.round(v) : v);
  const nonEmpty = vals.filter(v => v !== '');
  if (nonEmpty.length > 0) console.log('Row', i, ':', JSON.stringify(vals.slice(0, 20)));
});
