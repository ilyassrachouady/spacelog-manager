const XLSX = require('xlsx');
const path = require('path');

const dl = '/Users/m3/Downloads';

// ─── Parse Reporting file: find Prev et Cash ───
const wb1 = XLSX.readFile(path.join(dl, 'reporting 4 batiments - avril 2026.xlsx'));
console.log('=== REPORTING FILE ===');
console.log('Sheet names:', JSON.stringify(wb1.SheetNames));
console.log('');

wb1.SheetNames.forEach(name => {
  const lower = name.toLowerCase();
  if (lower.includes('prev') || lower.includes('cash') || lower.includes('treso') || lower.includes('tréso')) {
    console.log('--- Sheet:', name, '---');
    const ws = wb1.Sheets[name];
    const ref = ws['!ref'];
    console.log('Range:', ref);
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    data.slice(0, 80).forEach((row, i) => {
      const vals = row.map(v => typeof v === 'number' ? Math.round(v) : v);
      const nonEmpty = vals.filter(v => v !== '');
      if (nonEmpty.length > 0) console.log('Row', i, ':', JSON.stringify(vals.slice(0, 20)));
    });
    console.log('');
  }
});

// ─── Parse Leasing file ───
const wb2 = XLSX.readFile(path.join(dl, 'SUIVI CONTRAT LEASING WS 2025.xlsx'));
console.log('=== LEASING FILE ===');
console.log('Sheet names:', JSON.stringify(wb2.SheetNames));
console.log('');

wb2.SheetNames.forEach(name => {
  console.log('--- Sheet:', name, '---');
  const ws = wb2.Sheets[name];
  const ref = ws['!ref'];
  console.log('Range:', ref);
  const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  data.forEach((row, i) => {
    const vals = row.map(v => typeof v === 'number' ? Math.round(v) : v);
    const nonEmpty = vals.filter(v => v !== '');
    if (nonEmpty.length > 0) console.log('Row', i, ':', JSON.stringify(vals.slice(0, 20)));
  });
  console.log('');
});
