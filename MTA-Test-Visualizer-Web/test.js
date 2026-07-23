const fs = require('fs');
const html = fs.readFileSync('C:\\MY_PROJECTS_\\MTA-Test-Visualizer-Web\\index.html', 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
try { new Function(m[1]); console.log('JS OK'); }
catch(x) { console.log('FAIL:', x.message); }
console.log('#48494B borders:', (html.match(/#48494B/g) || []).length >= 3 ? 'PASS' : 'FAIL');
console.log('no gray in fileColors:', !html.includes("'#d4d8dd'") && !html.includes("'#3c3c3c'") ? 'PASS' : 'FAIL');
