const XLSX = require('xlsx');
const path = require('path');
const dl = '/Users/m3/Downloads';

const wb = XLSX.readFile(path.join(dl, 'reporting 4 batiments - avril 2026.xlsx'));
const ws = wb.Sheets['reporting cash 4 batiments'];
const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

// Print ALL rows with full columns to see the complete 2026 projection
console.log('=== FULL CASH SHEET (all rows, cols 0-30) ===');
data.forEach((row, i) => {
  const vals = row.map(v => typeof v === 'number' ? Math.round(v) : v);
  const nonEmpty = vals.filter(v => v !== '');
  if (nonEmpty.length > 0) {
    console.log('Row', i, ':', JSON.stringify(vals.slice(0, 30)));
  }
});

// Column mapping
console.log('\n=== COLUMN HEADERS (rows 1-3) ===');
for (let r = 1; r <= 3; r++) {
  const row = data[r] || [];
  const vals = row.map(v => typeof v === 'number' ? Math.round(v) : v);
  console.log('Row', r, '(cols 0-30):', JSON.stringify(vals.slice(0, 30)));
}

// Also get the individual site reporting sheets for full data
console.log('\n=== reporting conso 4 batiments (first 50 rows) ===');
const consoSheet = wb.Sheets['reporting conso 4 batiments'];
const consoData = XLSX.utils.sheet_to_json(consoSheet, { header: 1, defval: '' });
consoData.slice(0, 50).forEach((row, i) => {
  const vals = row.map(v => typeof v === 'number' ? Math.round(v) : v);
  const nonEmpty = vals.filter(v => v !== '');
  if (nonEmpty.length > 0) console.log('Row', i, ':', JSON.stringify(vals.slice(0, 20)));
});
